'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { GenerationStyle, Prisma } from '@repo/db';
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
import { useToast } from '~/hooks/use-toast';
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

enum Step {
	INTRO_TYPEIN = 'intro_typein',
	STYLE_TYPEIN = 'style_typein',
	STYLE_SELECT = 'style_select',
	IMAGE_TYPEIN = 'image_typein',
	IMAGE_SELECT = 'image_select',
	GENERATION_PENDING = 'generation_pending'
}

enum Status {
	HIDDEN = 'hidden',
	WRITING = 'writing',
	LOADING = 'loading',
	IDLE = 'idle'
}

const initialState: {
	id: Step;
	status: Status;
}[] = [
	{
		id: Step.INTRO_TYPEIN,
		status: Status.WRITING
	},
	{
		id: Step.STYLE_TYPEIN,
		status: Status.HIDDEN
	},
	{
		id: Step.STYLE_SELECT,
		status: Status.HIDDEN
	},
	{
		id: Step.IMAGE_TYPEIN,
		status: Status.HIDDEN
	},
	{
		id: Step.IMAGE_SELECT,
		status: Status.HIDDEN
	},
	{
		id: Step.GENERATION_PENDING,
		status: Status.HIDDEN
	}
];

export default function FreshGeneration({ generation }: Props) {
	const t = useTranslations();

	const { toast } = useToast();
	const { data: session, update } = useSession();

	const [, startTransition] = useTransition();

	const formRef = useRef<HTMLFormElement>(null);

	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [steps, setSteps] = useState<
		{
			id: Step;
			status: Status;
		}[]
	>(initialState);

	const form = useForm<GenerationSchema>({
		resolver: zodResolver(generationSchema),
		values: {
			style: generation.style,
			image: null
		}
	});

	const style = form.watch('style');
	const image = form.watch('image');

	function getStepStatus(id: Step): Status {
		return steps.find((step) => step.id === id)!.status;
	}

	function updateSteps(
		_steps: {
			id: Step;
			status: Status;
		}[]
	): void {
		setSteps(steps.map((step) => _steps.find(({ id }) => step.id === id) || step));
	}

	async function onSubmit({ image, style }: GenerationSchema) {
		updateSteps([{ id: Step.GENERATION_PENDING, status: Status.WRITING }]);

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

			const { error } = await response.json();

			if (error) {
				throw error;
			}
		} catch (e) {
			//show toast or show error message
			// toast({
			// 	variant: 'destructive',
			// 	description: response?.error
			// });
		}
	}

	return (
		<>
			<div className="flex h-full w-full flex-col gap-4">
				<Form {...form}>
					<form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-8">
						{getStepStatus(Step.INTRO_TYPEIN) !== Status.HIDDEN && (
							<Card className="flex flex-col gap-4 rounded-md p-4">
								<ChatMessage
									text={t('generate.messages.intro_typein', {
										cost: GENERATION_CREDITS_COST
									})
										.replaceAll('(strong)', '<strong>')
										.replaceAll('(/strong)', '</strong>')}
									onComplete={() => updateSteps([{ id: Step.STYLE_TYPEIN, status: Status.WRITING }])}
								/>
							</Card>
						)}
						{getStepStatus(Step.STYLE_TYPEIN) !== Status.HIDDEN && (
							<Card className="flex flex-col gap-4 rounded-md p-4">
								<ChatMessage
									text={t('generate.messages.style_select').replaceAll('(strong)', '<strong>').replaceAll('(/strong)', '</strong>')}
									onComplete={() =>
										updateSteps([
											{ id: Step.STYLE_TYPEIN, status: Status.IDLE },
											{ id: Step.STYLE_SELECT, status: Status.IDLE },
											{ id: Step.IMAGE_TYPEIN, status: style ? Status.WRITING : Status.HIDDEN }
										])
									}
								/>
							</Card>
						)}

						<div
							className={cn('grid h-0 translate-y-4 grid-cols-1 gap-4 opacity-0 transition-all sm:grid-cols-2 md:grid-cols-3', {
								'h-auto translate-y-0 opacity-100': getStepStatus(Step.STYLE_SELECT) !== Status.HIDDEN,
								'pointer-events-none': getStepStatus(Step.STYLE_SELECT) === Status.HIDDEN
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
										updateSteps([{ id: Step.IMAGE_TYPEIN, status: Status.WRITING }]);
									}}
								>
									{t(`generate.styles.${_style}`)}
								</Button>
							))}
						</div>

						{getStepStatus(Step.IMAGE_TYPEIN) !== Status.HIDDEN && (
							<Card className="flex flex-col gap-4 rounded-md p-4">
								<ChatMessage
									text={t('generate.messages.image_select')}
									onComplete={() =>
										updateSteps([
											{ id: Step.IMAGE_TYPEIN, status: Status.IDLE },
											{ id: Step.IMAGE_SELECT, status: Status.IDLE }
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
										'h-auto translate-y-0 overflow-visible opacity-100': getStepStatus(Step.IMAGE_SELECT) !== Status.HIDDEN,
										'pointer-events-none': getStepStatus(Step.IMAGE_SELECT) === Status.HIDDEN
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
															'pointer-events-none': getStepStatus(Step.GENERATION_PENDING) === Status.LOADING
														})}
													>
														<div className="w-[340px]">
															{field.value && (
																<AspectRatio ratio={1 / 1}>
																	<Image
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

						{getStepStatus(Step.GENERATION_PENDING) !== Status.HIDDEN && (
							<Card className="flex flex-col gap-4 rounded-md p-4">
								<ChatMessage
									text={t('generate.messages.ongoing_generation')}
									loading={getStepStatus(Step.GENERATION_PENDING) === Status.LOADING}
									onComplete={() => updateSteps([{ id: Step.GENERATION_PENDING, status: Status.LOADING }])}
								/>
							</Card>
						)}
					</form>
				</Form>
			</div>
			<BuyCreditsModal open={modalOpen} onOpenChange={setModalOpen} />
		</>
	);
}
