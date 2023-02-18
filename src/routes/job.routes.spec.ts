import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../app';
import { JobType } from '@/utils/enums/job-type.enum';

let mongod: MongoMemoryServer;

describe('job routes', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    await request(app.express).post('/api/notifications/create').send({
      content: 'Test Notification',
      recurrence: '5 seconds',
      type: JobType.RepeatEvery,
    });
  });

  afterAll(async () => {
    await mongod.stop();
  });

  describe('GET /find', () => {
    it('returns with status 200', async () => {
      const result = await request(app.express).get('/api/jobs/find');

      const [jobs] = result.body;

      expect(result.status).toEqual(200);
      expect(jobs[0]).toHaveProperty('_id');
    });
  });

  describe('PATCH /start/:jobId', () => {
    it('returns with status 200', async () => {
      const find = await request(app.express).get('/api/jobs/find');

      const [jobs] = find.body;

      const result = await request(app.express)
        .patch(`/api/jobs/start/${jobs[0]._id}`)
        .send();

      expect(result.status).toEqual(200);
    });
  });

  describe('PATCH /stop/:jobId', () => {
    it('returns with status 200', async () => {
      const find = await request(app.express).get('/api/jobs/find');

      const [jobs] = find.body;

      const result = await request(app.express)
        .patch(`/api/jobs/stop/${jobs[0]._id}`)
        .send();

      expect(result.status).toEqual(200);
    });
  });

  describe('DELETE /remove/:jobId', () => {
    it('returns with status 200', async () => {
      const find = await request(app.express).get('/api/jobs/find');

      const [jobs] = find.body;

      const result = await request(app.express)
        .delete(`/api/jobs/remove/${jobs[0]._id}`)
        .send();

      expect(result.status).toEqual(200);
    });
  });
});
