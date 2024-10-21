import { Upload } from '@aws-sdk/lib-storage';
import { verifyAuth } from '@repo/auth-js';
import { prisma } from '@repo/db';
import { Hono } from 'hono';
import { Base64 } from 'js-base64';
import { nanoid } from 'nanoid';
import { s3 } from '../lib/clients/aws';
import openai from '../lib/clients/openai';
import { GENERATION_CREDITS_COST, STYLE_DESCRIPTION } from '../lib/const';
import { regenerationSchema } from '../lib/validation/regeneration';

const app = new Hono();

const OPEN_AI_SYSTEM_PROMPT = `
	You are an expert image analyst. You can extract accurate information from an image.
	Your Job is to accept an image which can be a photo of a human and respond with as much details as you can.
	Give additional details about facial expression, shape of specs if person has wore specs, pose of the person, hair style, type and color of outfit, hand expression, type of beard person has if one has, details about facial anatomy, color of skin, camera angle, how much of a person is visible
`;

const OPENAI_USER_PROMPT = `
	Here is an image. Analyze carefully and give me the details.
`;

const prefix = `
	Create a single avatar that can be used on social media, [STYLE], based on the following prompt:
	
	[PROMPT]
	
	The colors should not match the original image; instead, use colors that fit the style's artistic look.

	The override prompt is:
	
	[REQUIREMENTS]

	The override prompt will override and take precedence over the base features based on the following rules:
		
		Animal Type: If the override specifies a different animal (e.g., a fox), the image should feature that animal instead of the cat.
		Color: If different fur colors or patterns are described, these will replace the original color.
		Pose: Any new pose specified will override the original pose (e.g., the animal standing or jumping instead of lying down).
		Background: If the override includes new details (e.g., a cityscape instead of cushions and books), the new background will be used.
		Lighting: If the override mentions specific lighting conditions (e.g., bright daylight or moonlight), these will replace the soft, warm lighting.
`;

app.use('/', verifyAuth());

app.post('/', async (c) => {
	const formData = await c.req.formData();

	const id = formData.get('id') as string;
	const prompt = formData.get('prompt') as string;

	const validation = regenerationSchema.safeParse({
		id,
		prompt
	});

	if (!validation.success) {
		return c.json({
			error: 'Payload is invalid!'
		});
	}

	const session = c.get('authUser');

	const generation = await prisma.generation.findFirst({
		where: {
			id
		},
		include: {
			entries: true
		}
	});

	if (!generation || generation.userId !== session.user!.id) {
		return c.json({
			error: 'Generation does not exist!'
		});
	}

	try {
		const lastestGenerationEntry = generation.entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

		const completion = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			max_completion_tokens: 4096,
			temperature: 0,
			messages: [
				{
					role: 'system',
					content: OPEN_AI_SYSTEM_PROMPT
				},
				{
					role: 'user',
					content: [
						{
							type: 'image_url',
							image_url: {
								url: lastestGenerationEntry.imageUrl,
								detail: 'high'
							}
						},
						{
							type: 'text',
							text: OPENAI_USER_PROMPT
						}
					]
				}
			]
		});

		if (!completion.choices?.[0]?.message?.content) {
			throw new Error('An error occured during completion generation!');
		}

		const generate = await openai.images.generate({
			prompt: prefix
				.replace('[STYLE]', STYLE_DESCRIPTION[generation.style!])
				.replace('[PROMPT]', completion.choices[0].message.content)
				.replace('[REQUIREMENTS]', prompt),
			model: 'dall-e-3',
			size: '1024x1024',
			quality: 'standard'
		});

		if (!generate.data[0].url) {
			throw new Error('An error occured during image generation!');
		}

		const url = process.env.PUBLIC_CDN_URL
			? `${process.env.PUBLIC_CDN_URL}/format:png/quality:90/${Base64.encode(generate.data[0].url, true)}.png`
			: generate.data[0].url;

		console.log(generate.data[0].url, url);

		const response = await fetch(url);

		const upload = new Upload({
			client: s3,
			params: {
				Bucket: process.env.S3_BUCKET_NAME,
				Key: `${nanoid(10)}.png`,
				Body: response.body!
			}
		});

		const { Location } = await upload.done();

		if (!Location) {
			throw new Error('An error occured during file upload!');
		}

		await Promise.all([
			prisma.generation.update({
				where: {
					id
				},
				data: {
					entries: {
						create: [
							{
								prompt: null,
								imageUrl: Location
							}
						]
					}
				}
			}),

			prisma.user.update({
				where: {
					id: session.user!.id
				},
				data: {
					credits: session.user!.credits - GENERATION_CREDITS_COST
				}
			})
		]);

		return c.body(null, 204);
	} catch (e) {
		console.log(e);

		return c.json({ error: e instanceof Error ? e.message : 'An error occured during regeneration!' }, 500);
	}
});

export default app;
