const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require("../db");
const fs = require("fs");
const unitLen = 6;
const UrlList = [
  {
    url: "https://www.remax.lt/zemelapis?order=&search=1&type=apartment-sell&region=0&quartal=&district=&street=&rooms_from=&rooms_to=&area_from=&area_to=&price_from=&price_to=&detailed=1&floor_from=&floor_to=&year_from=&year_to=&price_area_from=&price_area_to=&page=",
    type: "0",
  },
  {
    url: 'https://www.remax.lt/zemelapis?order=&search=1&type=house-sell&region=0&quartal=&district=&street=&rooms_from=&rooms_to=&area_from=&area_to=&price_from=&price_to=&detailed=1&floor_from=&floor_to=&year_from=&year_to=&price_area_from=&price_area_to=&page=',
    type: '1'
  },
  {
    url: 'https://www.remax.lt/zemelapis?order=&search=1&type=apartment-rent&region=0&quartal=&district=&street=&rooms_from=&rooms_to=&area_from=&area_to=&price_from=&price_to=&detailed=1&floor_from=&floor_to=&year_from=&year_to=&price_area_from=&price_area_to=&page=',
    type: '2'
  },
  // {
  //   url: 'https://www.remax.lt/zemelapis?order=&search=1&type=house-rent&region=0&quartal=&district=&street=&rooms_from=&rooms_to=&area_from=&area_to=&price_from=&price_to=&detailed=1&floor_from=&floor_to=&year_from=&year_to=&price_area_from=&price_area_to=&page=',
  //   type: '3'
  // }
];

const getRemaxData = async () => {
  let scrapeData = [];
  for (var i = 0; i < UrlList.length; i++) {
    let response = null;
    try {
      response = await fetch(UrlList[i]?.url + "1");

      const result = await response.text();
      const dom = new JSDOM(result);
      let length = dom.window.document.querySelector(
        "body > div.site > div.site-center.bg-grey > section.map-section > div.map-section__list > div:nth-child(2) > div > div.map-list__title > strong"
      );
      let val = await getDetailOfRoom(length.textContent, UrlList[i].url, UrlList[i].type);
      scrapeData = scrapeData.concat(val);
    } catch (err) {
      console.log(err);
    }
  }

  if (scrapeData.length > 0) {
    insertMultiItems(scrapeData);
    console.log('completed on Remax!!!!!!!!!');
  }
};

const getDetailOfRoom = async (length, url, type) => {
  let partData = [];
  for (let i = 0; i < length / unitLen; i++) {
    console.log("processing: " + (i + 1) + " of " + Math.ceil(length / unitLen) + " on Remax");
    let response = null;
    try {
      response = await fetch(url + (i + 1));
    } catch (err) {
      console.log(err);
    }
    try {
      const result = await response.text();
      const dom = new JSDOM(result);
      let map = dom.window.document.querySelector(".map-frame");
      const pos = JSON.parse(map.getAttribute("data-clusters"));
      const items = dom.window.document.querySelectorAll(
        "body > div.site > div.site-center.bg-grey > section.map-section > div.map-section__list > div:nth-child(2) > div > div.map-section__list-inner > div a"
      );
      /**
       * Get position
       */
      let posDetail = [];
      for (let j = 0; j < pos.length; j++) {
        if (Array.isArray(pos[j])) {
          pos[j].map((item) => {
            item.price = parseFloat(item.price);
            posDetail.push(item);
          });
        } else {
          pos[j].price = parseFloat(pos[j].price);
          posDetail.push(pos[j]);
        }
      }
      //filter data
      let newItem = [];
      for (let j = 0; j < posDetail.length; j++) {
        const obj = {};
        let urlRegex = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/;
        const addrRegex = /^\s*(.*?)\s*$/;
        let src = items[j].querySelector("div:nth-child(1)").style.backgroundImage.match(urlRegex);
        if (Array.isArray(src)) {
          src = src[1];
        } else {
          src = "";
        }
        let lis = items[j].querySelectorAll("ul > li");
        let area = "",
          rooms = "1";
        switch (lis.length) {
          case 2:
            area = items[j].querySelector("ul > li:nth-child(2)");
            break;
          case 3:
            area = items[j].querySelector("ul > li:nth-child(2)");
            if (!area.textContent.includes("m²")) {
              area = items[j].querySelector("ul > li:nth-child(3)");
            }
            rooms = items[j].querySelector("ul > li:nth-child(1)").textContent;
            break;
          case 4:
            area = items[j].querySelector("ul > li:nth-child(3)");
            rooms = items[j].querySelector("ul > li:nth-child(1)").textContent;
            break;
        }
        let addr = items[j].querySelector("div:nth-child(2) > div:nth-child(2)").textContent.replace(/(\r\n|\n|\r|\t)/gm, "");
        let price = items[j].querySelector("div:nth-child(2) > div:nth-child(3)").textContent;
        const match = price.split("€")[0].replace(/\s/g, "");
        const number = parseFloat(match);
        if (area) {
          area = area.textContent.replace(/\s/g, "");
          area = area.split("m²")[0];
        }
        addr = addr.match(addrRegex)[1];
        if (rooms.includes('m')) rooms = "1";
        //insert detail to obj
        obj.type = type;
        obj.adressline = addr.replace(/\s+/g, " ");
        obj.title = "";
        obj.img = src;
        obj.area = area;
        obj.rooms = rooms;
        obj.priceEUR = number;
        obj.url = "https://www.remax.lt" + items[j].getAttribute('href');
        newItem.push(obj);
      }
      //filter data
      posDetail.sort(function (a, b) {
        return a.price - b.price;
      });
      newItem.sort(function (a, b) {
        return a.priceEUR - b.priceEUR;
      });
      for (let j = 0; j < posDetail.length; j++) {
        newItem[j].x = posDetail[j].lat;
        newItem[j].y = posDetail[j].lon;
      }
      partData = partData.concat(newItem);
    } catch (error) {
      //   console.log(error);
    }
  }
  return partData;
};

module.exports = { getRemaxData };
