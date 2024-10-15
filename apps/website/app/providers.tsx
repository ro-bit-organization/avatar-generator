'use client';

import { SessionProvider } from 'next-auth/react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

type Props = {
	locale: string;
	messages: AbstractIntlMessages;
	children: React.ReactNode;
};

export default function Providers({ locale, messages, children }: Props) {
	return (
		<NextIntlClientProvider
			locale={locale}
			messages={messages}
			timeZone="Europe/Berlin"
			defaultTranslationValues={{
				strong: (chunks) => <strong>{chunks}</strong>
			}}
		>
			<SessionProvider baseUrl={process.env.NEXT_PUBLIC_API_URL}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</SessionProvider>
		</NextIntlClientProvider>
	);
}
