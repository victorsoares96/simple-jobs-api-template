/* eslint-disable import/first */
import path from 'path';

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, '../environments/');
import env from 'config';

export default env;
