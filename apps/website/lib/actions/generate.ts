'use server';

import { Upload } from '@aws-sdk/lib-storage';
import { GenerationStyle, prisma } from '@repo/db';
import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth/next';
import { revalidatePath } from 'next/cache';
import { authOptions } from '~/lib/auth';
import { s3 } from '~/lib/clients/aws';
import openAI from '~/lib/clients/openai';
import { GENERATION_CREDITS_COST, STYLE_DESCRIPTION } from '~/lib/const';
import { generationSchema } from '~/lib/forms/generation';
import { server_fileToBase64 } from '~/lib/utils';

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

export async function generate(formData: FormData): Promise<{ error?: string } | void> {
	const id = formData.get('id') as string;
	const image = formData.get('image') as File;
	const style = formData.get('style') as GenerationStyle;

	const validation = generationSchema.safeParse({
		id,
		image,
		style
	});

	if (!validation.success) {
		throw new Error('hello');
	}

	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return {
			error: 'You must be authenticated!'
		};
	}

	if (session.user.credits < GENERATION_CREDITS_COST) {
		return {
			error: `You don't have enough credits!`
		};
	}

	try {
		const imageBase64 = await server_fileToBase64(image!);

		const completion = await openAI.chat.completions.create({
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
			throw new Error('An error occured!');
		}
		const generate = await openAI.images.generate({
			prompt: prefix.replace('[STYLE]', STYLE_DESCRIPTION[style]).replace('[PROMPT]', completion.choices[0].message.content),
			model: 'dall-e-3',
			size: '1024x1024',
			quality: 'standard'
		});

		if (!generate.data[0].url) {
			throw new Error('An error occured!');
		}

		const response = await fetch(generate.data[0].url);

		const upload = new Upload({
			client: s3,
			params: {
				Bucket: 'ro-bit-icon-generator-58707082674555',
				Key: `${nanoid(10)}.png`,
				Body: response.body!
			}
		});

		const { Location } = await upload.done();

		if (!Location) {
			throw new Error('An error occured!');
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
								imageUrl: Location
							}
						]
					}
				}
			}),
			prisma.user.update({
				where: {
					id: session.user.id
				},
				data: {
					credits: session.user.credits - GENERATION_CREDITS_COST
				}
			})
		]);

		revalidatePath(`generate/${id}`);
	} catch (e) {
		console.log(e);

		throw new Error('An error occured!');
	}
}
