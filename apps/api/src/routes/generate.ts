import { Upload } from '@aws-sdk/lib-storage';
import { verifyAuth } from '@repo/auth-js';
import { GenerationStyle, prisma } from '@repo/db';
import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { s3 } from '../lib/clients/aws';
import openai from '../lib/clients/openai';
import { GENERATION_CREDITS_COST, STYLE_DESCRIPTION } from '../lib/const';
import { fileToBase64 } from '../lib/utils';
import { generationSchema } from '../lib/validation/generation';

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
`;

app.use('/', verifyAuth());

app.post('/', async (c) => {
	const formData = await c.req.formData();

	const id = formData.get('id') as string;
	const image = formData.get('image') as File;
	const style = formData.get('style') as GenerationStyle;

	const validation = generationSchema.safeParse({
		id,
		image,
		style
	});

	if (!validation.success) {
		return c.json({
			error: 'Payload is invalid!'
		});
	}

	const session = c.get('authUser');

	if (session.user!.credits < GENERATION_CREDITS_COST) {
		return c.json({
			error: `You don't have enough credits!`
		});
	}

	try {
		const imageBase64 = await fileToBase64(image!);

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
								url: imageBase64,
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
			prompt: prefix.replace('[STYLE]', STYLE_DESCRIPTION[style]).replace('[PROMPT]', completion.choices[0].message.content),
			model: 'dall-e-3',
			size: '1024x1024',
			quality: 'standard'
		});

		if (!generate.data[0].url) {
			throw new Error('An error occured during image generation!');
		}

		const id = nanoid(10);
		const url = generate.data[0].url;

		console.log(url);

		const response = await fetch(url);

		const upload = new Upload({
			client: s3,
			params: {
				Bucket: process.env.S3_BUCKET_NAME,
				Key: `${id}.png`,
				Body: response.body!
			}
		});

		const { Location: imageUrl } = await upload.done();

		if (!imageUrl) {
			throw new Error('An error occured during file upload!');
		}

		await Promise.all([
			prisma.generation.update({
				where: {
					id
				},
				data: {
					style,
					entries: {
						create: [
							{
								prompt: null,
								imageUrl
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
		return c.json({ error: e instanceof Error ? e.message : 'An error occured during generation!' }, 500);
	}
});

export default app;
