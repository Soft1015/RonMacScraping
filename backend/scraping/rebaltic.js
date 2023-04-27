const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require('../db')

const UrlList = [
    {
        pay:'for-sale',
        type:'apt',
        typeIndex:'0'
    },
    // {
    //     pay:'for-sale',
    //     type:'hscot',
    //     typeIndex:'1'
    // },
    // {
    //     pay:'for-rent',
    //     type:'apt',
    //     typeIndex:'2'
    // },
    // {
    //     pay:'for-rent',
    //     type:'hscot',
    //     typeIndex:'3'
    // }
];

const getDataRebaltic = async () => {

    let scrapeData = [];
    for(var i = 0; i < UrlList.length; i ++){

        let response = null;
        try {
            response = await fetch(`https://www.rebaltic.lt/en/catalog/${UrlList[i].pay}/?page=1&sort=date_desc&types=${UrlList[i].type}`);
        } catch (err) {
            console.log(err);
        }
        const result = await response.text();
        const dom = new JSDOM(result);
        const length = dom.window.document.querySelector('body > div.wrapper.page-wrapper > div > div.content.page-content > div > div > div.catalog-filter.center > div.catalog-filter-control.catalog-filter-control--sort > p > span');
        console.log(result);

    }
    // if(scrapeData){
    //     insertMultiItems(scrapeData);
    // }
};

module.exports = { getDataRebaltic };
