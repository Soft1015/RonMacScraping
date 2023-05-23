const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { init, getTimer, insertTimer } = require("./db");
const path = require("path");
const { getData } = require("./scraping/ober-haus");
const { getDataBaltic } = require("./scraping/baltic");
const { getDataCapital } = require('./scraping/capital');
const { getDataRebaltic } = require('./scraping/rebaltic');
const { getRemaxData } = require('./scraping/remax');
const { getDataAkorus } = require('./scraping/akorus');
const { getDataAruodas } = require('./scraping/aruodas');
const { getDataKarina } = require('./scraping/karina');
const { getDataASmen } = require('./scraping/asmeninisntbrokeris');

const { checkTime, setFirstTimer, setSecondTimer } = require('./timer');
const routes = require("./routes");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(routes);
init().then( async() => {
  console.log("starting server on port 3300");
  app.listen(3300);
  const time =  await getTimer();
  if(!time){
    insertTimer();
    getData();
    getDataBaltic();
    getDataRebaltic();
    getRemaxData();
    getDataAkorus();
    getDataKarina();
    getDataAruodas();
    getDataASmen();
    getDataCapital();
  }else{
    setFirstTimer(time.timer1);
    setSecondTimer(time.timer2);
  }
  setInterval(checkTime, 1000);
});

app.use(express.static(path.resolve(__dirname, 'build')));
