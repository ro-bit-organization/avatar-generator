'use client';

import { Prisma } from '@repo/db';
import saveAs from 'file-saver';
import { Download } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '~/components/ui/pagination';

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

	function download(generation: (typeof generations)[0]): void {
		generation.entries.forEach((entry) => saveAs(entry.imageUrl));
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
		<main className="mx-auto w-screen max-w-screen-md p-4">
			<div className="flex flex-col">
				<h1 className="mb-2 text-2xl font-bold">{t('generations.title')}</h1>
				<div className="space-y-4">
					{generations?.map((generation) => (
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
											<Image
												key={entry.id}
												src={entry.imageUrl}
												width="80"
												height="80"
												alt={t('generations.generation_image', { index: index + 1 })}
												className="h-20 w-20 rounded-md object-cover shadow-sm"
											/>
										))}
									</div>
								</div>
								{generation.entries.length ? (
									<Button size="sm" type="button" onClick={() => download(generation)}>
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
	);
}
