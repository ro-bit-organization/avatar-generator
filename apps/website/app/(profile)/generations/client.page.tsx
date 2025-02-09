'use client';

import { Prisma } from '@repo/db';
import saveAs from 'file-saver';
import { Download, ShareIcon } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ShareModal from '~/components/shared/share-modal';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '~/components/ui/pagination';
import { useToast } from '~/hooks/use-toast';

const PAGE_SIZE = 10;

const Generation = Prisma.validator<Prisma.GenerationDefaultArgs>()({
	include: {
		entries: true
	}
});

type Props = {
	page: number;
	count: number;
	generations: Prisma.GenerationGetPayload<typeof Generation>[];
};

export default function Generations({ page, count, generations }: Props) {
	const format = useFormatter();
	const t = useTranslations();
	const { toast } = useToast();
	const [downloadGenerationId, setDownloadGenerationId] = useState<string | null>(null);
	const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);

	function download(generationId: string): void {
		setDownloadGenerationId(generationId);

		fetch(`${process.env.NEXT_PUBLIC_API_URL}/generations/${generationId}/download`, {
			credentials: 'include'
		})
			.then((response) => response.blob())
			.then((blob) => saveAs(blob, `${generationId}.zip`))
			.catch(() => {
				toast({
					title: t('common.error_during_download'),
					variant: 'destructive'
				});
			})
			.finally(() => setDownloadGenerationId(null));
	}

	function getPageUrl(page: number): string {
		const url = new URL(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/generations`);

		if (page === 1) {
			url.searchParams.delete('page');
		} else {
			url.searchParams.set('page', '' + page);
		}

		return url.toString();
	}

	return (
		<>
			<main className="mx-auto w-screen max-w-screen-md flex-1 p-4">
				<div className="flex flex-col">
					<div className="mb-4 flex flex-col gap-2 border-b pb-4">
						<h1 className="text-3xl font-bold">{t('generations.title')}</h1>
						<h2 className="text-muted-foreground">{t('generations.description', { appName: t('app.name') })}</h2>
					</div>
					{generations.length === 0 && <span>{t('generations.no_entries')}</span>}
					<div className="space-y-4">
						{generations.map((generation) => (
							<Card key={generation.id} className="overflow-hidden rounded-md">
								<CardContent className="flex flex-col justify-between gap-8 p-4 md:flex-row md:gap-0">
									<div className="flex flex-col gap-4">
										<div>
											<Link
												href={`/generate/${generation.id}`}
												className="block overflow-hidden text-ellipsis font-medium hover:text-blue-600 dark:hover:text-blue-500"
											>
												{t('generations.generation_id', { id: generation.id })}
											</Link>
											<p className="text-sm text-gray-500">
												{format.dateTime(generation.updatedAt, {
													year: 'numeric',
													month: 'short',
													day: 'numeric',
													hour: 'numeric',
													minute: 'numeric'
												})}
											</p>
										</div>
										<div className="flex space-x-4">
											{!generation.entries.length && <span className="text-muted-foreground">{t('generations.no_entries')}</span>}
											{generation.entries.map((entry, index) => (
												<div key={entry.id} className="relative cursor-pointer" onClick={() => setShareImageUrl(entry.imageUrl)}>
													<Image
														src={entry.imageUrl}
														width="96"
														height="96"
														alt={t('generations.generation_ordinal_avatar', { index: index + 1 })}
														className="h-24 w-24 rounded-md object-cover shadow-sm"
													/>
													<Button variant="outline" className="absolute right-2 top-2 h-6 w-6 p-1">
														<ShareIcon className="h-3 w-3" />
													</Button>
												</div>
											))}
										</div>
									</div>
									{generation.entries.length ? (
										<Button
											size="sm"
											type="button"
											loading={downloadGenerationId === generation.id}
											disabled={!!downloadGenerationId}
											onClick={() => download(generation.id)}
										>
											<Download className="mr-2 h-4 w-4" />
											{t('common.download')}
										</Button>
									) : null}
								</CardContent>
							</Card>
						))}
					</div>
					{count > PAGE_SIZE && (
						<Pagination className="mt-6">
							<PaginationContent>
								{new Array(Math.ceil(count / PAGE_SIZE)).fill('').map((_, index) => (
									<PaginationItem key={index}>
										<PaginationLink href={getPageUrl(index + 1)} isActive={+page === index + 1}>
											{index + 1}
										</PaginationLink>
									</PaginationItem>
								))}
							</PaginationContent>
						</Pagination>
					)}
				</div>
			</main>
			<ShareModal open={!!shareImageUrl} imageUrl={shareImageUrl} onOpenChange={() => setShareImageUrl(null)} />
		</>
	);
}
