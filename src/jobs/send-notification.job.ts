import Agenda, { Job } from 'agenda';
import { agenda } from '@/database';

class SendNotification {
  private agenda: Agenda;

  public constructor() {
    this.agenda = agenda;
  }

  public setup(): void {
    this.agenda.define('send_notification', async (job: Job) => {
      console.log(`Send ${job.attrs.data.content} Notification`, job.attrs);
    });
  }
}

export default SendNotification;
