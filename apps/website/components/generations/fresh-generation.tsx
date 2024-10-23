'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { GenerationStyle, Prisma } from '@repo/db';
import { RefreshCw } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import BuyCreditsModal from '~/components/buy-credits-modal/buy-credits-modal';
import ChatMessage from '~/components/chat/message';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { FileInput, FileUploader } from '~/components/ui/file-uploader';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { revalidate } from '~/lib/actions/generate';
import { GENERATION_CREDITS_COST } from '~/lib/const';
import { generationSchema, GenerationSchema } from '~/lib/forms/generation';
import { cn } from '~/lib/utils';

/* eslint-disable @typescript-eslint/no-unused-vars */
const Generation = Prisma.validator<Prisma.GenerationDefaultArgs>()({
	include: {
		entries: true
	}
});

type Props = {
	generation: Prisma.GenerationGetPayload<typeof Generation>;
};

enum StepId {
	INTRO_TYPEIN = 'intro_typein',
	STYLE_TYPEIN = 'style_typein',
	STYLE_SELECT = 'style_select',
	IMAGE_TYPEIN = 'image_typein',
	IMAGE_SELECT = 'image_select',
	GENERATION_PENDING = 'generation_pending',
	ERROR = 'error'
}

enum Status {
	HIDDEN = 'hidden',
	WRITING = 'writing',
	LOADING = 'loading',
	IDLE = 'idle'
}

interface Step {
	id: StepId;
	status: Status;
	message?: string;
}

const initialState: Step[] = [
	{
		id: StepId.INTRO_TYPEIN,
		status: Status.WRITING
	},
	{
		id: StepId.STYLE_TYPEIN,
		status: Status.HIDDEN
	},
	{
		id: StepId.STYLE_SELECT,
		status: Status.HIDDEN
	},
	{
		id: StepId.IMAGE_TYPEIN,
		status: Status.HIDDEN
	},
	{
		id: StepId.IMAGE_SELECT,
		status: Status.HIDDEN
	},
	{
		id: StepId.GENERATION_PENDING,
		status: Status.HIDDEN
	},
	{
		id: StepId.ERROR,
		status: Status.HIDDEN
	}
];

export default function FreshGeneration({ generation }: Props) {
	const t = useTranslations();

	const { data: session, update } = useSession();

	const [, startTransition] = useTransition();

	const formRef = useRef<HTMLFormElement>(null);

	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [steps, setSteps] = useState<Step[]>(initialState);

	const form = useForm<GenerationSchema>({
		resolver: zodResolver(generationSchema),
		values: {
			style: generation.style,
			image: null
		}
	});

	const style = form.watch('style');
	const image = form.watch('image');

	function getStep(id: StepId): Step {
		return steps.find((step) => step.id === id)!;
	}

	function getStepStatus(id: StepId): Status {
		return getStep(id).status;
	}

	function updateSteps(_steps: Step[]): void {
		setSteps((steps) => steps.map((step) => _steps.find(({ id }) => step.id === id) || step));
	}

	async function onSubmit({ image, style }: GenerationSchema) {
		updateSteps([
			{ id: StepId.GENERATION_PENDING, status: Status.LOADING },
			{ id: StepId.ERROR, status: Status.HIDDEN }
		]);

		const formData = new FormData();

		formData.append('id', generation.id);
		formData.append('image', image!);
		formData.append('style', style!);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate`, {
				method: 'POST',
				body: formData,
				credentials: 'include'
			});

			if (response.status === 204) {
				startTransition(async () => {
					await revalidate(generation.id);

					update();
				});

				return;
			}

			const { error }: { error: string } = await response.json();

			if (error) {
				throw new Error(error);
			}
		} catch (e) {
			updateSteps([
				{ id: StepId.GENERATION_PENDING, status: Status.HIDDEN },
				{
					id: StepId.ERROR,
					status: Status.WRITING,
					message: e instanceof Error ? t('generate.messages.error', { error: e.message.toLowerCase() }) : t('generate.messages.default_error')
				}
			]);
		}
	}

	return (
		<>
			<div className="flex h-full w-full flex-col gap-4">
				<Form {...form}>
					<form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-8">
						{getStepStatus(StepId.INTRO_TYPEIN) !== Status.HIDDEN && (
							<Card className="flex flex-col gap-4 rounded-md p-4">
								<ChatMessage
									text={t('generate.messages.intro_typein', {
										cost: GENERATION_CREDITS_COST
									})
										.replaceAll('(strong)', '<strong>')
										.replaceAll('(/strong)', '</strong>')}
									onComplete={() => updateSteps([{ id: StepId.STYLE_TYPEIN, status: Status.WRITING }])}
								/>
							</Card>
						)}

						{getStepStatus(StepId.STYLE_TYPEIN) !== Status.HIDDEN && (
							<Card className="flex flex-col gap-4 rounded-md p-4">
								<ChatMessage
									text={t('generate.messages.style_select').replaceAll('(strong)', '<strong>').replaceAll('(/strong)', '</strong>')}
									onComplete={() =>
										updateSteps([
											{ id: StepId.STYLE_TYPEIN, status: Status.IDLE },
											{ id: StepId.STYLE_SELECT, status: Status.IDLE },
											{ id: StepId.IMAGE_TYPEIN, status: style ? Status.WRITING : Status.HIDDEN }
										])
									}
								/>
							</Card>
						)}

						<div
							className={cn('grid h-0 translate-y-4 grid-cols-1 gap-4 opacity-0 transition-all sm:grid-cols-2 md:grid-cols-3', {
								'h-auto translate-y-0 opacity-100': getStepStatus(StepId.STYLE_SELECT) !== Status.HIDDEN,
								'pointer-events-none': getStepStatus(StepId.STYLE_SELECT) === Status.HIDDEN
							})}
						>
							{Object.values(GenerationStyle).map((_style) => (
								<Button
									key={_style}
									type="button"
									className={cn('capitalize', {
										'pointer-events-none': !!style,
										'bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-white': _style === style
									})}
									onClick={() => {
										form.setValue('style', _style);
										updateSteps([{ id: StepId.IMAGE_TYPEIN, status: Status.WRITING }]);
									}}
								>
									{t(`generate.styles.${_style}`)}
								</Button>
							))}
						</div>

						{getStepStatus(StepId.IMAGE_TYPEIN) !== Status.HIDDEN && (
							<Card className="flex flex-col gap-4 rounded-md p-4">
								<ChatMessage
									text={t('generate.messages.image_select')}
									onComplete={() =>
										updateSteps([
											{ id: StepId.IMAGE_TYPEIN, status: Status.IDLE },
											{ id: StepId.IMAGE_SELECT, status: Status.IDLE }
										])
									}
								/>
							</Card>
						)}

						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem
									className={cn('h-0 w-full flex-1 translate-y-4 overflow-hidden opacity-0 transition-all', {
										'h-auto translate-y-0 overflow-visible opacity-100': getStepStatus(StepId.IMAGE_SELECT) !== Status.HIDDEN,
										'pointer-events-none': getStepStatus(StepId.IMAGE_SELECT) === Status.HIDDEN
									})}
								>
									<FormControl>
										<FileUploader
											value={field.value ? [field.value] : []}
											onValueChange={(files) => {
												const id = nanoid(10);
												const file = files?.[0];

												if (!file) {
													field.onChange(null);
													return;
												}

												if (session!.user!.credits < GENERATION_CREDITS_COST) {
													setModalOpen(true);
													return;
												}

												field.onChange(
													new File([file], id, {
														type: file.type
													})
												);

												formRef.current?.requestSubmit();
											}}
											useLOF={false}
											disabled={!!image}
											dropzoneOptions={{
												accept: {
													'image/*': ['.png', '.jpeg', '.jpg', '.webp']
												},
												maxSize: 1024 * 1024 * 4,
												multiple: false
											}}
											className="relative rounded-lg bg-gray-800 p-2 dark:bg-white"
										>
											<FileInput className="outline-input outline-dashed outline-1">
												<div className="flex w-full flex-col items-center justify-center pb-4 pt-3">
													<div
														className={cn('mb-4 flex gap-4', {
															hidden: !field.value,
															'pointer-events-none': getStepStatus(StepId.GENERATION_PENDING) === Status.LOADING
														})}
													>
														<div className="w-[340px]">
															{field.value && (
																<AspectRatio ratio={1 / 1}>
																	<Image
																		unoptimized
																		src={URL.createObjectURL(field.value)}
																		alt="Original image"
																		fill
																		className="rounded-md object-cover"
																	/>
																</AspectRatio>
															)}
														</div>
													</div>
													<svg
														className="mb-3 h-8 w-8 text-white dark:text-gray-500"
														aria-hidden="true"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 20 16"
													>
														<path
															stroke="currentColor"
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
														/>
													</svg>
													<p className="mb-1 text-sm text-white dark:text-gray-500">
														<span className="font-semibold">{t('components.file_picker.placeholder')}</span>
													</p>
													<p className="text-xs text-white dark:text-gray-500">PNG, JPG or WEBP</p>
												</div>
											</FileInput>
										</FileUploader>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{getStepStatus(StepId.GENERATION_PENDING) !== Status.HIDDEN && (
							<Card className="flex flex-col gap-4 rounded-md p-4">
								<ChatMessage
									text={t('generate.messages.ongoing_generation')}
									loading={getStepStatus(StepId.GENERATION_PENDING) === Status.LOADING}
								/>
							</Card>
						)}

						{getStepStatus(StepId.ERROR) !== Status.HIDDEN && (
							<Card className="bg-destructive flex flex-col gap-4 rounded-md p-4">
								<ChatMessage text={getStep(StepId.ERROR).message!} onComplete={() => updateSteps([{ id: StepId.ERROR, status: Status.IDLE }])}>
									<Button
										type="button"
										size="sm"
										onClick={() => {
											formRef.current?.requestSubmit();
										}}
									>
										<RefreshCw className="mr-2 h-4 w-4" />
										{t('common.retry')}
									</Button>
								</ChatMessage>
							</Card>
						)}
					</form>
				</Form>
			</div>
			<BuyCreditsModal open={modalOpen} onOpenChange={setModalOpen} />
		</>
	);
}
