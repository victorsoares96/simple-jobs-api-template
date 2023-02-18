import { Request, Response } from 'express';
import {
  CreateNotificationService,
  Request as CreateRequest,
} from '@/services/notification/create.service';
import {
  UpdateNotificationService,
  Request as UpdateRequest,
} from '@/services/notification/update.service';

export class NotificationController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      content,
      recurrence,
      startDate,
      endDate,
      skipDays,
      timezone,
      type,
    } = request.body as CreateRequest;

    const createNotification = new CreateNotificationService();

    const data = await createNotification.execute({
      content,
      recurrence,
      startDate,
      endDate,
      skipDays,
      timezone,
      type,
    });

    return response.json(data);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const {
      jobId,
      content,
      recurrence,
      startDate,
      endDate,
      skipDays,
      timezone,
      type,
    } = request.body as UpdateRequest;

    const updateNotification = new UpdateNotificationService();

    const data = await updateNotification.execute({
      jobId,
      content,
      recurrence,
      startDate,
      endDate,
      skipDays,
      timezone,
      type,
    });

    return response.json(data);
  }
}
