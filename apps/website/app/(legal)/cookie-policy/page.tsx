import { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();

	const title = `Cookie Policy - ${t('app.name')}`;
	const description = 'Learn how we use cookies to enhance your experience, track site usage, and improve our services in our Cookies Policy.';
	const url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/cookie-policy`;

	return {
		title,
		description,
		alternates: {
			canonical: url
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

export default async function TermsOfServicePage() {
	const format = await getFormatter();

	return (
		<main className="mx-auto mb-24 flex max-w-screen-lg flex-1 flex-col gap-4 px-4 pt-12">
			<h1 className="text-4xl">Manage Cookies</h1>
			<p>
				<strong>Last updated:</strong>{' '}
				{format.dateTime(new Date('2024-10-20'), {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</p>

			<p>
				Cookies are small text files stored on your device when you visit a website. We use cookies to enhance your browsing experience, analyze website
				interactions, and personalize content and ads. You can manage your cookie preferences below. Please note that disabling certain cookies may
				affect the functionality and features available on our site.
			</p>

			<h2 className="text-3xl">Cookies we use</h2>
			<p>
				We use different types of cookies to provide a better experience on our website and to understand how visitors interact with our content. Below
				are the cookies we use:
			</p>

			<h3 className="text-2xl">Google Analytics</h3>
			<p>
				We use Google Analytics to collect information about how visitors use our website. This data helps us generate reports and improve the site. The
				cookies collect information anonymously, including the number of visitors, their source, and the pages they view.
			</p>

			<h3 className="text-2xl">Facebook Pixel</h3>
			<p>
				We use Facebook Pixel to track how users interact with our site and to deliver personalized advertising on Facebook. This tracking is optional
				and not required for using our services. You can choose to disable Facebook Pixel if you prefer not to be tracked.
			</p>

			<h3 className="text-2xl">Stripe (required)</h3>
			<p>
				Stripe is our payment gateway that securely processes payments on our website. When a user makes a payment, Stripe temporarily stores their
				payment information (e.g., credit card details) while processing. Stripe cookies store session information, like session IDs and payment
				statuses, and are necessary for payments to function correctly. These cookies remain on the user's browser until the payment process is
				complete. You can review and manage these settings on{' '}
				<Link href="https://stripe.com/cookie-settings" target="_blank" className="underline">
					Stripe's cookie settings page
				</Link>
				.
			</p>

			<p>
				In addition to these essential cookies, Stripe may use optional cookies to improve performance, analyze user interactions, and deliver relevant
				ads. You can disable these optional cookies if preferred. For more details, please refer to Stripe’s{' '}
				<Link href="https://stripe.com/privacy" target="_blank" className="underline">
					privacy policy
				</Link>
				.
			</p>

			<h3 className="text-2xl">Authentication (required)</h3>
			<p>
				We use NextAuth to authenticate users on our platform. NextAuth allows users to sign in using various third-party services, such as Google,
				making it easy to create an account and start using our application. These authentication cookies are necessary for login functionality.
			</p>
		</main>
	);
}
