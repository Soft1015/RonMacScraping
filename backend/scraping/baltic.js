const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require('../db')

const UrlList = [
    {
        url: 'https://lt.balticsothebysrealty.com/en/find-a-property/?action=sale&id=&stype=map&county%5B0%5D=&parish%5B0%5D=&city%5B0%5D=&street%5B0%5D=&broker=&type%5B0%5D=apartment&distinctive=&international=&new_development=&price_min=0&price_max=12000000&area_min=0&area_max=3656#sort-block',
        type:'0'
    },
    {
        url: 'https://lt.balticsothebysrealty.com/en/find-a-property/?action=sale&id=&stype=map&parish%5B0%5D=&city%5B0%5D=&street%5B0%5D=&broker=&type%5B0%5D=house&distinctive=&international=&new_development=&price_min=0&price_max=12000000&area_min=0&area_max=3656#sort-block',
        type:'1'
    },
    {
        url: 'https://lt.balticsothebysrealty.com/en/find-a-property/?action=rent&id=&stype=map&county%5B0%5D=&parish%5B0%5D=&city%5B0%5D=&street%5B0%5D=&broker=&type%5B0%5D=apartment&distinctive=&international=&new_development=&price_min=0&price_max=12000000&area_min=0&area_max=3656#sort-block',
        type:'2'
    },
    {
        url: 'https://lt.balticsothebysrealty.com/en/find-a-property/?action=rent&id=&stype=map&parish%5B0%5D=&city%5B0%5D=&street%5B0%5D=&broker=&type%5B0%5D=house&distinctive=&international=&new_development=&price_min=0&price_max=12000000&area_min=0&area_max=3656#sort-block',
        type:'3'
    }
];

const getDataBaltic = async () => {

    let scrapeData = [];
    for(var i = 0; i < UrlList.length; i ++){

        let response = null;
        try {
            response = await fetch(UrlList[i]?.url, {method: "get"});
        } catch (err) {
            // console.log(err);
        }
        const result = await response.text();
        const dom = new JSDOM(result);
        let scriptElements = dom.window.document.querySelectorAll("script");
        scriptElements.forEach((item) => {
            let myVariable = null;
            const scriptCode = item?.textContent;
            try {
                myVariable = eval(scriptCode + "; locations");
            } catch (e) {
                if (e instanceof SyntaxError) {
                    // console.log(e.message);
                }
            }
            if(myVariable?.length > 0){
                myVariable.forEach((item) => {
                    let obj = {};
                    const area = item.d.split(' ');
                    let price = item.price.split('€')[0];
                    price = price.replace(/\s/g, '');
                    let rooms = 1;
                    for(let j = 0; j < area.length; j ++){
                        if(area[j].includes('bedroom')){
                            rooms = area[j].split('bedroom')[0];
                        }
                    }
                    obj.type = UrlList[i]?.type;
                    obj.priceEUR = price;
                    obj.adressline = item.a;
                    obj.x = item.x;
                    obj.y = item.y;
                    obj.title = item.t;
                    obj.img = item.i;
                    obj.area = area[0];
                    obj.rooms = rooms;
                    scrapeData.push(obj);
                });
            }
        });
    }
    if(scrapeData){
        insertMultiItems(scrapeData);
    }
};

module.exports = { getDataBaltic };
