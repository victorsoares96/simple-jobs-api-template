import { AgendaConfig } from 'agenda';
import developmentEnvironment from './development.environment';
import productionEnvironment from './production.environment';

export function getAgendaConfig(): AgendaConfig {
  const environment = process.env.NODE_ENV;

  if (environment === 'production') {
    return productionEnvironment;
  }

  return developmentEnvironment;
}
