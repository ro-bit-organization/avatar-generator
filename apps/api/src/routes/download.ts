import { verifyAuth } from '@hono/auth-js';
import { prisma } from '@repo/db';
import { Hono } from 'hono';
import { Base64 } from 'js-base64';
import uzip from 'uzip';

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

		const buffers = await Promise.all(
			generation.entries.map(async (entry) => {
				const url = process.env.PUBLIC_CDN_URL
					? `${process.env.PUBLIC_CDN_URL}/format:png/quality:100/${Base64.encode(entry.imageUrl, true)}.png`
					: entry.imageUrl;

				return await fetch(url)
					.then((response) => response.blob())
					.then((blob) => blob.arrayBuffer());
			})
		);

		const zip = uzip.encode(buffers.reduce((a, v, i) => ({ ...a, [`avatar-${i}.webp`]: new Uint8Array(v) }), {}));

		return c.body(zip, 200, {
			'Cache-Control': 'no-store',
			'Content-Disposition': `attachment;filename=${generation.id}.zip`,
			'Content-Type': 'application/zip'
		});
	} catch (e) {
		return c.json({ error: 'An error occured during download!' }, 500);
	}
});

export default app;
