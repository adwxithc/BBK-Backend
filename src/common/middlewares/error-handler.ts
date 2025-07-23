import { Next, Req, Res } from "../types/expressTypes";
import { CustomError } from "../errors/custom-error";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Req, res: Res,_ :Next) => {
    console.error(err);
    if (err instanceof CustomError) {
        return res
            .status(err.statusCode)
            .send({ errors: err.serializeErrors() });
    }


    if (err.name === "CastError" ) {
        return res.status(400).send({
            success:false,
            errors: [{ message: "Invalid id format" }],
        });
    }

    res.status(500).json({
        success:false,
        errors: [{ message: "Something went wrong" }],
    });
};
