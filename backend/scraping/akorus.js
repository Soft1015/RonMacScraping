const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require('../db')
const NodeGeocoder = require('node-geocoder');

const UrlList = [
    {
        url: 'https://akorus.lt/nekilnojamas-turtas?deal_type=1',
        type: '0'
    },
    {
        url: 'https://akorus.lt/nekilnojamas-turtas?deal_type=2',
        type: '1'
    },
    {
        url: 'https://akorus.lt/nekilnojamas-turtas?deal_type=3',
        type: '2'
    },
    {
        url: 'https://akorus.lt/nekilnojamas-turtas?deal_type=4',
        type: '3'
    }
];

const options = {
    provider: 'google',
  
    apiKey: 'AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
const geocoder = NodeGeocoder(options);
const getDataAkorus = async () => {

    let scrapeData = [];
    for (var i = 0; i < UrlList.length; i++) {

        let response = null;
        let pageLength = 1;
        try {
            response = await fetch(UrlList[i]?.url, { method: "get" });
            const result = await response.text();
            const dom = new JSDOM(result);
            let pageList = dom.window.document.querySelectorAll("#yw0 > li");
            if (pageList.length != 0) {
                let last = dom.window.document.querySelector("#yw0 > li.last > a");
                if (last) {
                    pageLength = last.getAttribute('href').split('=').pop();
                }
            }
            let val = await getDetailOfRoom(pageLength, UrlList[i].url, UrlList[i].type);
            scrapeData = scrapeData.concat(val);
        } catch (err) {
            console.log(err);
        }
    }
    if(scrapeData.length > 0){
        insertMultiItems(scrapeData);
        console.log('completed on AKORUS!!!!!!!!!');
    }
};

const getDetailOfRoom = async (length, url, type) => {
    let partData = [];
    for (let i = 0 + 1; i <= length; i++) {
        console.log("processing: " + i + " of " + length + " on AKORUS");
        try {
            response = await fetch(url + "&page=" + i);
            const result = await response.text();
            const dom = new JSDOM(result);
            let details = dom.window.document.querySelectorAll("#objektas-grid > div.table-responsive > div > div.items > div");
            for (let j = 0; j < details.length; j++) {
                let imgSrc="", addr, area, price, rooms;
                const img = details[j].querySelector('img');
                const link = details[j].querySelector('a').getAttribute('href');
                addr = details[j].querySelector('div.Rtable-cell.bendrine > div.Rtable-cell.wrap.adresas > a');
                rooms = details[j].querySelector('div.Rtable-cell.bendrine > div.Rtable-cell.text-center.kambariu_sk');
                area = details[j].querySelector('div.Rtable-cell.bendrine > div.Rtable-cell.text-center.bendras_plotas');
                price = details[j].querySelector('div.Rtable-cell.text-center.kaina > strong');
                addr = addr.innerHTML.replace('<br>', " ");
                const match = price?.textContent.split("€")[0].replace(/\s/g, "");
                const number = parseFloat(match);
                if (img) imgSrc = "https://akorus.lt/" + img.getAttribute('src');
                const res = await geocoder.geocode(addr);
                const obj = {
                    type:type,
                    adressline:addr,
                    title:'',
                    img:imgSrc,
                    area:area? area.textContent : "1",
                    rooms:rooms?.textContent ? rooms?.textContent : "1",
                    priceEUR:number,
                    x:res?.[0].latitude,
                    y:res?.[0].longitude,
                    url:"https://akorus.lt/" + link
                };
                partData.push(obj);
            }
        } catch (err) {
            console.log(err);
        }
    }
    return partData;
};

module.exports = { getDataAkorus };
