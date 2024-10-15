import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
	region: process.env.S3_REGION!,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
	}
});
