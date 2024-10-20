'use client';

import { Prisma } from '@repo/db';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '~/components/ui/pagination';

const PAGE_SIZE = 25;

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

	function getPageUrl(page: number): string {
		const url = new URL(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/community/last-generations`);

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
				<h1 className="mb-2 text-2xl font-bold">{t('latest-generations.title')}</h1>
				<div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
					{generations.map((generation) => (
						<Image key={generation.id} src={generation.imageUrl} alt="Avatar" width="256" height="256" className="rounded-md" />
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
