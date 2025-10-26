import { body, query } from 'express-validator';
export const loginValidations = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('password must be between 4 and 20 characters'),
];
export const createMediaSignedUrlValidations = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ max: 100 })
        .withMessage('Title must not exceed 100 characters'),

    body('mediaFiles')
        .notEmpty()
        .withMessage('Media files are required')
        .isArray({ min: 1, max: 50 })
        .withMessage('Media files must be an array with 1 to 50 items'),
    body('mediaFiles.*.contentType')
        .notEmpty()
        .withMessage('Media contentType is required for each file')
        .isString()
        .withMessage('Media contentType must be a string'),
    // Validate 'type' field if provided
    body('mediaFiles.*.type')
        .notEmpty()
        .withMessage('Media type is required for each file')
        .isIn(['image', 'video'])
        .withMessage("Media type must be either 'image' or 'video'"),
    body('mediaFiles.*.size')
        .optional()
        .isNumeric()
        .withMessage('Size must be a number (in bytes)')
        .custom((size) => {
            const sizeInBytes = parseInt(size);
            const maxSize = 1024 * 1024 * 1024; // 1GB in bytes
            const minSize = 1; // 1 byte minimum
            return sizeInBytes >= minSize && sizeInBytes <= maxSize;
        })
        .withMessage(
            'Size must be between 1 byte and 1GB (1,073,741,824 bytes)'
        ),
    body('mediaFiles.*.id')
        .notEmpty()
        .withMessage('Media ID is required for each file')
        .isString()
        .withMessage('Media ID must be a string')
        .isLength({ max: 100 })
        .withMessage('Media ID must not exceed 100 characters'),
];

export const completeMultipartUploadBatchValidations = [
    body('uploads')
        .notEmpty()
        .withMessage('Uploads are required')
        .isArray()
        .withMessage('Uploads must be an array'),
    body('uploads.*.key')
        .notEmpty()
        .withMessage('Upload key is required')
        .isString()
        .withMessage('Upload key must be a string'),
    body('uploads.*.uploadId')
        .notEmpty()
        .withMessage('Upload ID is required')
        .isString()
        .withMessage('Upload ID must be a string'),
    body('uploads.*.parts')
        .notEmpty()
        .withMessage('Upload parts are required')
        .isArray()
        .withMessage('Upload parts must be an array'),
    body('uploads.*.parts.*.ETag')
        .notEmpty()
        .withMessage('Part ETag is required')
        .isString()
        .withMessage('Part ETag must be a string'),
    body('uploads.*.parts.*.PartNumber')
        .notEmpty()
        .withMessage('Part Number is required')
        .isNumeric()
        .withMessage('Part Number must be a number'),
];

export const abortMultipartUploadValidations = [
    body('key')
        .notEmpty()
        .withMessage('Key is required')
        .isString()
        .withMessage('Key must be a string'),
    body('uploadId')
        .notEmpty()
        .withMessage('Upload ID is required')
        .isString()
        .withMessage('Upload ID must be a string'),
];

export const createEventValidations = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ max: 100 })
        .withMessage('Title must not exceed 100 characters'),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be a string')
        .isLength({ max: 5000 })
        .withMessage('Description must not exceed 5000 characters'),
    body('categoryId')
        .notEmpty()
        .withMessage('Category ID is required')
        .isMongoId()
        .withMessage('Category ID must be a valid MongoDB ObjectId'),
    body('slug')
        .notEmpty()
        .withMessage('Slug is required')
        .isString()
        .withMessage('Slug must be a string')
        .isLength({ max: 100 })
        .withMessage('Slug must not exceed 100 characters')
        .matches(/^[a-z0-9-]+$/)
        .withMessage(
            'Slug must contain only lowercase letters, numbers, and hyphens'
        )
        .trim(),
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('End Date must be a valid ISO 8601 date')
        .custom((endDate, { req }) => {
            if (new Date(endDate) < new Date(req.body.date)) {
                throw new Error('End Date cannot be before Start Date');
            }
            return true;
        }),
    body('time')
        .notEmpty()
        .withMessage('Time is required')
        .isString()
        .withMessage('Time must be a string'),
    body('location')
        .notEmpty()
        .withMessage('Location is required')
        .isString()
        .withMessage('Location must be a string')
        .isLength({ max: 200 })
        .withMessage('Location must not exceed 200 characters'),
    body('coverImage')
        .optional()
        .isString()
        .withMessage('Cover Image must be a string (key)'),
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isString()
        .withMessage('Status must be a string')
        .isIn(['draft', 'published', 'archived'])
        .withMessage(
            'Status must be one of the following: draft, published, archived'
        ),
    body('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean value'),
    body('medias')
        .optional()
        .isArray()
        .withMessage('Medias must be an array')
        .custom((medias) => {
            for (const media of medias) {
                if (media.multipart === true) {
                    if (!media.uploadId || typeof media.uploadId !== 'string') {
                        throw new Error(
                            'Media uploadId is required and must be a string when multipart is true'
                        );
                    }
                    if (
                        !Array.isArray(media.parts) ||
                        media.parts.length === 0
                    ) {
                        throw new Error(
                            'Media parts is required and must be a non-empty array when multipart is true'
                        );
                    }
                }
            }
            return true;
        }),
    body('medias.*.key')
        .notEmpty()
        .withMessage('Media key is required')
        .isString()
        .withMessage('Media key must be a string')
        .isLength({ max: 200 })
        .withMessage('Media key must not exceed 200 characters'),
    body('medias.*.type')
        .notEmpty()
        .withMessage('Media type is required')
        .isIn(['image', 'video'])
        .withMessage('Media type must be either "image" or "video"'),
    body('medias.*.contentType')
        .notEmpty()
        .withMessage('Media contentType is required for each file')
        .isString()
        .withMessage('Media contentType must be a string')
        .matches(/^(image|video|audio|application)\/[a-zA-Z0-9.+-]+$/)
        .withMessage('Media contentType must be a valid MIME type'),
    body('medias.*.caption')
        .optional()
        .isString()
        .withMessage('Media caption must be a string')
        .isLength({ max: 200 })
        .withMessage('Media caption must not exceed 200 characters'),
    body('medias.*.featured')
        .optional()
        .isBoolean()
        .withMessage('Media featured must be a boolean'),
    body('medias.*.multipart')
        .optional()
        .isBoolean()
        .withMessage('Media multipart must be a boolean'),
    body('medias.*.uploadId')
        .optional()
        .isString()
        .withMessage('Media uploadId must be a string'),
    body('medias.*.parts')
        .optional()
        .isArray()
        .withMessage('Media parts must be an array'),
    body('medias.*.parts.*.ETag')
        .optional()
        .isString()
        .withMessage('Part ETag must be a string'),
    body('medias.*.parts.*.PartNumber')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Part Number must be a positive integer'),
];

// Event Category Validations
export const createEventCategoryValidations = [
    body('name')
        .notEmpty()
        .withMessage('Category name is required')
        .isString()
        .withMessage('Category name must be a string')
        .isLength({ max: 100 })
        .withMessage('Category name must not exceed 100 characters')
        .trim(),

    body('description')
        .notEmpty()
        .withMessage('Category description is required')
        .isString()
        .withMessage('Category description must be a string')
        .isLength({ max: 500 })
        .withMessage('Category description must not exceed 500 characters')
        .trim(),

    body('slug')
        .notEmpty()
        .withMessage('Slug is required')
        .isString()
        .withMessage('Slug must be a string')
        .isLength({ max: 100 })
        .withMessage('Slug must not exceed 100 characters')
        .matches(/^[a-z0-9-]+$/)
        .withMessage(
            'Slug must contain only lowercase letters, numbers, and hyphens'
        )
        .trim(),

    body('color')
        .notEmpty()
        .withMessage('Color is required')
        .isString()
        .withMessage('Color must be a string')
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage('Color must be a valid hex color (e.g., #FF5733 or #F53)')
        .trim(),
];

export const updateEventCategoryValidations = [
    body('name')
        .optional()
        .isString()
        .withMessage('Category name must be a string')
        .isLength({ max: 100 })
        .withMessage('Category name must not exceed 100 characters')
        .trim(),

    body('description')
        .optional()
        .isString()
        .withMessage('Category description must be a string')
        .isLength({ max: 500 })
        .withMessage('Category description must not exceed 500 characters')
        .trim(),

    body('slug')
        .optional()
        .isString()
        .withMessage('Slug must be a string')
        .isLength({ max: 100 })
        .withMessage('Slug must not exceed 100 characters')
        .matches(/^[a-z0-9-]+$/)
        .withMessage(
            'Slug must contain only lowercase letters, numbers, and hyphens'
        )
        .trim(),

    body('color')
        .optional()
        .isString()
        .withMessage('Color must be a string')
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage('Color must be a valid hex color (e.g., #FF5733 or #F53)')
        .trim(),
];

export const getEventCategoriesValidations = [
    query('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value (true or false)'),

    query('search')
        .optional()
        .isString()
        .withMessage('Search must be a string')
        .isLength({ min: 1, max: 100 })
        .withMessage('Search must be between 1 and 100 characters')
        .trim(),

    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be a positive integer between 1 and 100')
        .toInt(),
];
