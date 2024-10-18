import { Metadata } from 'next';
import { getFormatter } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
	const title = 'Refund Policy';
	const description = 'Learn about our refund policy, including eligibility, timelines, and how to request a return or exchange.';
	const url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/refund-policy`;

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

export default async function RefundPage() {
	const format = await getFormatter();

	return (
		<main className="mx-auto mb-24 flex max-w-screen-lg flex-1 flex-col gap-4 px-4 pt-12">
			<h1 className="text-4xl">Refund Policy</h1>
			<p className="text-muted-foreground">
				Last updated:{' '}
				{format.dateTime(new Date('2024-10-11'), {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</p>
			<p>
				At Pixpersona, we are committed to providing a unique and innovative experience through our AI-generated icons. We understand that AI, while
				powerful and revolutionary, isn&apos;t perfect and may not always produce the results you expect. We want you to be fully aware of this inherent
				risk before making any purchases.
			</p>
			<p>
				Due to the high costs involved in powering the advanced GPUs for our AI art generation, we unfortunately cannot offer refunds once credits have
				been used. We realize this may not be the ideal scenario for everyone, but this policy helps us to maintain a fair and sustainable service for
				all of our valued users.
			</p>
			<p>
				We strongly recommend exploring our community page before any purchase. You can see daily generated icons from other users which could help you
				understand the possibilities and limitations of AI art, and will hopefully guide your expectations. We believe in transparency and want you to
				make an informed decision about our unique service.
			</p>
			<p>
				Your understanding and support mean a lot to us. As we continue to improve and enhance our AI, we hope you will join us in this fascinating
				journey of digital creativity.
			</p>
		</main>
	);
}
