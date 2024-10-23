import { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();

	const title = `Refund Policy - ${t('app.name')}`;
	const description = 'Learn about our refund policy, including eligibility, timelines, and how to request a return or exchange.';
	const url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/refund-policy`;

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

export default async function RefundPolicy() {
	const t = await getTranslations();
	const format = await getFormatter();

	return (
		<main className="mx-auto mb-24 flex max-w-screen-lg flex-1 flex-col gap-4 px-4 pt-12">
			<h1 className="text-4xl">Refund Policy</h1>
			<p>
				<strong>Last updated:</strong>{' '}
				{format.dateTime(new Date('2024-10-20'), {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</p>
			<p>
				At {t('app.name')}, we’re dedicated to offering a one-of-a-kind experience with our AI-generated avatars. While AI technology is impressive and
				groundbreaking, it may not always deliver the results you anticipate. We want to ensure you're fully aware of these potential outcomes before
				making a purchase.
			</p>
			<p>
				Because of the significant costs associated with running the advanced GPUs necessary for our AI art generation, we are unable to provide refunds
				once credits have been used. We understand this may not be ideal for everyone, but this policy allows us to keep the service fair and
				sustainable for all our valued users.
			</p>
			<p>
				We highly recommend visiting our community page before purchasing credits. There, you can browse avatars created by other users daily, giving
				you a better sense of the AI’s capabilities and limitations, and helping set realistic expectations. Our goal is to be transparent and provide
				you with the information needed to make an informed decision about using our service.
			</p>
			<p>
				We truly appreciate your support and understanding. As we continue to refine and enhance our AI technology, we invite you to join us on this
				exciting journey of digital creativity.
			</p>
		</main>
	);
}
