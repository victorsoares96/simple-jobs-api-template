import Agenda from 'agenda';

import { getAgendaConfig } from './environments';

const config = getAgendaConfig();

export const agenda = new Agenda(config);
