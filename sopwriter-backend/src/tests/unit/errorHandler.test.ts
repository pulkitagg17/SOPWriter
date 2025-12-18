import request from 'supertest';
import express from 'express';
import { errorHandler } from '../../middlewares/errorHandler.js';

const app = express();

app.get('/err', (_req, _res) => {
  throw new Error('boom');
});
app.use(errorHandler);

describe('errorHandler', () => {
  it('returns standardized payload for unhandled error', async () => {
    const res = await request(app).get('/err').expect(500);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('INTERNAL_ERROR');
    expect(res.body.message).toBe('Internal server error');
  });
});
