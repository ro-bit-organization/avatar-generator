import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';

export default {
	head() {
		const { asPath, defaultLocale, locale } = useRouter();
		const { frontMatter } = useConfig();
		const url = `${process.env.NEXT_PUBLIC_BLOG_URL}` + (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

		return (
			<>
				<meta name="robots" content="follow, index" />
				<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="32x32" />
				<link rel="canonical" href={url} />
				<title>{frontMatter.title}</title>
				<meta name="publish_date" content={new Date(frontMatter.date).toISOString()}></meta>
				<meta name="description" content={frontMatter.description} />
				<meta property="og:url" content={url} />
				<meta property="og:site_name" content={frontMatter.title} />
				<meta property="og:title" content={frontMatter.title} />
				<meta property="og:description" content={frontMatter.description} />
				<meta property="og:image" content={frontMatter.image} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@yourname" />
				<meta name="twitter:title" content={frontMatter.title} />
				<meta name="twitter:description" content={frontMatter.description} />
				<meta name="twitter:image" content={frontMatter.image} />
			</>
		);
	},
	logo: <Image unoptimized src="/images/logo.webp" width="36" height="36" alt="Logo" style={{ borderRadius: 'calc(0.5rem - 2px)' }} />,
	editLink: {
		component: null
	},
	feedback: {
		content: null
	},
	search: {
		placeholder: 'Search'
	},
	footer: {
		content: (
			<p>
				&copy; {new Date().getFullYear()} <Link href={process.env.NEXT_PUBLIC_WEBSITE_URL}>PixPersona</Link>. All rights reserved.
			</p>
		)
	}
};
