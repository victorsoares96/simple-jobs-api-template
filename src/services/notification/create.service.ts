import { Job, JobAttributesData } from 'agenda';
import { agenda } from '@/database';
import { AppError } from '@/errors/AppError';
import { JobType } from '@/utils/enums/job-type.enum';

export interface Request {
  content: string;
  recurrence: string;
  startDate?: number | Date;
  endDate?: number | Date;
  skipDays?: string;
  timezone?: string;
  type: JobType;
}

export class CreateNotificationService {
  public async execute({
    content,
    recurrence,
    startDate,
    endDate,
    skipDays,
    timezone,
    type,
  }: Request): Promise<Job<JobAttributesData>> {
    if (!content) {
      throw new AppError('The content is required');
    }

    if (
      type !== JobType.RepeatAt &&
      type !== JobType.RepeatEvery &&
      type !== JobType.Schedule
    ) {
      throw new AppError(
        'This type provided is invalid. Try use: repeatAt, repeatEvery or schedule',
      );
    }

    const job = await agenda.create('send_notification', {
      content,
      recurrence,
    });

    if (type === 'repeatEvery') {
      await job.repeatEvery(recurrence, {
        startDate,
        endDate,
        skipDays,
        timezone,
      });
    }

    if (type === 'repeatAt') {
      await job.repeatAt(recurrence);
    }

    if (type === 'schedule') {
      await job.schedule(recurrence);
    }

    await job.disable();
    await job.save();

    return job;
  }
}
