import { z } from 'zod';

export const regenerationSchema = z.object({
	prompt: z.string()
});

export type RegenerationSchema = z.infer<typeof regenerationSchema>;
