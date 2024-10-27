export default function handler(req, res) {
	res.send(
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${process.env.NEXT_PUBLIC_BLOG_URL}</loc>
</url>
</urlset>`,
		{ headers: { 'Content-Type': 'text/xml' } }
	);
}
