import { AppError } from '@/errors/AppError';
import { agenda } from '@/database';

export interface Request {
  jobId: string;
}

export class StartJobService {
  public async execute({ jobId }: Request): Promise<void> {
    if (!jobId) throw new AppError('The job id is required.');

    await agenda.enable({
      $where() {
        return String(this._id) === jobId;
      },
    });
  }
}
