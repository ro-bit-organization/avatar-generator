import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '~/lib/auth';
import GenerationsClient from './client.page';

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false
	}
};

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

	if (isNaN(+page) || +page < 1 || (+page - 1) * 10 > count) {
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
		skip: (+page - 1) * 10,
		take: 10
	});

	return <GenerationsClient page={+page} count={count} generations={generations} />;
}
