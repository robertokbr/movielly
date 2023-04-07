import 'express-async-errors';
import express, { NextFunction } from 'express';
import cors from 'cors';
import { routes } from './routes';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.use((err, req, res, next) => {
  if (err.statusCode !== 500) {
    res.status(err.statusCode)
    return res.json(err)
  }

  res.status(403);
  return res.json({ error: err.message });
});

