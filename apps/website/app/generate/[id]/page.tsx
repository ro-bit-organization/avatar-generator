import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '~/lib/auth';
import GenerateClient from './client.page';

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false
	}
};

type Props = {
	params: { id: string };
};

export default async function Generate({ params: { id } }: Props) {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/');
	}

	const generation = await prisma.generation.findFirst({
		where: { id },
		include: {
			entries: true
		}
	});

	if (!generation || generation.userId !== session.user.id) {
		redirect('/');
	}

	return (
		<div className="mx-auto flex w-screen max-w-screen-md flex-col">
			<GenerateClient generation={generation} />
		</div>
	);
}
