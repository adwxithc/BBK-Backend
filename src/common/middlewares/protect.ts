import { Next, Req, Res } from '@common/types/expressTypes';

import { ForbiddenRequestError } from '@common/errors/forbidden-request-error';
import { IJwtPayload } from '@common/types/jwt';
import { jWTToken } from '@common/services/jwt';
import { asyncHandler } from '@common/utils/asyncHandler';

declare module 'express' {
    export interface Request {
        user?: IJwtPayload;
    }
}

const protectAdmin = asyncHandler(async (req: Req, res: Res, next: Next) => {
    const token = req.cookies?.token;

    const decoded = await jWTToken.verifyJwt(
        token,
        process.env.JWT_KEY as string
    );

    if (decoded?.email) {
        req.user = decoded;
        return next();
    }

    throw new ForbiddenRequestError();
});

export default protectAdmin;
