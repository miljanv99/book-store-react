const EXPRESS = require("express");
const CORS = require("cors");
const CONFIG = require("./config/config");

const PORT = 8000;
let env = "development";

const APP = EXPRESS();

APP.use(
  CORS({
    origin: "*",
  }),
);

require("./config/database.config")(CONFIG[env]);
require("./config/express")(APP);
require("./config/routes")(APP);

APP.listen(PORT);
console.log(`Server is listening on port ${PORT}`);
