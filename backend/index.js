const express = require("express");
const bodyParser = require("body-parser");
const { init } = require("./db");
const { getData } = require("./scraping/ober-haus");
const { getDataBaltic } = require("./scraping/baltic");

const routes = require("./routes");

const app = express();
app.use(bodyParser.json());
app.use(routes);

init().then(() => {
  console.log("starting server on port 3000");
  getDataBaltic();
  app.listen(3000);
});
