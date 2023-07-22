import { exit } from 'process';
import { Server } from 'http';
import { server } from './socket';

export const main_api = async (): Promise<void> => {
  const port = process.env.PORT || 5000;

  server.listen(port, () => {
    console.info(`[server] running on port: ${port}`);
  });

  const signals = ['SIGTERM', 'SIGINT'];
  for (let i = 0; i < signals.length; i++) {
    graceful_shutdown(signals[i], server);
  }

  process.on('uncaughtException', (error) => {
    console.error('[server][uncaughtException]', error);
    // TODO: this should be fatal
    // exit(1);
  });

  process.on('unhandledRejection', (error) => {
    console.error('[server][unhandledRejection]', error);
    // TODO: this should be fatal
    // exit(1);
  });
};

const graceful_shutdown = (signal: string, server: Server): void => {
  process.on(signal, () => {
    console.info(`[server][graceful_shutdown] shutdown with signal: ${signal}`);
    // TODO: close db connection
    server.close(() => {
      exit(0);
    });
  });
};
