'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@repo/db';
import { saveAs } from 'file-saver';
import { ArrowRight, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import ChatMessage from '~/components/chat/message';
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

enum Step {
	GENERATION_TYPEIN = 'generation_typein',
	PROMPT = 'prompt',
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
		id: Step.GENERATION_TYPEIN,
		status: Status.IDLE
	},
	{
		id: Step.PROMPT,
		status: Status.HIDDEN
	},
	{
		id: Step.GENERATION_PENDING,
		status: Status.HIDDEN
	}
];

export default function OngoingGeneration({ generation }: Props) {
	const t = useTranslations();
	const { toast } = useToast();
	const [, startTransition] = useTransition();

	const formRef = useRef<HTMLFormElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [steps, setSteps] = useState<
		{
			id: Step;
			status: Status;
		}[]
	>(initialState);

	const form = useForm<RegenerationSchema>({
		resolver: zodResolver(regenerationSchema),
		values: {
			prompt: ''
		}
	});

	const prompt = form.watch('prompt');

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

	async function onSubmit({ prompt }: RegenerationSchema) {
		updateSteps([{ id: Step.GENERATION_PENDING, status: Status.WRITING }]);

		const formData = new FormData();

		formData.append('id', generation.id);
		formData.append('prompt', prompt);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/regenerate`, {
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

	function download(): void {
		generation.entries.forEach((entry) => saveAs(entry.imageUrl));
	}

	return (
		<div className="flex h-full w-full flex-col gap-4">
			{getStepStatus(Step.GENERATION_TYPEIN) !== Status.HIDDEN && (
				<Card className="flex flex-col gap-4 rounded-md p-4">
					<ChatMessage
						text={t('generate.messages.ongoing_images')}
						onComplete={() => {
							updateSteps([
								{ id: Step.GENERATION_TYPEIN, status: Status.IDLE },
								{ id: Step.PROMPT, status: Status.IDLE }
							]);
							textareaRef.current?.focus();
						}}
					>
						<Button
							type="button"
							size="sm"
							className={cn('translate-y-4 overflow-hidden opacity-0 transition-all', {
								'translate-y-0 overflow-visible opacity-100': getStepStatus(Step.PROMPT) !== Status.HIDDEN,
								'pointer-events-none': getStepStatus(Step.PROMPT) === Status.HIDDEN
							})}
							onClick={() => download()}
						>
							<Download className="mr-2 h-4 w-4" />
							{t('common.download')}
						</Button>
					</ChatMessage>

					<div
						className={cn('grid h-0 translate-y-4 grid-cols-3 gap-2 overflow-hidden opacity-0 transition-all', {
							'h-auto translate-y-0 overflow-visible opacity-100': getStepStatus(Step.PROMPT) !== Status.HIDDEN
						})}
					>
						{generation.entries.map((entry) => (
							<Image key={entry.id} src={entry.imageUrl} width="256" height="256" alt="avatar" className="mx-auto rounded-md" />
						))}
					</div>
				</Card>
			)}
			{getStepStatus(Step.GENERATION_PENDING) !== Status.HIDDEN && (
				<Card className="flex flex-col gap-4 rounded-md p-4">
					<ChatMessage
						text={t('generate.messages.ongoing_generation')}
						onComplete={() => updateSteps([{ id: Step.GENERATION_PENDING, status: Status.LOADING }])}
					/>
				</Card>
			)}
			<Form {...form}>
				<form
					ref={formRef}
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn('h-0 translate-y-4 opacity-0 transition-all', {
						'h-auto translate-y-0 opacity-100': getStepStatus(Step.PROMPT) !== Status.HIDDEN
					})}
				>
					<div className="_PromptContainer_1c9j5_1 shadow-xs border-bolt-elements-borderColor bg-bolt-elements-prompt-background rounded-lg border backdrop-blur">
						<svg className="_PromptEffectContainer_1c9j5_5">
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
							<rect className="_PromptEffectLine_1c9j5_14" pathLength="100" strokeLinecap="round"></rect>
							<rect className="_PromptShine_1c9j5_26" x="48" y="24" width="70" height="1"></rect>
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
													disabled={[Status.WRITING, Status.LOADING].includes(getStepStatus(Step.GENERATION_PENDING))}
													className="bg-card max-h-[250px] min-h-[135px] w-full resize-y overflow-y-auto border-0 py-4 pl-4 pr-16 text-sm outline-0 focus-visible:ring-purple-600"
												/>

												<Button
													className={cn(
														'hover:brightness-94 color-white transition-theme absolute right-[22px] top-[18px] flex h-[34px] w-[34px] translate-y-4 items-center justify-center rounded-md bg-blue-400 p-1 opacity-0 transition-all',
														{
															'translate-y-0 opacity-100': !!prompt
														}
													)}
													disabled={getStepStatus(Step.GENERATION_PENDING) === Status.LOADING}
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
					'translate-y-0 overflow-visible opacity-100': getStepStatus(Step.PROMPT) !== Status.HIDDEN
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
					{t('generate.common.new_generation')}
				</Link>
			</div>
		</div>
	);
}
