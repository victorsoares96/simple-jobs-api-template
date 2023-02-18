/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import { StartJobService } from '@/services/job/start.service';
import { StopJobService } from '@/services/job/stop.service';
import { RemoveJobService } from '@/services/job/remove.service';
import { FindJobService } from '@/services/job/find.service';

export class JobController {
  public async start(request: Request, response: Response): Promise<Response> {
    const { jobId } = request.params;

    const startJob = new StartJobService();

    await startJob.execute({ jobId });

    return response.send();
  }

  public async stop(request: Request, response: Response): Promise<Response> {
    const { jobId } = request.params;

    const stopJob = new StopJobService();

    await stopJob.execute({ jobId });

    return response.send();
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const { jobId } = request.params;

    const removeJob = new RemoveJobService();

    await removeJob.execute({ jobId });

    return response.send();
  }

  public async find(request: Request, response: Response): Promise<Response> {
    const findJobs = new FindJobService();
    const jobs = await findJobs.execute();

    return response.json(jobs);
  }
}
