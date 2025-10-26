import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from 'common/middlewares/error-handler';
import { adminRouter } from './routes/adminRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

const corsOptions = {
    origin: [process.env.FE_BASE_URL || 'http://localhost:3000'],
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization', 
        'Cookie',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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
