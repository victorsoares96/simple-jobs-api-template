import { AppError } from '@/errors/AppError';
import { agenda } from '@/database';

export interface Request {
  jobId: string;
}

export class StopJobService {
  public async execute({ jobId }: Request): Promise<void> {
    if (!jobId) throw new AppError('The job id is required.');

    await agenda.disable({
      $where() {
        return String(this._id) === jobId;
      },
    });
  }
}
