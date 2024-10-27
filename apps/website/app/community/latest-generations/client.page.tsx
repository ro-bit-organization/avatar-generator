'use client';

import { Prisma } from '@repo/db';
import { ShareIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import ShareModal from '~/components/shared/share-modal';
import { Button } from '~/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '~/components/ui/pagination';

const PAGE_SIZE = 30;

const Generation = Prisma.validator<Prisma.GenerationEntryDefaultArgs>()({
	omit: {
		generationId: true,
		prompt: true
	}
});

type Props = {
	page: number;
	count: number;
	generations: Prisma.GenerationEntryGetPayload<typeof Generation>[];
};

export default function LastGenerations({ page, count, generations }: Props) {
	const t = useTranslations();
	const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);

	function getPageUrl(page: number): string {
		const url = new URL(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/community/latest-generations`);

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
						<h1 className="text-3xl font-bold">{t('latest_generations.title')}</h1>
						<h2 className="text-muted-foreground">{t('latest_generations.description', { appName: t('app.name') })}</h2>
					</div>
					{generations.length === 0 && <span>{t('latest_generations.no_entries')}</span>}
					<div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-3 sm:grid-cols-5">
						{generations.map((generation) => (
							<div key={generation.id} className="relative cursor-pointer" onClick={() => setShareImageUrl(generation.imageUrl)}>
								<Image
									key={generation.id}
									src={generation.imageUrl}
									alt="Avatar"
									width="256"
									height="256"
									className="aspect-square w-full rounded-md"
								/>
								<Button variant="outline" className="absolute right-2 top-2 h-6 w-6 p-1 sm:h-8 sm:w-8 sm:p-2">
									<ShareIcon className="h-3 w-3 sm:h-4 sm:w-4" />
								</Button>
							</div>
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
