import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '~/lib/auth';
import GenerationsClient from './client.page';
import { getTranslations } from 'next-intl/server';

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

	const title = `My Generations - ${t('app.name')}`;
	const description = `Manage all your cartoon avatars in one place. This page lets you view, download, and share your personalized avatars, or create new ones.`;
	const url = getPageUrl(searchParams.page ? +searchParams.page : 1);

	return {
		title,
		description,
		alternates: {
			canonical: url
		},
		robots: {
			index: false,
			follow: false
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

const PAGE_SIZE = 10;

type Props = {
	searchParams: { page?: string };
};

export default async function Generations({ searchParams }: Props) {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/');
	}

	const page = searchParams.page ? searchParams.page : 1;

	const count = await prisma.generation.count({
		where: { userId: session.user.id }
	});

	if (searchParams.page === '1') {
		redirect('/generations');
	}

	if (isNaN(+page) || +page < 1 || (+page - 1) * PAGE_SIZE > count) {
		redirect('/generations');
	}

	const generations = await prisma.generation.findMany({
		where: { userId: session.user.id },
		include: {
			entries: true
		},
		orderBy: {
			updatedAt: 'desc'
		},
		skip: (+page - 1) * PAGE_SIZE,
		take: PAGE_SIZE
	});

	return <GenerationsClient page={+page} count={count} generations={generations} />;
}
