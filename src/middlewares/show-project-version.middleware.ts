import { NextFunction, Request, Response } from 'express';

export default async function showProjectVersion(
  request: Request,
  response: Response,
  next: NextFunction,
  version: string,
  templateVersion: string,
): Promise<void> {
  response.header('X-Project-Version', version);
  response.header('X-Project-Template-Version', templateVersion);
  return next();
}
