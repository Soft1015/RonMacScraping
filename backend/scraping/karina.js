const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require('../db')
const NodeGeocoder = require('node-geocoder');
const FormData = require('form-data');
const fs = require('fs');
const options = {
    provider: 'google',
  
    apiKey: 'AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
const geocoder = NodeGeocoder(options);

const getDataKarina = async () => {

    let scrapeData = [];
    let response = null;
    try {
        response = await fetch("https://karinapaulauskaite.lt/pirkti/");
    } catch (err) {
        console.log(err);
    }
    const result = await response.text();
    const dom = new JSDOM(result);
    let details = dom.window.document.querySelectorAll("#module_properties > div");
    for(let i = 0; i < details.length; i ++){
        scrapeData.push( await getDetailOfRoom(details[i]) );
    }
    let pages = 2;
    while(1){
        const form = new FormData();
        form.append('action', 'houzez_loadmore_properties');
        form.append('prop_limit', '9');
        form.append('paged', pages);
        form.append('card_version', 'item-v1');
        form.append('status', 'parduodama');
        let resp = await fetch("https://karinapaulauskaite.lt/wp-admin/admin-ajax.php", {
            method: 'POST',
            body: form
        });
        resp = await resp.text();
        if(resp == "no_result"){
            break;
        }else{
            const domAddition = new JSDOM(resp);
            let additionals = domAddition.window.document.querySelectorAll("div.card");
            for(let j = 0; j < additionals.length; j ++){
                scrapeData.push( await getDetailOfRoom(additionals[j]) );
            }
        }
        pages ++;
    }
    if(scrapeData){
        insertMultiItems(scrapeData);
        console.log('done on Karina!!!!!');
    }
};

const getDetailOfRoom = async(dom) => {
    let img, price, title, addr, bed, area;
    img = dom.querySelector('img').getAttribute('src');
    price = dom.querySelector('ul.item-price-wrap > li').textContent.split("€")[0].replace(/\s/g, "");
    title = dom.querySelector('h2.item-title > a');
    addr = dom.querySelector('address').textContent;
    bed = dom.querySelector('li.h-beds > span.hz-figure');
    area = dom.querySelector('li.h-area > span.hz-figure');
    const res = await geocoder.geocode(addr);
    if(res){
        const obj = {
            type:'0',
            adressline:addr,
            title:title ? title.textContent : '',
            img:img,
            area:area? area.textContent.replace("m2", "") : "1",
            rooms:bed ? bed?.textContent : "1",
            priceEUR:parseFloat(price),
            x:res?.[0].latitude,
            y:res?.[0].longitude
        };
        return obj;
    }
    return {};
}

module.exports = { getDataKarina };