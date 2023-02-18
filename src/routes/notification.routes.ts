import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { NotificationController } from '@/controllers/notification.controller';
import { JobType } from '@/utils/enums/job-type.enum';

export const router = Router();
const controller = new NotificationController();

router.post(
  '/create',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      content: Joi.string().required().messages({
        'string.base': 'Content must be a string.',
        'any.required': 'Content is required.',
      }),
      recurrence: Joi.string().required().messages({
        'string.base': 'Recurrence must be a string.',
        'any.required': 'Recurrence is required.',
      }),
      startDate: Joi.date().messages({
        'date.base': 'Start date must be a date.',
      }),
      endDate: Joi.date().messages({
        'date.base': 'End date must be a date.',
      }),
      skipDays: Joi.string().messages({
        'string.base': 'Skip days must be a string.',
      }),
      timezone: Joi.string().messages({
        'string.base': 'Timezone must be a string.',
      }),
      type: Joi.string()
        .equal(JobType.RepeatAt, JobType.RepeatEvery, JobType.Schedule)
        .messages({
          'string.base': 'String must be a string.',
        }),
    }),
  }),
  controller.create,
);

router.put(
  '/update',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      jobId: Joi.string().required().messages({
        'string.base': 'Job id must be a string.',
        'any.required': 'Job id is required.',
      }),
    }),
    [Segments.BODY]: Joi.object().keys({
      content: Joi.string().required().messages({
        'string.base': 'Content must be a string.',
        'any.required': 'Content is required.',
      }),
      recurrence: Joi.string().required().messages({
        'string.base': 'Recurrence must be a string.',
        'any.required': 'Recurrence is required.',
      }),
      startDate: Joi.date().messages({
        'date.base': 'Start date must be a date.',
      }),
      endDate: Joi.date().messages({
        'date.base': 'End date must be a date.',
      }),
      skipDays: Joi.string().messages({
        'string.base': 'Skip days must be a string.',
      }),
      timezone: Joi.string().messages({
        'string.base': 'Timezone must be a string.',
      }),
      type: Joi.string()
        .equal(JobType.RepeatAt, JobType.RepeatEvery, JobType.Schedule)
        .messages({
          'string.base': 'String must be a string.',
        }),
    }),
  }),
  controller.update,
);
