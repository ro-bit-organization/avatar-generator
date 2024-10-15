import { clsx, type ClassValue } from 'clsx';
import GraphemeSplitter from 'grapheme-splitter';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function client_fileToBase64(file: File): Promise<string | ArrayBuffer | null> {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();

		fileReader.readAsDataURL(file);

		fileReader.onload = () => {
			resolve(fileReader.result);
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
}

export async function server_fileToBase64(file: File): Promise<string> {
	const fileBuffer = await (file instanceof Blob ? file.arrayBuffer() : null);
	const mime = (file as File)?.type;
	const base64Data = fileBuffer ? Buffer.from(fileBuffer).toString('base64') : '';

	return `data:${mime};base64,${base64Data}`;
}

export const stringSplitter = (text: string): string => {
	const splitter = new GraphemeSplitter();

	return splitter.splitGraphemes(text) as unknown as string; //https://github.com/tameemsafi/typewriterjs/issues/212#issuecomment-2296612994
};
