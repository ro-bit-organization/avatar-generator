import { MetadataRoute } from 'next';

export default function Sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: process.env.NEXT_PUBLIC_WEBSITE_URL!
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/terms-of-service`,
			lastModified: new Date('2024-10-20')
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/privacy-policy`,
			lastModified: new Date('2024-10-20')
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/refund-policy`,
			lastModified: new Date('2024-10-20')
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/cookie-policy`,
			lastModified: new Date('2024-10-20')
		}
	];
}
