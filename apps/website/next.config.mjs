import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: '5mb'
		}
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				hostname: 'pixpersona-staging-3541781497047889658470530.s3.eu-central-1.amazonaws.com'
			}
		]
	}
};

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.tsx');

export default withNextIntl(nextConfig);
