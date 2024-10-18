import { MetadataRoute } from 'next';

export default function Sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: process.env.NEXT_PUBLIC_WEBSITE_ORIGIN!
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/terms-of-service`,
			lastModified: new Date('2024-10-11')
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/privacy-policy`,
			lastModified: new Date('2024-10-11')
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/refund-policy`,
			lastModified: new Date('2024-10-11')
		},
		{
			url: `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN}/cookie-policy`,
			lastModified: new Date('2024-10-11')
		}
	];
}
