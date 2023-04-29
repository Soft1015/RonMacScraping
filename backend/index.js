const express = require("express");
const bodyParser = require("body-parser");
const { init } = require("./db");
const { getData } = require("./scraping/ober-haus");
const { getDataBaltic } = require("./scraping/baltic");
const { getDataCapital } = require('./scraping/capital')
const { getDataRebaltic } = require('./scraping/rebaltic');
const { getRemaxData } = require('./scraping/remax');
const { getDataAkorus } = require('./scraping/akorus');

const routes = require("./routes");

const app = express();
app.use(bodyParser.json());
app.use(routes);

init().then(() => {
  console.log("starting server on port 3000");
  getDataRebaltic();
  app.listen(3000);
});
