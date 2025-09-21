import { Next, Req, Res } from '../types/expressTypes';
import { CustomError } from '../errors/custom-error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Req, res: Res, _: Next) => {
    console.error(err);
    if (err instanceof CustomError) {
        return res
            .status(err.statusCode)
            .send({ 
                status: err.statusCode,
                success: false, 
                data: {
                    errors: err.serializeErrors()
                }
            });
    }

    if (err.name === 'CastError') {
        return res.status(400).send({
            status: 400,
            success: false,
            data: {
                errors: [{ message: 'Invalid id format' }]
            }
        });
    }

    res.status(500).json({
        status: 500,
        success: false,
        data: {
            errors: [{ message: 'Something went wrong' }]
        }
    });
};
