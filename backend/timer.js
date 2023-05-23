const { getData } = require("./scraping/ober-haus");
const { getDataBaltic } = require("./scraping/baltic");
const { getDataCapital } = require('./scraping/capital')
const { getDataRebaltic } = require('./scraping/rebaltic');
const { getRemaxData } = require('./scraping/remax');
const { getDataAkorus } = require('./scraping/akorus');
const { getDataAruodas } = require('./scraping/aruodas');
const { getDataKarina } = require('./scraping/karina');
const { getDataASmen } = require('./scraping/asmeninisntbrokeris');
const { deleteItemTable } = require('./db')

let firstTimer = "00:00";
let SecondTimer = "00:00";
let started = false;
const startScraping = async() => {
    await getData();
    getDataBaltic();
    getDataRebaltic();
    getRemaxData();
    getDataAkorus();
    getDataKarina();
    getDataAruodas();
    getDataASmen();
    getDataCapital();
    started = false;
}

const setFirstTimer = (val) => {
    console.log(val);
    firstTimer = val;
}

const setSecondTimer = (val) => {
    SecondTimer = val;
}

const reSet = () => {
    started = false;
}

const checkTime = () => {
    var now = new Date();
    const time = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
     if(!started){
         if(time == firstTimer + ":00" || time == SecondTimer + ":00"){
            started = true;
            deleteItemTable();
            startScraping();
         }
     }
}
function pad(n) {
    return (n < 10) ? '0' + n : n;
}
module.exports = { checkTime, setFirstTimer, setSecondTimer, reSet }