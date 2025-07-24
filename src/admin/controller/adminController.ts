import { Req, Res } from '@common/types/expressTypes';
import { jWTToken } from '@common/services/jwt';
import { encrypt } from '@common/services/encript';
import { tokenOptions } from '../utils/tockenOptions';
import adminRepository from '../repository/adminRepository';
import { BadRequestError } from '@common/errors/bad-request-error';
import { mediaUpload } from '@common/services/mediaUpload';
import { uniqueString } from '@common/services/uniqueString';
import { MediaFile } from '@common/types/data';

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
            { email },
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

    async getSignedUrl(req: Req, res: Res) {
        const { title, description, photos = [], videos = [] } = req.body;

        //Handle photos
        const photoResults = await Promise.all(
            photos.map(async (photo: MediaFile) => {
                const { contentType } = photo;
                const uniqueId = uniqueString.generateUniqueString();
                const key = `media/photos/${title}-${uniqueId}`;
                const { url } = await mediaUpload.getPresignedUrl(
                    key,
                    contentType
                );
                return { key, url };
            })
        );
        const threshold = parseInt(process.env.MULTIPART_THRESHOLD_MB || '15');
        //Handle videos
        const videoResults = await Promise.all(
            videos.map(async (video: MediaFile) => {
                const { contentType, size = 0 } = video;
                const uniqueId = uniqueString.generateUniqueString();
                const key = `media/videos/${title}-${uniqueId}`;

                if (size > threshold) {
                    const parts = Math.ceil(size / 5); // approx 5MB per part
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
                    };
                }
            })
        );

        res.status(200).json({
            success: true,
            message: 'Presigned URLs generated successfully',
            data: {
                title,
                description,
                photos: photoResults,
                videos: videoResults,
            },
        });
    }
}

export const adminController = new AdminController();
