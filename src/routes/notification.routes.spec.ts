import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { JobAttributes } from 'agenda';
import { JobType } from '@/utils/enums/job-type.enum';

import app from '../app';

let mongod: MongoMemoryServer;

describe('notification routes', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  describe('POST /create', () => {
    it('returns create response with status 200', async () => {
      const result = await request(app.express)
        .post('/api/notifications/create')
        .send({
          content: 'Test Notification',
          recurrence: '5 seconds',
          type: JobType.RepeatEvery,
        });

      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('_id');
      expect(result.body.data).toHaveProperty('content', 'Test Notification');
    });

    it('returns create response with status 400 - Content is required', async () => {
      const result = await request(app.express)
        .post('/api/notifications/create')
        .send({
          content: '',
          recurrence: '5 seconds',
          type: JobType.RepeatEvery,
        });

      expect(result.status).toEqual(400);
      expect(result.body).toHaveProperty('message', 'Validation failed');
      expect(result.body.validation.body).toHaveProperty(
        'message',
        '"content" is not allowed to be empty',
      );
    });

    it('returns create response with status 400 - type is invalid', async () => {
      const result = await request(app.express)
        .post('/api/notifications/create')
        .send({
          content: 'Test Notification',
          recurrence: '5 seconds',
          type: 'unknown value',
        });

      expect(result.status).toEqual(400);
      expect(result.body).toHaveProperty('message', 'Validation failed');
      expect(result.body.validation.body).toHaveProperty(
        'message',
        '"type" must be one of [repeatAt, repeatEvery, schedule]',
      );
    });
  });

  describe('PUT /update', () => {
    let job: JobAttributes;

    beforeAll(async () => {
      const result = await request(app.express)
        .post('/api/notifications/create')
        .send({
          content: 'Test Notification',
          recurrence: '5 seconds',
          type: JobType.RepeatEvery,
        });

      job = result.body;
    });

    it('returns update response with status 200', async () => {
      const result = await request(app.express)
        .put('/api/notifications/update')
        .query({ jobId: job._id })
        .send({
          content: 'Test Notification Updated',
          recurrence: '5 seconds',
          type: JobType.RepeatEvery,
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toHaveProperty(
        'content',
        'Test Notification Updated',
      );
    });

    it('returns update response with status 400 - Content is required', async () => {
      const result = await request(app.express)
        .put('/api/notifications/update')
        .query({ jobId: job._id })
        .send({
          content: '',
          recurrence: '5 seconds',
          type: JobType.RepeatEvery,
        });

      expect(result.status).toEqual(400);
      expect(result.body).toHaveProperty('message', 'Validation failed');
      expect(result.body.validation.body).toHaveProperty(
        'message',
        '"content" is not allowed to be empty',
      );
    });

    it('returns update response with status 400 - type is invalid', async () => {
      const result = await request(app.express)
        .put('/api/notifications/update')
        .query({ jobId: job._id })
        .send({
          content: 'Test Notification',
          recurrence: '5 seconds',
          type: 'unknown value',
        });

      expect(result.status).toEqual(400);
      expect(result.body).toHaveProperty('message', 'Validation failed');
      expect(result.body.validation.body).toHaveProperty(
        'message',
        '"type" must be one of [repeatAt, repeatEvery, schedule]',
      );
    });
  });
});
