import { verifyAuth } from '@repo/auth-js';
import { prisma } from '@repo/db';
import { Hono } from 'hono';
import { Base64 } from 'js-base64';
import jszip from 'jszip';

const app = new Hono();

app.use('/', verifyAuth());

app.get('/', async (c) => {
	const id = await c.req.param('id');
	const session = c.get('authUser');

	try {
		const generation = await prisma.generation.findFirst({
			where: {
				id
			},
			include: {
				entries: true
			}
		});

		if (!generation) {
			return c.json(
				{
					error: 'Generation does not exist!'
				},
				400
			);
		}

		if (generation.userId !== session!.user!.id) {
			return c.json(
				{
					error: 'Generation does not exist!'
				},
				400
			);
		}

		const zip = new jszip();

		await Promise.all(
			generation.entries.map(async (entry, index) => {
				const url = process.env.PUBLIC_CDN_URL
					? `${process.env.PUBLIC_CDN_URL}/format:webp/quality:100/${Base64.encode(entry.imageUrl, true)}.webp`
					: entry.imageUrl;

				const buffer = await fetch(url)
					.then((response) => response.blob())
					.then((blob) => blob.arrayBuffer());

				zip.file(`avatar-${index}.webp`, buffer);
			})
		);

		const archive = await zip.generateAsync({ type: 'blob' }).then((blob) => blob.arrayBuffer());

		return c.body(archive, 200, {
			'Cache-Control': 'no-store',
			'Content-Disposition': `attachment;filename=${generation.id}.zip`,
			'Content-Type': 'application/zip'
		});
	} catch (e) {
		return c.json({ error: 'An error occured during download!' }, 500);
	}
});

export default app;
