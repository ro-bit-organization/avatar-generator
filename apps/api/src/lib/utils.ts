export async function fileToBase64(file: File): Promise<string> {
	const fileBuffer = await (file instanceof Blob ? file.arrayBuffer() : null);
	const mime = (file as File)?.type;
	const base64Data = fileBuffer ? Buffer.from(fileBuffer).toString('base64') : '';

	return `data:${mime};base64,${base64Data}`;
}
