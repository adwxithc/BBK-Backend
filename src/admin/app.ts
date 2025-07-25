import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from 'common/middlewares/error-handler';
import { adminRouter } from './routes/adminRoutes';
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/admin', adminRouter(express.Router()));

app.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
        error: 'Not Found',
    });
});
app.use(errorHandler);
export default app;
