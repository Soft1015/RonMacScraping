const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require('../db')
const { gotScraping } = require("got-scraping");
const fs = require("fs");
const NodeGeocoder = require('node-geocoder');
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const { executablePath } = require("puppeteer");

const UrlList = [
    {
        url: 'https://m.en.aruodas.lt/butu-nuoma/puslapis/',
        type: '2',
        go2Page: false,
    },
    {
        url: 'https://m.en.aruodas.lt/namu-nuoma/puslapis/',
        type: '3',
        go2Page: true,
    },
    {
        url: 'https://m.en.aruodas.lt/butai/puslapis/',
        type: '0',
        go2Page: false,
    },
    {
        url: 'https://m.en.aruodas.lt/namai/puslapis/',
        type: '1',
        go2Page: true,
    },
];

const options = {
    provider: 'google',

    apiKey: 'AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

let browser = null;
puppeteer.use(StealthPlugin());
puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: '1246871020d7c43acab27ac8d79b416f' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
        },
        visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    })
)
const getDataAruodas = async () => {

    let scrapeData = [];
    browser = await puppeteer.launch({ executablePath: executablePath(), headless: false });
    for (var i = 0; i < 1; i++) {
        let pageLength = 1;
        try {
            console.log('dd');
            const page = await browser.newPage();
            await page.goto(UrlList[i]?.url + "1/", { waitUntil: 'load', timeout: 0 });
            await page.solveRecaptchas();
            await page.waitForSelector('#divBodyContainer > div.body-content-container.min-320 > div.nav-toolbar-v2')
                .then(async () => {
                    const html = await page.content();
                    const dom = new JSDOM(html);
                    const addrRegex = /^\s*(.*?)\s*$/;
                    let pageList = dom.window.document.querySelector("#divBodyContainer > div.body-content-container.min-320 > div.nav-toolbar-v2 > div.page-select-v2 > a").textContent.replace(/(\r\n|\n|\r|\t)/gm, "");
                    pageList = pageList.match(addrRegex)[1];
                    pageLength = parseInt(pageList.split("from")[1].replace(/\s/g, ""));
                    await page.close();
                    let val = await getDetailOfRoom(pageLength, UrlList[i].url, UrlList[i].type, UrlList[i].go2Page);
                    scrapeData = scrapeData.concat(val);
            });

        } catch (err) {
            console.log(err);
        }
    }
    if (scrapeData.length > 0) {
        // insertMultiItems(scrapeData);
        browser.close();
        console.log('completed on Aruodas!!!!!!!!!');
    }
};

const getDetailOfRoom = async (length, url, type, go2Page) => {
    let partData = [];
    for (let i = 0 + 1; i <= length; i++) {
        console.log("processing: " + i + " of " + length + " on Aruodas");
        try {
            const page = await browser.newPage();
            await page.goto(url + `${i}/`, { waitUntil: 'load', timeout: 0 });
            // await page.solveRecaptchas();
            await page.waitForSelector('#divBodyContainer > div.body-content-container.min-320 > div.nav-toolbar-v2')
                .then(async () => {
                    const html = await page.content();
                    const dom = new JSDOM(html);
                    let details = dom.window.document.querySelectorAll("#divBodyContainer > div.body-content-container.min-320 > ul.search-result-list-big_thumbs li.result-item-big-thumb");
                    const addrRegex = /^\s*(.*?)\s*$/;
                    // var allPromises = [];
                    console.log('222222222222');
                    for (let j = 0; j < details.length; j++) {
                        let imgSrc = "", addr, area, price, rooms, detail;
                        let res;
                        imgSrc = details[j].querySelector('img').getAttribute('src');
                        // console.log(imgSrc);
                        // addr = details[j].querySelector('span > span.item-address-v3').textContent.replace(/(\r\n|\n|\r|\t)/gm, "");
                        // addr = addr.match(addrRegex)[1];
                        // detail = details[j].querySelector('span > span.item-description-v3').textContent.replace(/(\r\n|\n|\r|\t)/gm, "");
                        // price = details[j].querySelector('span > span.item-price-main-v3');
                        // const match = price?.textContent.split("€")[0].replace(/\s/g, "");
                        // const number = parseFloat(match);
                        // if (go2Page) {
                        //     let link = details[j].querySelector('a').getAttribute('href');
                        //     const page1 = await browser.newPage();
                        //     await page1.goto(link, { waitUntil: 'load', timeout: 0 });
                        //     const html1 = await page1.content();
                        //     const detailDom = new JSDOM(html1);
                        //     let x, y;
                        //     console.log(detailDom);
                        //     let map = detailDom.window.document.querySelector('#divBodyContainer > div.body-content-container > div > div.show-map-line-wrapper > a.show-map-line-inner');
                        //     map = map.getAttribute('href').split("query=")[1];
                        //     x = parseFloat(map.split("C")[0]);
                        //     y = parseFloat(map.split("C")[1]);
                        //     const dl = detailDom.window.document.querySelector('#advertInfoContainer > dl');
                        //     const dt = dl.querySelectorAll('dt');
                        //     const dd = dl.querySelectorAll('dd');
                        //     let roomIndex = -1, areaIndex = -1;
                        //     for (let k = 0; k < dt.length; k++) {
                        //         if (dt[k].textContent.includes('Number of rooms')) {
                        //             roomIndex = k;
                        //         }
                        //         if (dt[k].textContent.includes('Area')) {
                        //             areaIndex = k;
                        //         }
                        //     }
                        //     const obj = {
                        //         type: type,
                        //         adressline: addr,
                        //         title: '',
                        //         img: imgSrc,
                        //         area: dd[areaIndex] ? dd[areaIndex].textContent.split("m²")[0].replace(",", ".").replace(/\s/g, "") : '1',
                        //         rooms: dd[roomIndex] ? dd[roomIndex].textContent.replace(/\s/g, "") : '1',
                        //         priceEUR: number,
                        //         x: x,
                        //         y: y
                        //     };
                        //     console.log(obj);
                        //     partData.push(obj);
                        // } else {
                        //     detail = detail.match(addrRegex)[1];
                        //     detail = detail.split('m²')[0];
                        //     rooms = detail.split('rooms')[0].replace(/\s/g, "");
                        //     area = detail.split('rooms')[1].slice('1').replace(",", ".").replace(/\s/g, "");
                        //     res = geocoder.geocode(addr).then((cooder) => {
                        //         const obj = {
                        //             type: type,
                        //             adressline: addr,
                        //             title: '',
                        //             img: imgSrc,
                        //             area: area ? area : "1",
                        //             rooms: rooms ? rooms : "1",
                        //             priceEUR: number,
                        //             x: cooder?.[0].latitude,
                        //             y: cooder?.[0].longitude
                        //         };
                        //         console.log(obj);
                        //         partData.push(obj);
                        //     });
                        // }
                        // allPromises.push(res);
                    }
                    // await Promise.all(allPromises);
                    await page.close();
                }).catch(e => console.log(e));
            console.log('done')
        } catch (err) {
            console.log(err);
        }
    }
    return partData;
};

module.exports = { getDataAruodas };
