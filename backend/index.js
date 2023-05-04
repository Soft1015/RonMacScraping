const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { init } = require("./db");
const { getData } = require("./scraping/ober-haus");
const { getDataBaltic } = require("./scraping/baltic");
const { getDataCapital } = require('./scraping/capital')
const { getDataRebaltic } = require('./scraping/rebaltic');
const { getRemaxData } = require('./scraping/remax');
const { getDataAkorus } = require('./scraping/akorus');
const { getDataAruodas } = require('./scraping/aruodas');
const { getDataKarina } = require('./scraping/karina');
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(routes);

init().then( async() => {
  console.log("starting server on port 3300");
  app.listen(3300);
  // await getData();
  // await getDataBaltic();
  // await getDataRebaltic();
  // await getRemaxData();
  // await getDataAkorus();
  // await getDataKarina();
  // await getDataAruodas();
  await getDataCapital();
});
