import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LastGenerationsClient from './client.page';

export const metadata: Metadata = {
	title: 'Latest generations'
};

type Props = {
	searchParams: { page?: string };
};

const PAGE_SIZE = 25;

export default async function LastGenerations({ searchParams }: Props) {
	const page = searchParams.page ? searchParams.page : 1;

	const count = await prisma.generationEntry.count();

	if (searchParams.page === '1') {
		redirect('/community/last-generations');
	}

	if (isNaN(+page) || +page < 1 || (+page - 1) * PAGE_SIZE > count) {
		redirect('/community/last-generations');
	}

	const generations = await prisma.generationEntry.findMany({
		omit: {
			generationId: true,
			prompt: true
		},
		orderBy: {
			updatedAt: 'desc'
		},
		skip: (+page - 1) * PAGE_SIZE,
		take: PAGE_SIZE
	});

	return <LastGenerationsClient page={+page} count={count} generations={generations} />;
}
