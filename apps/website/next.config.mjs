import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb'
        }
    },
    images: {
        remotePatterns: [
            {

                hostname: 'ro-bit-icon-generator-58707082674555.s3.eu-central-1.amazonaws.com',
            }
        ]
    }
};

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.tsx');

export default withNextIntl(nextConfig);
