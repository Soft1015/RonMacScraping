const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require('../db')
const NodeGeocoder = require('node-geocoder');


const options = {
    provider: 'google',

    apiKey: 'AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);
const getDataASmen = async () => {

    let scrapeData = [];

    let response = null;
    let pageLength = 1;

    response = await fetch("https://asmeninisntbrokeris.lt/siuo-metu-parduodame");
    const result = await response.text();
    const dom = new JSDOM(result);
    let details = dom.window.document.querySelectorAll("#listings > div.listingblock");
    for (let j = 0; j < details.length; j++) {
        const item = details[j];
        let img, price, title, addr, bed, area, url, type;
        const addrRegex = /^\s*(.*?)\s*$/;
        try {
            console.log("processing: " + (j + 1) + " of " + details.length + " on ASmen");
            img = item.querySelector('img').getAttribute('src');
            url = item.querySelector('a').getAttribute('href');
            price = item.querySelector('p.price').textContent.split(" ")[0].replace("€", "").replace(",", "").replace(/\s/g, "");
            addr = item.querySelector('h4.address').textContent;
            addr = addr.match(addrRegex)[1];
            const total = item.querySelector('p.twofeatures');
            bed = total.textContent.split('|')[1].replace(/\s/g, "").split('k')[0];
            area = total.textContent.split('|')[0].replace(/\s/g, "").split('k')[0];
            type = total.textContent.split('|')[2];
            if (type.includes('Butas pardavimui')) {
                type = "0";
            } else if (type.includes('Namas pardavimui')) {
                type = "1";
            } else if (type.includes('Butas nuomai')) {
                type = "2";
            } else if (type.includes('Namas nuomai')) {
                type = "3";
            } else {
                type = "4";
            }
            if (type != "4") {
                const res = await geocoder.geocode(addr);
                const obj = {
                    type: type,
                    adressline: addr,
                    title: '',
                    img: img,
                    area: area,
                    rooms: bed,
                    priceEUR: price,
                    x: res?.[0].latitude,
                    y: res?.[0].longitude,
                    url: url
                };
                scrapeData.push(obj);
            }
        } catch (error) {
            console.log(error);
        }
    }
    console.log(scrapeData.length);
    if (scrapeData.length > 0) {
        insertMultiItems(scrapeData);
        console.log('completed on ASmen!!!!!!!!!');
    }
}



module.exports = { getDataASmen };
