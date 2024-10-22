import { prisma } from '@repo/db';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { authOptions } from '~/lib/auth';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();

	const title = `Generate - ${t('app.name')}`;
	const description = `Create your own cartoon avatar with just a few clicks. Upload a photo and instantly generate a personalized, high-quality avatar — perfect for social media, gaming, and more!"`;
	const url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/generate`;

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
