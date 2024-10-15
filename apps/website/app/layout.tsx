import type { Metadata } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import localFont from 'next/font/local';
import Providers from '~/app/providers';
import Footer from '~/components/navigation/footer';
import Header from '~/components/navigation/header';
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

export const metadata: Metadata = {
	title: 'PixPersona',
	description: 'Transform your photos into personalized avatars with PixPersona!'
};

type Props = Readonly<{
	children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn('flex min-h-screen flex-col bg-gray-50 antialiased dark:bg-gray-900', geistSans.variable, geistMono.variable)}>
				<Providers locale={locale} messages={messages}>
					<Header />
					{children}
					<Toaster />
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
