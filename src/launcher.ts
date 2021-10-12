import buildServer from './server';

import { PORT } from './configuration';

async function launch() {
  const server = await buildServer();

  server.listen(
    PORT,
    (error): void => {
      if (error) {
        throw new Error(error.message);
      }
    },
  );
}

launch();
