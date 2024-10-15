import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '~/lib/auth';
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
	const session = await auth();

	if (!session) {
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
