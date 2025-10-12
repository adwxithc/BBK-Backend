import { Req, Res } from '@common/types/expressTypes';
import { jWTToken } from '@common/services/jwt';
import { encrypt } from '@common/services/encript';
import { tokenOptions } from '../utils/tockenOptions';
import adminRepository from '../repository/adminRepository';
import { BadRequestError } from '@common/errors/bad-request-error';
import { mediaUpload } from '@common/services/mediaUpload';
import { uniqueString } from '@common/services/uniqueString';
import { MediaFile } from '@common/types/data';
import eventRepository from 'admin/repository/eventRepository';

class AdminController {
    async login(req: Req, res: Res) {
        const { email, password } = req.body;
        let user = await adminRepository.findByEmail(email);
        if (!user) throw new BadRequestError('invalid email or password');

        const { password: hashPassword, name } = user;
        const passwordMatch = await encrypt.comparePassword(
            password,
            hashPassword
        );

        if (!passwordMatch)
            throw new BadRequestError('invalid email or password');

        const token = jWTToken.createJWT(
            { email, name },
            process.env.JWT_KEY as string
        );

        res.cookie('token', token, tokenOptions);
        res.json({
            success: true,
            data: { name, email },
        });
    }

    logout(req: Req, res: Res) {
        res.clearCookie('token');
        res.json({
            success: true,
            message: 'successfully logout',
        });
    }

    checkAuth(req: Req, res: Res) {
        if (!req.user) {
            throw new BadRequestError('User not authenticated');
        }

        const { email, name } = req.user;

        res.json({
            success: true,
            data: { name, email },
        });
    }

    async getSignedUrl(req: Req, res: Res) {
        const { title, mediaFiles = [] } = req.body;
        const thresholdMB = parseInt(
            process.env.MULTIPART_THRESHOLD_MB || '15'
        );
        const threshold = thresholdMB * 1024 * 1024;

        const fileResults = await Promise.all(
            mediaFiles.map(async (file: MediaFile) => {
                const { contentType, size = 0, type } = file;
                const uniqueId = uniqueString.generateUniqueString();
                const key = `media/${type}/${title}-${uniqueId}`;

                if (size > threshold) {
                    const partSizeMB = process.env.MULTIPART_PART_SIZE_MB || '5';
                    const partSize = parseInt(partSizeMB) * 1024 * 1024;
                    const parts = Math.ceil(size / partSize);
                    const multipartResult =
                        await mediaUpload.getMultipartPresignedUrls(
                            key,
                            contentType,
                            parts
                        );

                    return {
                        key,
                        uploadId: multipartResult.uploadId,
                        parts: multipartResult.urls,
                        multipart: true,
                        type,
                    };
                } else {
                    const { url } = await mediaUpload.getPresignedUrl(
                        key,
                        contentType
                    );
                    return {
                        key,
                        url,
                        multipart: false,
                        type,
                    };
                }
            })
        );
        const images = fileResults.filter((file) => file.type === 'image');
        const videos = fileResults.filter((file) => file.type === 'video');
        res.status(200).json({
            success: true,
            message: 'Presigned URLs generated successfully',
            data: {
                title,
                files: fileResults,
                images,
                videos,
            },
        });
    }

    async completeMultipartUploadBatch(req: Req, res: Res) {
        const { uploads } = req.body;
        if (!uploads || !Array.isArray(uploads) || uploads.length === 0) {
            throw new BadRequestError('No uploads provided');
        }
        const results = await Promise.all(
            uploads.map(async (upload: any) => {
                const { key, uploadId, parts } = upload;
                return mediaUpload.completeMultipartUpload(
                    key,
                    uploadId,
                    parts
                );
            })
        );
        res.status(200).json({
            success: true,
            message: 'All uploads completed successfully',
            data: results,
        });
    }

    async abortMultipartUpload(req: Req, res: Res) {
        const { key, uploadId } = req.body;
        if (!key || !uploadId) {
            throw new BadRequestError('Key and Upload ID are required');
        }
        await mediaUpload.abortMultipartUpload(key, uploadId);
        res.status(200).json({
            success: true,
            message: 'Multipart upload aborted successfully',
        });
    }

    async createEvent(req: Req, res: Res) {
        const { title, description, images = [], videos = [] } = req.body;
        const event = { title, description, images, videos };
        const newEvent = await eventRepository.createEvent(event);
        res.status(201).json({
            success: true,
            message: 'Event metadata stored successfully',
            data: newEvent,
        });
    }
}

export const adminController = new AdminController();
