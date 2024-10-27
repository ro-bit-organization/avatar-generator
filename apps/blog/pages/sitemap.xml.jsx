import React from 'react';

class Sitemap extends React.Component {
	static async getInitialProps({ res }) {
		res.setHeader('Content-Type', 'text/xml');
		res.write(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		<url>
			<loc>${process.env.NEXT_PUBLIC_BLOG_URL}</loc>
		</url>
    </urlset>`);
		res.end();
	}
}

export default Sitemap;
