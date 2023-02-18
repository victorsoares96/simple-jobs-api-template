/* eslint-disable import/no-named-as-default */
import 'express-async-errors';

import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';

import compression from 'compression';
import Agenda, { Job } from 'agenda';
import { errorHandler } from './middlewares/error-handler.middleware';
import { router as jobRouter } from './routes/job.routes';
import { router as notificationRouter } from './routes/notification.routes';
import log from './utils/log.util';
import showProjectVersion from './middlewares/show-project-version.middleware';
import { agenda } from './database';
import SendNotification from './jobs/send-notification.job';

class App {
  public express: express.Application;

  private agenda: Agenda;

  private port: number;

  private version: string;

  private templateVersion: string;

  private sendNotification: SendNotification;

  public constructor() {
    this.port = 7000;

    this.express = express();
    this.agenda = agenda;

    this.sendNotification = new SendNotification();

    this.express.use(compression());
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.json({ limit: '5mb' }));
    this.express.use(express.urlencoded({ limit: '5mb', extended: true }));

    this.fetchProjectVersion();

    this.routeLevelMiddlewares();
    this.routes();
    this.errorHandlerMiddlewares();
  }

  private fetchProjectVersion(): void {
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'),
    );

    this.version = packageJson.version;
    this.templateVersion = packageJson.templateVersion;
  }

  private routeLevelMiddlewares(): void {
    this.express.use((...handlers) =>
      showProjectVersion(...handlers, this.version, this.templateVersion),
    );
  }

  private errorHandlerMiddlewares(): void {
    this.express.use(errorHandler);
  }

  private setupAgendaListeners(): void {
    this.agenda.on('start', job => {
      log.info('Job %s starting', job.attrs.name);
    });

    this.agenda.on('complete', job => {
      log.info(`Job ${job.attrs.name} finished`);
    });

    this.agenda.on('success:send_notification', job => {
      log.info(`Sent ${job.attrs.data.content}`);
    });

    this.agenda.on('fail:send_notification', (err, job: Job) => {
      log.error(`Job ${job.attrs._id} failed with error: ${err.message}`);
    });
  }

  private setupJobs(): void {
    this.sendNotification.setup();
  }

  private setupAgenda(): Promise<unknown> {
    this.setupJobs();
    this.setupAgendaListeners();

    return this.agenda.start();
  }

  public startServer(): void {
    this.setupAgenda()
      .then(() => {
        this.express
          .listen(this.port, () => {
            log.info(`🚀  Server started on port ${this.port}!`);
          })
          .on('error', err => {
            log.error(`❌  Error when starting the server: ${err.message}`);
          });
      })
      .catch(reason => {
        log.error(`❌  Error when starting the server: ${reason.message}`);
      });
  }

  private routes(): void {
    this.express.use('/api/jobs', jobRouter);
    this.express.use('/api/notifications', notificationRouter);
  }
}

export default new App();
