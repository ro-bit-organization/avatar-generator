'use client';

import { Prisma } from '@repo/db';
import { saveAs } from 'file-saver';
import { Download, RefreshCw, ShareIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ChatMessage from '~/components/chat/message';
import ShareModal from '~/components/shared/share-modal';
import { Button, buttonVariants } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { useToast } from '~/hooks/use-toast';
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
	const t = useTranslations();
	const { toast } = useToast();

	const [showImages, setShowImages] = useState<boolean>(false);
	const [downloading, setDownloading] = useState<boolean>(false);
	const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);

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
			<div className="flex flex-1 flex-col gap-8">
				<Card className="flex flex-col gap-4 rounded-md p-4">
					<ChatMessage text={t('generate.messages.final_images')} onComplete={() => setShowImages(true)}>
						<Button
							type="button"
							size="sm"
							loading={downloading}
							className={cn('translate-y-4 overflow-hidden opacity-0 transition-all', {
								'translate-y-0 overflow-visible opacity-100': showImages,
								'pointer-events-none': !showImages
							})}
							onClick={() => download()}
						>
							<Download className="mr-2 h-4 w-4" />
							{t('common.download')}
						</Button>
					</ChatMessage>

					<div
						className={cn('grid h-0 translate-y-4 grid-cols-3 gap-2 overflow-hidden opacity-0 transition-all', {
							'h-auto translate-y-0 overflow-visible opacity-100': showImages
						})}
					>
						{generation.entries.map((entry, index) => (
							<div key={entry.id} className="relative cursor-pointer" onClick={() => setShareImageUrl(entry.imageUrl)}>
								<Image
									key={entry.id}
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
					<RefreshCw className="mr-2 h-4 w-4" />
					{t('generate.common.new_generation')}
				</Link>
			</div>

			<ShareModal open={!!shareImageUrl} imageUrl={shareImageUrl} onOpenChange={() => setShareImageUrl(null)} />
		</>
	);
}
