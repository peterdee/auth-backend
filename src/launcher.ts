import buildServer from './server';

import log from './utilities/log';
import { PORT } from './configuration';

async function launch() {
  const server = await buildServer();

  server.listen(
    PORT,
    (error, address): void => {
      if (error) {
        throw new Error(error.message);
      }

      return log(`-- AUTH-SERVER is running [${address}]`);
    },
  );
}

launch();
