import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '~/lib/auth';

export const metadata: Metadata = {
	title: 'Generate a new avatar',
	robots: {
		index: false,
		follow: false
	}
};

export default async function Generate() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/');
	}

	const generation = await prisma.generation.create({
		data: {
			userId: session.user.id!
		}
	});

	redirect(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/generate/${generation.id}`);
}
