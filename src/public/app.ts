import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from 'common/middlewares/error-handler';
import { publicRouter } from './routes/publicRoutes';
import cors from 'cors';

const app = express();

const corsOptions = {
    origin: '*', // Allow all origins for public API
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ],
    preflightContinue: false,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Public API is healthy',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/v1', publicRouter(express.Router()));

app.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
        success: false,
        error: 'Not found',
    });
});

app.use(errorHandler);

export default app;