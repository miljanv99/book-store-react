const EXPRESS = require('express');
const CORS = require('cors');
const CONFIG = require('./config/config');

const PORT = 8000;
let env = 'development';

const APP = EXPRESS();

APP.use(
  CORS({
    origin: '*',
  })
);

const startServer = async () => {
  require('./config/database.config')(CONFIG[env]);
  require('./config/express')(APP);
  await require('./graphql/GraphqlApollo')(APP);
  require('./config/routes')(APP);

  APP.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
