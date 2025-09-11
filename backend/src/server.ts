import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import routes from './routes';

import { seed } from './utils/seed';

seed();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
