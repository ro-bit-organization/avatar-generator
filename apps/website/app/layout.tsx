import type { Metadata } from 'next';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import localFont from 'next/font/local';
import Footer from '~/components/navigation/footer';
import Header from '~/components/navigation/header';
import ClientProviders from '~/components/shared/client-providers';
import TrackingProviders from '~/components/shared/tracking-providers';
import { Toaster } from '~/components/ui/toaster';
import { cn } from '~/lib/utils';

import './globals.css';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
});

const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
});

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();

	const title = `${t('app.name')} - Transform your photos into personalized avatars`;
	const description = `Turn your photos into cartoonish avatars with ${t('app.name')}. Quickly create personalized, high-quality avatars — ideal for social media and gaming!`;
	const url = process.env.NEXT_PUBLIC_WEBSITE_URL;

	return {
		title,
		description,
		alternates: {
			canonical: url
		},
		keywords: [
			'ai avatars',
			'cartoon avatars',
			'avatar creator',
			'cartoonify photos',
			'ai avatar generator',
			'personalized avatars',
			'avatar design online',
			'cartoon profile pictures',
			'toon avatar maker',
			'photo to cartoon avatar',
			'custom avatar creation',
			'cartoon yourself',
			'ai photo editor',
			'avatar app online',
			'avatar for social media',
			'animated avatar creator',
			'avatar ai platform',
			'create cartoon characters',
			'avatar customization',
			'digital avatars online'
		],
		robots: {
			index: true,
			follow: true
		},
		metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL as string),
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

type Props = Readonly<{
	children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={cn('flex min-h-screen flex-col bg-gray-50 antialiased dark:bg-gray-900', geistSans.variable, geistMono.variable)}>
				<ClientProviders locale={locale} messages={messages}>
					<Header />
					{children}
					<Toaster />
					<Footer />
				</ClientProviders>
				<TrackingProviders />
			</body>
		</html>
	);
}
