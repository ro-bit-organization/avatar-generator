'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@repo/db';
import { saveAs } from 'file-saver';
import { ArrowRight, Download, RefreshCw, ShareIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import ChatMessage from '~/components/chat/message';
import ShareModal from '~/components/shared/share-modal';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { Textarea } from '~/components/ui/textarea';
import { useToast } from '~/hooks/use-toast';
import { revalidate } from '~/lib/actions/generate';
import { RegenerationSchema, regenerationSchema } from '~/lib/forms/generation';
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
	GENERATION_TYPEIN = 'generation_typein',
	DETAILS_TYPEIN = 'details_typein',
	PROMPT = 'prompt',
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
		id: StepId.GENERATION_TYPEIN,
		status: Status.IDLE
	},
	{
		id: StepId.DETAILS_TYPEIN,
		status: Status.HIDDEN
	},
	{
		id: StepId.PROMPT,
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

export default function OngoingGeneration({ generation }: Props) {
	const t = useTranslations();
	const [, startTransition] = useTransition();
	const { toast } = useToast();

	const formRef = useRef<HTMLFormElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [steps, setSteps] = useState<Step[]>(initialState);
	const [downloading, setDownloading] = useState<boolean>(false);
	const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);

	const form = useForm<RegenerationSchema>({
		resolver: zodResolver(regenerationSchema),
		values: {
			prompt: ''
		}
	});

	const prompt = form.watch('prompt');

	function getStep(id: StepId): Step {
		return steps.find((step) => step.id === id)!;
	}

	function getStepStatus(id: StepId): Status {
		return getStep(id).status;
	}

	function updateSteps(_steps: Step[]): void {
		setSteps((steps) => steps.map((step) => _steps.find(({ id }) => step.id === id) || step));
	}

	async function onSubmit({ prompt }: RegenerationSchema) {
		updateSteps([
			{ id: StepId.GENERATION_PENDING, status: Status.LOADING },
			{ id: StepId.ERROR, status: Status.HIDDEN }
		]);

		const formData = new FormData();

		formData.append('id', generation.id);
		formData.append('prompt', prompt);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/regenerate`, {
				method: 'POST',
				body: formData,
				credentials: 'include'
			});

			if (response.status === 204) {
				startTransition(async () => {
					await revalidate(generation.id);

					form.reset({
						prompt: ''
					});

					setSteps(
						steps.map((step) => ({
							...step,
							status: Status.HIDDEN
						}))
					);

					setTimeout(() => {
						setSteps(initialState);
					}, 50);

					textareaRef.current?.focus();
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

	function download(): void {
		setDownloading(true);

		fetch(`${process.env.NEXT_PUBLIC_API_URL}/generations/${generation.id}/download`, {
			credentials: 'include'
		})
			.then((response) => response.blob())
			.then((blob) => saveAs(blob, `${generation.id}.zip`))
			.catch(() => {
				toast({
					title: t('common.error_during_download'),
					variant: 'destructive'
				});
			})
			.finally(() => setDownloading(false));
	}

	return (
		<>
			<div className="flex h-full w-full flex-col gap-4">
				{getStepStatus(StepId.GENERATION_TYPEIN) !== Status.HIDDEN && (
					<Card className="flex flex-col gap-4 rounded-md p-4">
						<ChatMessage
							text={t('generate.messages.ongoing_images')}
							onComplete={() => {
								updateSteps([
									{ id: StepId.GENERATION_TYPEIN, status: Status.IDLE },
									{ id: StepId.DETAILS_TYPEIN, status: Status.WRITING }
								]);
							}}
						>
							<Button
								type="button"
								size="sm"
								loading={downloading}
								className={cn('translate-y-4 overflow-hidden opacity-0 transition-all', {
									'translate-y-0 overflow-visible opacity-100': getStepStatus(StepId.DETAILS_TYPEIN) !== Status.HIDDEN,
									'pointer-events-none': getStepStatus(StepId.DETAILS_TYPEIN) === Status.HIDDEN
								})}
								onClick={() => download()}
							>
								<Download className="mr-2 h-4 w-4" />
								{t('common.download')}
							</Button>
						</ChatMessage>

						<div
							className={cn('grid h-0 translate-y-4 grid-cols-3 gap-2 overflow-hidden opacity-0 transition-all', {
								'h-auto translate-y-0 overflow-visible opacity-100': getStepStatus(StepId.DETAILS_TYPEIN) !== Status.HIDDEN
							})}
						>
							{generation.entries.map((entry, index) => (
								<div key={entry.id} className="relative cursor-pointer" onClick={() => setShareImageUrl(entry.imageUrl)}>
									<Image
										src={entry.imageUrl}
										width="256"
										height="256"
										alt={t('generations.generation_ordinal_avatar', { index: index + 1 })}
										className="mx-auto rounded-md"
									/>
									<Button variant="outline" className="absolute right-2 top-2 h-6 w-6 p-1 md:h-8 md:w-8 md:p-2">
										<ShareIcon className="h-3 w-3 md:h-4 md:w-4" />
									</Button>
								</div>
							))}
						</div>
					</Card>
				)}

				{getStepStatus(StepId.DETAILS_TYPEIN) !== Status.HIDDEN && (
					<Card className="relative rounded-md border-purple-600 p-4">
						<div className="absolute inset-0 z-0 bg-blue-600 opacity-80 dark:bg-blue-500"></div>
						<div className="relative z-[1] flex flex-col gap-4 text-white">
							<ChatMessage
								skippable={false}
								text={t('generate.messages.regeneration_details_typein')
									.replaceAll('(strong)', '<strong>')
									.replaceAll('(/strong)', '</strong>')}
								onComplete={() => {
									updateSteps([
										{ id: StepId.GENERATION_TYPEIN, status: Status.IDLE },
										{ id: StepId.PROMPT, status: Status.IDLE }
									]);
									textareaRef.current?.focus();
								}}
							/>
						</div>
					</Card>
				)}

				{getStepStatus(StepId.GENERATION_PENDING) !== Status.HIDDEN && (
					<Card className="flex flex-col gap-4 rounded-md p-4">
						<ChatMessage
							skippable={false}
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

				<Form {...form}>
					<form
						ref={formRef}
						onSubmit={form.handleSubmit(onSubmit)}
						className={cn('h-0 translate-y-4 opacity-0 transition-all', {
							'h-auto translate-y-0 opacity-100': getStepStatus(StepId.PROMPT) !== Status.HIDDEN
						})}
					>
						<div className="shadow-xs border-bolt-elements-borderColor bg-bolt-elements-prompt-background rounded-lg border backdrop-blur">
							<svg>
								<defs>
									<linearGradient
										id="line-gradient"
										x1="20%"
										y1="0%"
										x2="-14%"
										y2="10%"
										gradientUnits="userSpaceOnUse"
										gradientTransform="rotate(-45)"
									>
										<stop offset="0%" stopColor="#9333ea" stopOpacity="0%"></stop>
										<stop offset="40%" stopColor="#9333ea" stopOpacity="80%"></stop>
										<stop offset="50%" stopColor="#9333ea" stopOpacity="80%"></stop>
										<stop offset="100%" stopColor="#9333ea" stopOpacity="0%"></stop>
									</linearGradient>
									<linearGradient id="shine-gradient">
										<stop offset="0%" stopColor="white" stopOpacity="0%"></stop>
										<stop offset="40%" stopColor="#c084fc" stopOpacity="80%"></stop>
										<stop offset="50%" stopColor="#c084fc" stopOpacity="80%"></stop>
										<stop offset="100%" stopColor="white" stopOpacity="0%"></stop>
									</linearGradient>
								</defs>
								<rect pathLength="100" strokeLinecap="round"></rect>
								<rect x="48" y="24" width="70" height="1"></rect>
							</svg>
							<div className="relative select-none">
								<FormField
									control={form.control}
									name="prompt"
									render={({ field }) => (
										<FormItem className="relative select-none">
											<FormControl>
												<>
													<Textarea
														{...field}
														autoFocus
														placeholder={t('generate.ongoing_generation.fields.regeneration.placeholder')}
														disabled={[Status.WRITING, Status.LOADING].includes(getStepStatus(StepId.GENERATION_PENDING))}
														className="bg-card max-h-[250px] min-h-[135px] w-full resize-y overflow-y-auto border-0 py-4 pl-4 pr-16 text-sm outline-0 focus-visible:ring-purple-600"
													/>

													<Button
														className={cn(
															'hover:brightness-94 color-white transition-theme absolute right-[22px] top-[18px] flex h-[34px] w-[34px] translate-y-4 items-center justify-center rounded-md bg-blue-400 p-1 opacity-0 transition-all',
															{
																'translate-y-0 opacity-100': !!prompt
															}
														)}
														disabled={getStepStatus(StepId.GENERATION_PENDING) === Status.LOADING}
													>
														<div className="text-lg">
															<ArrowRight className="h-6 w-6" />
														</div>
													</Button>
												</>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
					</form>
				</Form>
				<div
					className={cn('mx-auto flex translate-y-4 flex-col gap-4 opacity-0 transition-all', {
						'translate-y-0 overflow-visible opacity-100': getStepStatus(StepId.PROMPT) !== Status.HIDDEN
					})}
				>
					<span className="flex items-center justify-center py-4 text-center text-white">{t('generate.ongoing_generation.or_you_can')}</span>
					<Link
						href="/generate"
						className={cn(
							buttonVariants({
								className:
									'mx-auto h-14 w-fit overflow-hidden bg-gradient-to-tl from-blue-500 via-purple-600 via-40% to-blue-500 bg-[length:200%_200%] bg-left-top px-8 py-3 text-lg font-semibold !text-white transition-all duration-500 hover:bg-right-bottom'
							})
						)}
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						{t('generate.common.new_generation')}
					</Link>
				</div>
			</div>
			<ShareModal open={!!shareImageUrl} imageUrl={shareImageUrl} onOpenChange={() => setShareImageUrl(null)} />
		</>
	);
}
