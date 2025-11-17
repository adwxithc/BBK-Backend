import { S3Event, S3Handler } from 'aws-lambda';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { Readable } from 'stream';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

// Thumbnail configuration
const THUMBNAIL_SIZES = [
    { name: 'small', width: 200, height: 200 },
    { name: 'medium', width: 400, height: 400 },
    { name: 'large', width: 800, height: 800 },
];

const SUPPORTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

/**
 * Convert a readable stream to a buffer
 */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

/**
 * Generate thumbnail from image buffer
 */
async function generateThumbnail(
    imageBuffer: Buffer,
    width: number,
    height: number
): Promise<Buffer> {
    return sharp(imageBuffer)
        .resize(width, height, {
            fit: 'cover',
            position: 'center',
        })
        .webp({ quality: 80 }) // Convert to WebP for better compression
        .toBuffer();
}

/**
 * Main Lambda handler for S3 trigger
 */
export const handler: S3Handler = async (event: S3Event) => {
    console.log('Thumbnail generation triggered:', JSON.stringify(event, null, 2));

    const results = await Promise.allSettled(
        event.Records.map(async (record) => {
            const bucket = record.s3.bucket.name;
            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

            console.log(`Processing image: ${key} from bucket: ${bucket}`);

            // Only process images in the media/image folder
            if (!key.startsWith('media/image/')) {
                console.log(`Skipping non-image path: ${key}`);
                return { key, status: 'skipped', reason: 'Not in media/image folder' };
            }

            // Skip if already a thumbnail
            if (key.includes('/thumbnails/')) {
                console.log(`Skipping thumbnail: ${key}`);
                return { key, status: 'skipped', reason: 'Already a thumbnail' };
            }

            try {
                // Get the image from S3
                const getObjectCommand = new GetObjectCommand({
                    Bucket: bucket,
                    Key: key,
                });

                const s3Object = await s3Client.send(getObjectCommand);
                
                // Check content type
                const contentType = s3Object.ContentType || '';
                if (!SUPPORTED_IMAGE_TYPES.includes(contentType)) {
                    console.log(`Unsupported content type: ${contentType}`);
                    return { key, status: 'skipped', reason: `Unsupported type: ${contentType}` };
                }

                // Convert stream to buffer
                const imageBuffer = await streamToBuffer(s3Object.Body as Readable);

                // Generate thumbnails for all sizes
                const thumbnailPromises = THUMBNAIL_SIZES.map(async (size) => {
                    const thumbnailBuffer = await generateThumbnail(
                        imageBuffer,
                        size.width,
                        size.height
                    );

                    // Create thumbnail key path
                    // Original: media/image/xyz.jpg
                    // Thumbnail: media/thumbnails/small/xyz.webp
                    const fileName = key.split('/').pop()?.split('.')[0] || 'image';
                    const thumbnailKey = `media/thumbnails/${size.name}/${fileName}.webp`;

                    // Upload thumbnail to S3
                    const putObjectCommand = new PutObjectCommand({
                        Bucket: bucket,
                        Key: thumbnailKey,
                        Body: thumbnailBuffer,
                        ContentType: 'image/webp',
                        CacheControl: 'max-age=31536000', // Cache for 1 year
                        Metadata: {
                            'original-key': key,
                            'thumbnail-size': size.name,
                        },
                    });

                    await s3Client.send(putObjectCommand);
                    console.log(`Generated ${size.name} thumbnail: ${thumbnailKey}`);

                    return { size: size.name, key: thumbnailKey };
                });

                const thumbnails = await Promise.all(thumbnailPromises);

                return {
                    key,
                    status: 'success',
                    thumbnails,
                };
            } catch (error) {
                console.error(`Error processing ${key}:`, error);
                return {
                    key,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        })
    );

    // Log summary
    const summary = {
        total: results.length,
        successful: results.filter((r) => r.status === 'fulfilled').length,
        failed: results.filter((r) => r.status === 'rejected').length,
        results: results.map((r) => r.status === 'fulfilled' ? r.value : { status: 'rejected', reason: r.reason }),
    };

    console.log('Thumbnail generation summary:', JSON.stringify(summary, null, 2));

    return;
};
