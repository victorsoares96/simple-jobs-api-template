import { Job, JobAttributesData } from 'agenda';
import { agenda } from '@/database';

export type Request = void;

export class FindJobService {
  public async execute(): Promise<[Job<JobAttributesData>[], number]> {
    const jobs = await agenda.jobs();

    return [jobs, jobs.length];
  }
}
