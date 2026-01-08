import express from 'express';
import cors from 'cors';
import { CONFIG } from './config/config.js';
import connectDatabase from './config/database.config.js';
import setupExpress from './config/express.js';
import setupRoutes from './config/routes.js';
import setupGraphql from './graphql/GraphqlApollo.js';

const PORT = 8000;
const env = 'development';

const APP = express();

APP.use(
  cors({
    origin: '*',
  })
);

const startServer = async () => {
  connectDatabase(CONFIG[env]);

  setupExpress(APP);

  await setupGraphql(APP);

  setupRoutes(APP);

  APP.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
