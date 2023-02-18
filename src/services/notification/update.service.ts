import { Job, JobAttributesData } from 'agenda';
import { AppError } from '@/errors/AppError';
import { JobType } from '@/utils/enums/job-type.enum';
import { agenda } from '@/database';

export interface Request {
  jobId: string;
  content: string;
  recurrence: string;
  startDate?: number | Date;
  endDate?: number | Date;
  skipDays?: string;
  timezone?: string;
  type: JobType;
}

export class UpdateNotificationService {
  public async execute(data: Request): Promise<Job<JobAttributesData>> {
    const {
      jobId,
      content,
      recurrence,
      startDate,
      endDate,
      skipDays,
      timezone,
      type,
    } = data;

    if (
      type !== JobType.RepeatAt &&
      type !== JobType.RepeatEvery &&
      type !== JobType.Schedule
    ) {
      throw new AppError(
        'This type provided is invalid. Try use: repeatAt, repeatEvery or schedule',
      );
    }

    const [job] = await agenda.jobs({
      $where() {
        return String(this._id) === jobId;
      },
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

    if (content) {
      job.attrs.data.content = content;
    }

    await job.save();

    return job;
  }
}
