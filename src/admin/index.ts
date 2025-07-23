import serverless from 'serverless-http';
import { connectToDatabase } from '../config/db';
import app from './app';


connectToDatabase();
export const handler = serverless(app);
