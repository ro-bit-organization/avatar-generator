import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '~/lib/auth';
import GenerateClient from './client.page';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { id } }: { params: { id: string } }): Promise<Metadata> {
	const t = await getTranslations();

	const title = `Generation #${id} - ${t('app.name')}`;
	const description = `Create your own cartoon avatar with just a few clicks. Upload a photo and instantly generate a personalized, high-quality avatar — perfect for social media, gaming, and more!"`;
	const url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/generate/${id}`;

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
