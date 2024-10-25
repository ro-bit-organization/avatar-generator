import { GenerationVisibility, prisma } from '@repo/db';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import LastGenerationsClient from './client.page';

function getPageUrl(page: number): string {
	const url = new URL(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/community/latest-generations`);

	if (page === 1) {
		url.searchParams.delete('page');
	} else {
		url.searchParams.set('page', '' + page);
	}

	return url.toString();
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
	const t = await getTranslations();

	const title = `Explore Latest Generations - ${t('app.name')}`;
	const description = `Explore the latest cartoon avatars on ${t('app.name')}. Discover personalized, high-quality avatars created by users — ideal for social media and gaming!`;
	const url = getPageUrl(searchParams.page ? +searchParams.page : 1);

	return {
		title,
		description,
		alternates: {
			canonical: url
		},
		openGraph: {
			title,
			description,
			url,
			siteName: title,
			images: [
				{
					url: `/images/logo.png`,
					width: 512,
					height: 512
				}
			],
			locale: 'en_US',
			type: 'website'
		}
	};
}

type Props = {
	searchParams: { page?: string };
};

const PAGE_SIZE = 25;

export default async function LastGenerations({ searchParams }: Props) {
	const page = searchParams.page ? searchParams.page : 1;

	const count = await prisma.generationEntry.count();

	if (searchParams.page === '1') {
		redirect('/community/latest-generations');
	}

	if (isNaN(+page) || +page < 1 || (+page - 1) * PAGE_SIZE > count) {
		redirect('/community/latest-generations');
	}

	const generations = await prisma.generationEntry.findMany({
		where: {
			generation: {
				visibility: GenerationVisibility.PUBLIC
			}
		},
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
