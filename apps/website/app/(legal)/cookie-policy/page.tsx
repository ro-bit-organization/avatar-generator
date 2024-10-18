import { Metadata } from 'next';
import { getFormatter } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
	const title = 'Terms of Service';
	const description = 'Learn how we use cookies to enhance your experience, track site usage, and improve our services in our Cookies Policy.';
	const url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/cookie-policy`;

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

export default async function TermsOfServicePage() {
	const format = await getFormatter();

	return (
		<main className="mx-auto mb-24 flex max-w-screen-lg flex-1 flex-col gap-4 px-4 pt-12">
			<h1 className="text-4xl">Manage Cookies</h1>
			<p className="text-muted-foreground">
				Last updated:{' '}
				{format.dateTime(new Date('2024-10-11'), {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</p>
			<p>
				Cookies are small text files that are stored on your device when you visit a website. We use cookies to provide a better user experience,
				analyze how users interact with our website, and to personalize content and ads.
			</p>
			<p>
				Below you can manage your cookie preferences. Please note that by disabling certain cookies, you may limit your ability to use certain features
				of our website.
			</p>
			<h2 className="text-3xl">Cookies we use</h2>
			<p>
				We use cookies to provide a better experience on our website and to understand how visitors interact with our content. Here are the cookies we
				use:
			</p>
			<h3 className="text-2xl">Google Analytics</h3>
			<p>
				We use Google Analytics to collect information about how visitors use our website. This information is used to create reports and help us
				improve the website. Google Analytics cookies collect information in an anonymous form, including the number of visitors to the website and
				blog, where visitors have come to the website from and the pages they visited.
			</p>
			<h3 className="text-2xl">Stripe (required)</h3>
			<p>
				We use stripe as our payment gatewa which allows websites to process online payments securely and easily. When a user makes a payment on your
				website using Stripe, their payment information (such as their credit card details) needs to be stored temporarily while the payment is being
				processed. Please review the{' '}
				<Link href="https://stripe.com/cookie-settings" target="_blank" className="underline">
					https://stripe.com/cookie-settings
				</Link>{' '}
				settings to configure your stripe cookies.
			</p>
			<p>
				To enable this, Stripe uses cookies to store information about the user&apos;s session, such as their session ID and the status of their
				payment. These cookies are necessary for the payment process to work properly, and they are stored on the user&apos;s browser until the payment
				process is complete.
			</p>
			<p>
				In addition to payment-related cookies, Stripe may also use other cookies on your website to improve performance, analyze how users interact
				with the website, and provide relevant advertising. However, these additional cookies are optional and you can choose to disable them if you
				prefer. Stripe&apos;s use of cookies is subject to their own privacy policy, which you should review if you have any specific concerns.
			</p>
			<h3 className="text-2xl">Authentication (required)</h3>
			<p>
				We use next-auth to authenticate users on our application. Next-auth is a library which allows users to authenticate using various third party
				services, such as google, which makes it easy to sign up and start using our application.
			</p>
		</main>
	);
}
