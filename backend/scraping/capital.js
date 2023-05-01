const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require('../db')

const UrlList = [
    {
        url: 'https://www.maps.capital.lt/api.php?get_all_estates&type=flat&sr_type=for_sale&sale_type=&municipality=&price_from=&price_to=&area_from=&area_to=&years_from=&years_to=&floor_from=undefined&floor_to=&floor_count_from=&floor_count_to=&room_count_from=&room_count_to=&site_area_from=&site_area_to=&cities=&blocks=&streets=&sort_by=date&sort_to=desc',
        type:'0',
        key:'flat'
    },
    {
        url: 'https://www.maps.capital.lt/api.php?get_all_estates&type=house&sr_type=for_sale&sale_type=&municipality=&price_from=&price_to=&area_from=&area_to=&years_from=&years_to=&floor_from=undefined&floor_to=&floor_count_from=&floor_count_to=&room_count_from=&room_count_to=&site_area_from=&site_area_to=&cities=&blocks=&streets=&sort_by=date&sort_to=desc',
        type:'1',
        key:'house'
    },
    {
        url: 'https://www.maps.capital.lt/api.php?get_all_estates&type=flat&sr_type=for_rent&sale_type=&municipality=&price_from=&price_to=&area_from=&area_to=&years_from=&years_to=&floor_from=undefined&floor_to=&floor_count_from=&floor_count_to=&room_count_from=&room_count_to=&site_area_from=&site_area_to=&cities=&blocks=&streets=&sort_by=date&sort_to=desc',
        type:'2',
        key:'flat'
    },
    {
        url: 'https://www.maps.capital.lt/api.php?get_all_estates&type=house&sr_type=for_rent&sale_type=&municipality=&price_from=&price_to=&area_from=&area_to=&years_from=&years_to=&floor_from=undefined&floor_to=&floor_count_from=&floor_count_to=&room_count_from=&room_count_to=&site_area_from=&site_area_to=&cities=&blocks=&streets=&sort_by=date&sort_to=desc',
        type:'3',
        key:'house'
    }
];

const getDataCapital = async () => {

    let scrapeData = [];
    console.log('process Capital');
    for(var i = 0; i < UrlList.length; i ++){
 
        let response = null;
        try {
            response = await fetch(UrlList[i]?.url, {method: "get"});
        } catch (err) {
            // console.log(err);    
        }
        const result = await response.json();
        var allPromises = [];
        for (let j = 0; j < result.length; j++) {
            console.log('processing: ' + j + ' of ' + result.length + ' on Capital');
            var res = fetch(`https://www.maps.capital.lt/api.php?get_object&type=left_ad&sr_type=${UrlList[i].key}&id=${result[j].id}`)
              .then((response) => response.text())
              .then(async (textString) => {
                const dom = new JSDOM(textString);
                let urlRegex = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/;
                let photo = dom.window.document.querySelector('a');
                if(photo !== ""){
                    const src = photo.style.backgroundImage.match(urlRegex)[1];
                    const addr = dom.window.document.querySelector('.ad_adr').textContent;
                    const price = dom.window.document.querySelector('strong').textContent.split('€')[0];
                    let resofMain = await fetch(photo.getAttribute('href'));
                    let txtHtml  = await resofMain.text();
                    const final = new JSDOM(txtHtml);
                    const area = final.window.document.querySelector('body > div.container-fluid.page-content > div.container.realty-single-container > div.realty-information-container.col-md-6 > table > tbody > tr.realty-main-info-top > td:nth-child(1)');
                    const rooms = final.window.document.querySelector('body > div.container-fluid.page-content > div.container.realty-single-container > div.realty-information-container.col-md-6 > table > tbody > tr.realty-main-info-top > td:nth-child(3)');
                    const obj = {
                        type:UrlList[i].type,
                        priceEUR:price,
                        adressline:addr,
                        x:result[j].lat,
                        y:result[j].long,
                        title:addr,
                        img:src,
                        area:area.textContent.split(' ')[0],
                        rooms:rooms.textContent,
                    }
                    // console.log(obj);
                    scrapeData.push(obj);
                }
              })
              .catch((error) => {
                //   console.error(error);
              });
              allPromises.push(res);
        }
        await Promise.all(allPromises);
    }
    if(scrapeData){
        insertMultiItems(scrapeData);
    }
};

module.exports = { getDataCapital };
