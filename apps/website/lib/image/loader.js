'use client';

const { Base64 } = require('js-base64');

export default function loader({ src, width, quality }) {
	if (!process.env.NEXT_PUBLIC_CDN_URL) {
		return src;
	}

	try {
		new URL(src);

		return `${process.env.NEXT_PUBLIC_CDN_URL}/format:webp/resize:fill:${width}/quality:${quality || 75}/${Base64.encode(src)}.webp`;
	} catch {
		return src;
	}
}
