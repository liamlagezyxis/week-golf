import path from 'path';
import fs from 'fs/promises';
import { exit } from 'process';
import dotenv, { DotenvConfigOptions } from 'dotenv';

const configure_dotenv = async (): Promise<void> => {
  const options: DotenvConfigOptions = {
    encoding: 'utf8',
  };

  try {
    const dotenv_path = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
    await fs.access(dotenv_path);
    options.path = dotenv_path;
  } catch (error) {
    options.path = path.resolve(process.cwd(), '.env');
  }

  const { error } = dotenv.config(options);

  /**
   * TODO:
   * developers should set an environment variable i.e LOCAL_DEVELOPMENT=true
   * to indicate that they are running the server locally.
   * this will allow the hosted server to run without a
   * .env file; so we only exit if the server is running
   * locally & env cannot be configured.
   */
  if (error) {
    console.error('[index][fatal] dotenv config error', error);
    exit(1);
  }

  console.info(`[index] using dotenv file: ${path.basename(options.path)}`);
};

(async (): Promise<void> => {
  try {
    if (!process.env.NODE_ENV) {
      console.error('[index][fatal] NODE_ENV not set');
      exit(1);
    }
    await configure_dotenv();
    console.info(`[index] NODE_ENV: ${process.env.NODE_ENV}`);

    const args = process.argv.slice(2);
    const main_cmd = args[0] ? args[0].toLowerCase().trim() : '-api';

    console.info(`[index] running command: '${main_cmd}'`);

    switch (main_cmd) {
      case '-api': {
        const { main_api } = await import('./server');
        await main_api();
        break;
      }
      default: {
        console.warn(`[index] unknown command: '${main_cmd}'`);
        exit(0);
      }
    }
  } catch (error) {
    console.error('[index][fatal] error', error);
    exit(1);
  }
})();
