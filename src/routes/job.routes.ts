import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { JobController } from '../controllers/job.controller';

export const router = Router();
const controller = new JobController();

router.get('/find', controller.find);

router.patch(
  '/start/:jobId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      jobId: Joi.string().required().messages({
        'string.base': 'Job id must be a string.',
        'any.required': 'Job id is required.',
      }),
    }),
  }),
  controller.start,
);

router.patch(
  '/stop/:jobId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      jobId: Joi.string().required().messages({
        'string.base': 'Job id must be a string.',
        'any.required': 'Job id is required.',
      }),
    }),
  }),
  controller.stop,
);

router.delete(
  '/remove/:jobId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      jobId: Joi.string().required().messages({
        'string.base': 'Job id must be a string.',
        'any.required': 'Job id is required.',
      }),
    }),
  }),
  controller.remove,
);
