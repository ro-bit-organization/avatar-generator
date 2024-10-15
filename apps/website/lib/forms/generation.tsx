import { GenerationStyle } from '@repo/db';
import { z } from 'zod';

export const generationSchema = z.object({
	style: z.nativeEnum(GenerationStyle).nullable(),
	image: z
		.instanceof(File)
		.refine((file) => file.size < 5 * 1024 * 1024, {
			message: 'Image should be less than 5 MB'
		})
		.nullable()
});

export type GenerationSchema = z.infer<typeof generationSchema>;

export const regenerationSchema = z.object({
	prompt: z.string()
});

export type RegenerationSchema = z.infer<typeof regenerationSchema>;
