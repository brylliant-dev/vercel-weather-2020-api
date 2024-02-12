import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();
const rateLimit = require('express-rate-limit');
const app = express();
const minutes = 10; // 10 minutes
const limiter = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 10,
});

app.use(limiter);
app.set('trust proxy', 1);
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);


app.use('/api/weather', async (req, res) => {
  const apiUrl = req.body.apiUrl;
  const apiKey = process.env.WEATHER_API_KEY || '';
  const result = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
  })
    .then(async (jsonResult) => jsonResult.json().then(({ data }) => data))
    .catch((err) => console.error(err));

  res.json(result);
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
