const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require('../db')
const fs = require('fs');
const puppeteer = require('puppeteer');
const NodeGeocoder = require('node-geocoder');

const UrlList = [
    {
        pay:'for-sale',
        type:'apt',
        typeIndex:'0'
    },
    {
        pay:'for-sale',
        type:'hscot',
        typeIndex:'1'
    },
    {
        pay:'for-rent',
        type:'apt',
        typeIndex:'2'
    },
    {
        pay:'for-rent',
        type:'hscot',
        typeIndex:'3'
    }
];
let url = "https://www.rebaltic.lt/en/catalog/";

const options = {
    provider: 'google',
  
    apiKey: 'AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
const geocoder = NodeGeocoder(options);
let browser = null;
const getDataRebaltic = async () => {

    let scrapeData = [];
    browser = await puppeteer.launch({ headless: false });
    for(var i = 0; i < UrlList.length; i ++){
        let response = null;
        let pageLength = 1;
        try {
            response = await fetch(`${url}${UrlList[i].pay}/?page=10&sort=date_desc&types=${UrlList[i].type}`);
            const page = await browser.newPage();
            await page.goto(`${url}${UrlList[i].pay}/?page=1&sort=date_desc&types=${UrlList[i].type}`, { waitUntil: 'load', timeout: 0 });
            await page.waitForSelector('body > div.wrapper.page-wrapper > div > div.content.page-content > div > div > div.catalog-pager > a:nth-child(5)')
            .then( async () =>{
                const html = await page.content();
                const dom = new JSDOM(html);
                const pages = dom.window.document.querySelector('body > div.wrapper.page-wrapper > div > div.content.page-content > div > div > div.catalog-pager > a:nth-child(5)');
                pageLength = parseInt(pages.getAttribute('href').split('/').pop().slice('1'));
                await page.close();
            });
            let val = await getDetailOfRoom(pageLength, UrlList[i].pay, UrlList[i].type, UrlList[i].typeIndex);
            scrapeData = scrapeData.concat(val);
        } catch (err) {
            console.log(err);
        }
    }
    if(scrapeData.length > 0){
        insertMultiItems(scrapeData);
        console.log('completed on Rebaltic!!!!!!!!!');
        browser.close();
    }
};

const getDetailOfRoom = async (length, pay, type, typeIndex) => {
    let partData = [];
    for (let i = 0 + 1; i <= length; i++) {
        console.log("processing: " + i + " of " + length + " on Rebaltic");
        const page = await browser.newPage();
        try {
            await page.goto(`${url}${pay}/?page=${i}&sort=date_desc&types=${type}`, { waitUntil: 'load', timeout: 0 });
            await page.waitForSelector('body > div.wrapper.page-wrapper > div > div.content.page-content > div > div > div.catalog-pager > a:nth-child(5)')
            .then( async () =>{
                const html = await page.content();
                const dom = new JSDOM(html);
                let details = dom.window.document.querySelectorAll("body > div.wrapper.page-wrapper > div > div.content.page-content > div > div > div.catalog-grid.catalog-grid > div");
                for (let j = 0; j < details.length; j++) {
                    const img = details[j].querySelector('img');
                    let link = details[j].querySelector('a').getAttribute('href');
                    let title = details[j].querySelector('div').querySelector('a');
                    const pElements = details[j].querySelector('div').querySelectorAll('p');
                    let price = details[j].querySelector('span');
                    title = title.textContent.replace(/(\r\n|\n|\r|\t)/gm, "");
                    const match = price?.textContent.split("€")[0].replace(/\s/g, "");
                    const number = parseFloat(match);
                    const addr = pElements[0]?.textContent;
                    const res = await geocoder.geocode(addr);
                    const area = pElements[1]?.textContent?.split('m²')[0].replace(/\s/g, "");
                    const rooms = pElements[1]?.textContent?.split(',').pop().split('rooms')[0].replace(/\s/g, "");
                    const obj = {
                        type:typeIndex,
                        adressline:addr,
                        title:title,
                        img:img ? img.getAttribute('src') : '',
                        area:area? area : "1",
                        rooms:rooms ? rooms : "1",
                        priceEUR:number,
                        x:res?.[0].latitude,
                        y:res?.[0].longitude,
                        url:"https://www.rebaltic.lt/" + link,
                    };
                    partData.push(obj);
                }
            });
        } catch (err) {
            // console.log(err);
        }finally{
            await page.close();
        }
    }
    return partData;
};

module.exports = { getDataRebaltic };
