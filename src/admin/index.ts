import serverless from 'serverless-http';
import { connectToDatabase } from '@common/config/db';
import app from './app';


connectToDatabase();
export const handler = serverless(app);
