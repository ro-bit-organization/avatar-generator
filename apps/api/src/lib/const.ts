import { GenerationStyle } from '@repo/db';

export const MAX_GENERATIONS = 3;
export const GENERATION_CREDITS_COST = 5;
export const MAX_CONCURENT_GENERATIONS = 1;

export const STYLE_DESCRIPTION: Record<GenerationStyle, string> = {
	[GenerationStyle.CARTOONISH]: 'illustrated in a fun, cartoonish style with exaggerated features and bright colors',
	[GenerationStyle.CLAY]: 'modeled in a claymation style, resembling a clay figure with a textured surface and soft, rounded shapes',
	[GenerationStyle.DISNEY]: 'designed in a Disney-inspired style, with large expressive eyes, smooth shading, and a whimsical, magical feel',
	[GenerationStyle.FLAT]: 'llustrated in a flat style, using simple shapes, bold colors, and minimal shading',
	[GenerationStyle.HAND_DRAWN]: 'illustrated in a hand-drawn style, featuring pencil lines, sketch details, and subtle shadings',
	[GenerationStyle.ILLUSTRATED]: 'illustrated in a detailed art style, with intricate linework and soft color gradients',
	[GenerationStyle.NEON]: 'designed in a neon style, with bright, glowing outlines and vibrant, electric colors',
	[GenerationStyle.PIXELATED]: 'created in a pixelated style, using small, square pixels with an 8-bit retro video game look',
	[GenerationStyle.POLYGON]: 'rendered in a polygon style, with angular, geometric shapes and a low-poly 3D appearance',
	[GenerationStyle.POP_ART]: 'illustrated in a pop art style, with bold outlines, bright contrasting colors, and a comic book effect',
	[GenerationStyle.REALISTIC]: 'portrayed in a realistic style, with lifelike textures, detailed facial features, and natural lighting',
	[GenerationStyle.RETRO]: 'designed in a retro style, with a vintage color palette, grainy texture, and 80s-inspired aesthetics',
	[GenerationStyle.STICKER]: 'illustrated in a sticker style, with clean outlines, simple colors, and a playful, cut-out appearance',
	[GenerationStyle.THREE_DIMENSIONAL]: 'rendered in a 3D style, with realistic lighting, shadows, and a smooth, sculpted look'
};
