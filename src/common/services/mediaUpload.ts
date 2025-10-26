import {
    S3Client,
    PutObjectCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: process.env.AWS_REGION });

class MediaUpload {
    async getPresignedUrl(key: string, contentType: string) {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 60 * 15 }); // 5 min expiry
        return { url, uploadId: null };
    }

    async getMultipartPresignedUrls(
        key: string,
        contentType: string,
        parts: number
    ) {
        // Multipart upload
        const multipartCommand = new CreateMultipartUploadCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        const { UploadId: uploadId } = await s3.send(multipartCommand);

        const urls = [];
        for (let partNumber = 1; partNumber <= parts; partNumber++) {
            const command = new UploadPartCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
                UploadId: uploadId,
                PartNumber: partNumber,
            });
            const url = await getSignedUrl(s3, command, { expiresIn: 60 * 15 });
            urls.push({ partNumber, url });
        }
        return { urls, uploadId };
    }

    async completeMultipartUpload(
        key: string,
        uploadId: string,
        parts: Array<{ ETag: string; PartNumber: number }>
    ) {
        const completeCommand = new CompleteMultipartUploadCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
        });

        await s3.send(completeCommand);
        return key;
    }

    async abortMultipartUpload(key: string, uploadId: string) {
        const abortCommand = new AbortMultipartUploadCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
        });
        await s3.send(abortCommand);
    }
}

export const mediaUpload = new MediaUpload();
