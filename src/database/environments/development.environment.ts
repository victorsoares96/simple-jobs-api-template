import { AgendaConfig } from 'agenda';
import env from '@/utils/env.util';

const developmentEnvironment: AgendaConfig = {
  db: {
    address: env.get('database.address'),
    options: {
      auth: {
        username: env.get<string>('database.username'),
        password: env.get<string>('database.password'),
      },
      authSource: env.get<string>('database.authSource'),
      ssl: env.get('database.ssl'),
    },
  },
  defaultLockLifetime: 10000,
};

export default developmentEnvironment;
