# Thumbnail Generation Lambda

## Overview
This Lambda function automatically generates thumbnails when images are uploaded to the S3 bucket under `media/images/`.

## Features
- **Automatic trigger**: Runs when images are uploaded to `media/images/` folder
- **Multiple sizes**: Generates 3 thumbnail sizes (small, medium, large)
- **WebP format**: Converts all thumbnails to WebP for better compression
- **Optimized storage**: Stores thumbnails in `media/thumbnails/{size}/` folder
- **Error handling**: Robust error handling and logging

## Thumbnail Sizes
- **Small**: 200x200px
- **Medium**: 400x400px  
- **Large**: 800x800px

All thumbnails use `fit: cover` with center positioning to maintain aspect ratio.

## Storage Structure
```
s3://bucket-name/
├── media/
│   ├── images/
│   │   └── abc123.jpg          (original image)
│   └── thumbnails/
│       ├── small/
│       │   └── abc123.webp     (200x200)
│       ├── medium/
│       │   └── abc123.webp     (400x400)
│       └── large/
│           └── abc123.webp     (800x800)
```

## Configuration
- **Timeout**: 60 seconds
- **Memory**: 1024 MB
- **Runtime**: Node.js 22.x
- **Trigger**: S3 ObjectCreated events in `media/images/` prefix

## Supported Image Types
- image/jpeg
- image/jpg
- image/png
- image/webp

## Environment Variables
- `AWS_BUCKET_NAME`: S3 bucket name
- `AWS_REGION`: AWS region (optional, defaults to us-east-1)

## Usage in API

### Get thumbnail URL
```typescript
import { mediaUpload } from '@common/services/mediaUpload';

// Get medium thumbnail URL (default)
const thumbnailUrl = mediaUpload.getThumbnailUrl('media/images/abc123.jpg');

// Get specific size
const smallUrl = mediaUpload.getThumbnailUrl('media/images/abc123.jpg', 'small');

// Get all sizes
const allUrls = mediaUpload.getAllThumbnailUrls('media/images/abc123.jpg');
// Returns: { small: '...', medium: '...', large: '...' }
```

### Delete with thumbnails
```typescript
// Delete original image and all thumbnails
await mediaUpload.deleteMediaWithThumbnails('media/images/abc123.jpg');
```

## Deployment

### Install dependencies
```bash
npm install
```

### Deploy to AWS
```bash
serverless deploy
```

### Local testing (requires serverless-offline-s3)
```bash
npm run dev
```

## IAM Permissions Required
The Lambda function requires the following S3 permissions:
- `s3:GetObject` - Read original images
- `s3:PutObject` - Write thumbnails

These are configured in `serverless.yml` under `provider.iam.role.statements`.

## Monitoring
Check CloudWatch Logs for:
- Processing logs for each image
- Success/failure status
- Error messages
- Summary of batch processing

## Notes
- Thumbnails are only generated for images in `media/images/` folder
- Already existing thumbnails are skipped to avoid infinite loops
- Images are converted to WebP format for better compression
- Cache-Control header is set to 1 year for thumbnails
