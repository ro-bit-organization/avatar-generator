'use client';

import { Prisma } from '@repo/db';
import { saveAs } from 'file-saver';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ChatMessage from '~/components/chat/message';
import { Button, buttonVariants } from '~/components/ui/button';
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

export default function FinalizedGeneration({ generation }: Props) {
	const t = useTranslations('generate');

	const [showImages, setShowImages] = useState<boolean>(false);

	function download(): void {
		generation.entries.forEach((entry) => saveAs(entry.imageUrl));
	}

	return (
		<div className="flex flex-1 flex-col gap-8 overflow-auto p-8">
			<div className="bg-card flex flex-col gap-4 rounded-md p-4">
				<ChatMessage text={t('messages.final_images')} onComplete={() => setShowImages(true)}>
					<Button
						type="button"
						className={cn('h-0 translate-y-4 overflow-hidden opacity-0 transition-all', {
							'h-auto translate-y-0 overflow-visible opacity-100': showImages,
							'pointer-events-none': !showImages
						})}
						onClick={() => download()}
					>
						{t('common.download')}
					</Button>
				</ChatMessage>

				<div
					className={cn('grid h-0 translate-y-4 grid-cols-3 gap-2 overflow-hidden opacity-0 transition-all', {
						'h-auto translate-y-0 overflow-visible opacity-100': showImages
					})}
				>
					{generation.entries.map((entry) => (
						<Image key={entry.id} src={entry.imageUrl} width="256" height="256" alt="avatar" className="mx-auto rounded-md" />
					))}
				</div>
			</div>

			<Link
				href="/generate"
				className={cn(
					buttonVariants({
						className:
							'mx-auto h-14 w-fit translate-y-4 overflow-hidden bg-gradient-to-tl from-blue-500 via-purple-600 via-40% to-blue-500 bg-[length:200%_200%] bg-left-top px-8 py-3 text-lg font-semibold !text-white opacity-0 transition-all duration-500 hover:bg-right-bottom'
					}),
					{
						'translate-y-0 overflow-visible opacity-100': showImages
					}
				)}
			>
				{t('common.new_generation')}
			</Link>
		</div>
	);
}
