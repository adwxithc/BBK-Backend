/**
 * Thumbnail utility functions
 */

export type ThumbnailSize = 'small' | 'medium' | 'large';

/**
 * Get thumbnail URL from original image key
 * @param originalKey - Original image S3 key (e.g., "media/images/abc123.jpg")
 * @param size - Thumbnail size (small, medium, large)
 * @returns Thumbnail key (e.g., "media/thumbnails/small/abc123.webp")
 */
export function getThumbnailKey(originalKey: string, size: ThumbnailSize = 'medium'): string {
    // Extract filename without extension from original key
    const fileName = originalKey.split('/').pop()?.split('.')[0] || 'image';
    return `media/thumbnails/${size}/${fileName}.webp`;
}

/**
 * Get all thumbnail keys for an image
 * @param originalKey - Original image S3 key
 * @returns Object with all thumbnail sizes
 */
export function getAllThumbnailKeys(originalKey: string): Record<ThumbnailSize, string> {
    return {
        small: getThumbnailKey(originalKey, 'small'),
        medium: getThumbnailKey(originalKey, 'medium'),
        large: getThumbnailKey(originalKey, 'large'),
    };
}

/**
 * Check if a key is an image in the media/images folder
 * @param key - S3 key to check
 * @returns boolean
 */
export function isMediaImage(key: string): boolean {
    return key.startsWith('media/images/') && !key.includes('/thumbnails/');
}

/**
 * Get thumbnail sizes configuration
 */
export const THUMBNAIL_SIZES = {
    small: { width: 200, height: 200 },
    medium: { width: 400, height: 400 },
    large: { width: 800, height: 800 },
} as const;
