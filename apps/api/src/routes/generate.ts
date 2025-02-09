import { Upload } from '@aws-sdk/lib-storage';
import { verifyAuth } from '@hono/auth-js';
import { GenerationStatus, GenerationStyle, GenerationVisibility, prisma } from '@repo/db';
import { Hono } from 'hono';
import { Base64 } from 'js-base64';
import { nanoid } from 'nanoid';
import { s3 } from '../lib/clients/aws';
import openai from '../lib/clients/openai';
import { GENERATION_CREDITS_COST, MAX_CONCURENT_GENERATIONS, STYLE_DESCRIPTION } from '../lib/const';
import GenerationError from '../lib/types/generation-error';
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
	const visibility = formData.get('visibility') as GenerationVisibility;
	const style = formData.get('style') as GenerationStyle;
	const image = formData.get('image') as File;

	const validation = generationSchema.safeParse({
		id,
		visibility,
		style,
		image
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
		const generation = await prisma.generation.findFirst({
			where: {
				id
			},
			include: {
				entries: true
			}
		});

		if (!generation) {
			throw new GenerationError('Generation does not exist!', 400);
		}

		if (generation.status === GenerationStatus.IN_PROGRESS) {
			throw new GenerationError('The generation is already in progress!', 400);
		}

		if (generation.entries.length > 0) {
			throw new GenerationError('The generation already contains one avatar!', 400);
		}

		const inProgressGenerations = await prisma.generation.findMany({
			where: {
				userId: session.user!.id,
				status: GenerationStatus.IN_PROGRESS
			},
			take: 3
		});

		if (inProgressGenerations?.length >= MAX_CONCURENT_GENERATIONS) {
			throw new GenerationError('You reached the maximum number of concurent generations!', 400);
		}

		await prisma.generation.update({
			where: {
				id
			},
			data: {
				status: GenerationStatus.IN_PROGRESS
			}
		});

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

		const url = process.env.PUBLIC_CDN_URL
			? `${process.env.PUBLIC_CDN_URL}/format:webp/quality:90/${Base64.encode(generate.data[0].url, true)}.webp`
			: generate.data[0].url;

		const response = await fetch(url);

		const upload = new Upload({
			client: s3,
			params: {
				Bucket: process.env.S3_BUCKET_NAME,
				Key: `${nanoid(10)}.webp`,
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
					visibility,
					style,
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

		return c.json(
			{ error: e instanceof GenerationError ? e.message : 'An error occured during generation!' },
			e instanceof GenerationError ? e.status : 500
		);
	} finally {
		await prisma.generation.update({
			where: {
				id
			},
			data: {
				status: GenerationStatus.IDLE
			}
		});
	}
});

export default app;
