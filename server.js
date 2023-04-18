import fetch from "node-fetch";
import fs from "fs";
import { JSDOM } from "jsdom";
import ObjectsToCsv from "objects-to-csv";
const num = 41;

const TESTMODE = 1;
const url = "https://www.compass.com/homes-for-sale/queens-ny/";
const fileName = "sell.csv";
async function getData(data) {
  let array = [];
  for (let variable of data) {
    const {
      listing: {
        location,
        price,
        size,
        localizedStatus: status,
        buildingInfo,
        date,
        detailedInfo, 
      },
    } = variable;
    let response = null;
    try {
      response = await fetch(
        "https://www.compass.com" + variable.listing.pageLink,
        {
          method: "get",
        }
      );
    } catch (err) {
      // console.log(err);
      continue;
    }

    const result = await response.text();
    const dom = new JSDOM(result);
    const address = location?.prettyAddress + " " + location?.neighborhood + " " + location?.city + " " + location?.state + " " + location?.zipCode;
    const link = "https://www.compass.com" + variable.listing.pageLink;
    const type = detailedInfo?.propertyType?.masterType?.GLOBAL[0]
      ? detailedInfo?.propertyType?.masterType?.GLOBAL[0]
      : "";
    const priceApart = price?.formatted;
    const pricePerSquare =
      price?.perSquareFoot != undefined ? price?.perSquareFoot : "_";
    const minDown = price?.hasOwnProperty("maxFinancingPercentage")
      ? 100 - price?.maxFinancingPercentage + "%"
      : "-";
    const maintainence = price?.monthlySalesCharges;
    const tax =
      price?.monthlySalesChargesInclTaxes - price?.monthlySalesCharges == 0
        ? "-"
        : price?.monthlySalesChargesInclTaxes - price?.monthlySalesCharges;
    const buildingName = buildingInfo?.buildingName
      ? buildingInfo?.buildingName
      : buildingInfo?.buildingAddress;
    const Street =
      location?.streetNumber +
      " " +
      location?.street +
      "" +
      location?.streetType;
    const city = location?.neighborhood + " " + location?.city;
    const zipcode = location?.zipCode;
    const apartmentNumber = location?.unitNumber;
    const state = location?.state;
    const daysOnMarket = date?.daysOnMarket;
    const secs = date?.listed;
    const dateOnMarket = new Date(secs).toDateString();
    const bedroom = size?.bedrooms;
    const bathroom = size?.bathrooms;
    const squareFoot = size?.squareFeet != undefined ? size?.squareFeet : "_";
    const builtYear = buildingInfo?.buildingYearOpened;
    let scriptElement = dom.window.document.querySelector(
      'script[type="application/ld+json"]'
    );
    try {
      console.log(link);
      scriptElement = JSON.parse(scriptElement.innerHTML);
    } catch (e) {
      // console.log(e);
      continue;
      // expected output: SyntaxError: Unexpected token o in JSON at position 1
    }
    const agentName = scriptElement[0]?.offers?.offeredBy?.name
      ? scriptElement[0]?.offers?.offeredBy?.name
      : "";
    const listenBroker = dom.window.document.querySelector(
      "#listingTeam > ol > li > div > div.contact-agent-slat__StyledContainer-l633vc-8.eZzlJj > div > div.contact-agent-slat__StyledAgentInfoContainer-l633vc-5.hjRmpB > p:nth-child(3)"
    );
    const description = dom.window.document.querySelector(
      "#overview > main > div.app__StyledLeftColumn-sc-1qqu9tk-15.ceTEzJ > div.description__StyledSectionWrapper-sc-1v5jw5i-2.iVtVVr.app__StyledDescription-sc-1qqu9tk-18.loNdHO.section-padding > div > div > div > span.sc-uhnfH.dSuQhr"
    );
    const images = dom.window.document.querySelectorAll(
      "#media-gallery > div.src__NavigationWrapper-sc-bdjcm0-0.fPTUTj > div > div > div > div.navigation-carousel__NavigationImages-sc-xr20hr-4.jsUsSj img"
    );
    const phone = scriptElement[0]?.offers?.offeredBy?.telephone
      ? scriptElement[0]?.offers?.offeredBy?.telephone
      : "";
    const email = scriptElement[0]?.offers?.offeredBy?.email
      ? scriptElement[0]?.offers?.offeredBy?.email
      : "";
    const newData = {
      Link: link,
      "MLS ID": "",
      "Apartment Status": status,
      "Building Name": buildingName,
      Address: address,
      Street: Street,
      City: city,
      Zipcode: zipcode,
      "Apartment Number": apartmentNumber,
      "Built Year": builtYear,
      State: state,
      "Asking Price": priceApart,
      "Days on Market": daysOnMarket,
      "Date on Market": dateOnMarket,
      Bedroom: bedroom,
      Bathroom: bathroom,
      "Square Footage": squareFoot + "Sq.Ft",
      "Price Per Sqaure Foot": pricePerSquare,
      "Minimum Downpayment": minDown,
      Maintainence: maintainence,
      Taxes: tax,
      "Apartment Type": type,
      "Listing Agent Name": agentName,
      "Listing Brokerage": listenBroker ? listenBroker.textContent : "",
      Phone: phone,
      email: email,
      description: description ? description.textContent : "",
    };
    images.forEach((item, index) => {
      newData["image_" + index] = item.getAttribute("data-src");
    });
    array.push(newData);
  }
  if (TESTMODE)
    new ObjectsToCsv(array).toDisk(`./${fileName}`, { append: true });
  console.log("success!");
  return array;
}

async function main() {
  checkFile();
  const body = {
    height: 354,
    purpose: "search",
    rawLolSearchQuery: {
      facetFieldNames: [
        "contributingDatasetList",
        "compassListingTypes",
        "comingSoon",
      ],
      listingTypes: [2],
      locationIds: [21426],
      num: num,
      saleStatuses: [12, 9],
      sortOrder: 115,
    },
    searchResultId: "b22897e3-0502-4daa-a7f2-24d11545d4dc",
    viewport: {
      northeast: {
        lat: 40.8584177,
        lng: -73.0334324,
      },
      southwest: {
        lat: 40.4897126,
        lng: -74.6291966,
      },
    },
    viewportFrom: "map",
    width: 1162,
  };

  const response = await fetch(url, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  let allData = [];
  let returnData = await getData(data["lolResults"]["data"]);
  allData = [...allData, ...returnData];
  var totalItems = data["lolResults"]["totalItems"];
  if (totalItems > num) {
    var currNum = 0;
    console.log(totalItems / num);
    for (var i = 0; i < totalItems / num - 1; i++) {
      currNum += num;
      let response = null;
      try {
        response = await fetch(`${url}start=${currNum}`, {
          method: "post",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        let returnData = await getData(data["lolResults"]["data"]);
        allData = [...allData, ...returnData];
      } catch (err) {
        response = await fetch(`${url}start=${currNum}`, {
          method: "post",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        let returnData = await getData(data["lolResults"]["data"]);
        allData = [...allData, ...returnData];
      }
    }
  }
  if (!TESTMODE)
    new ObjectsToCsv(allData).toDisk(`./${fileName}`, { append: true });
  console.log("end!");
}

function checkFile() {
  if (fs.existsSync(`./${fileName}`)) {
    fs.unlinkSync(`./${fileName}`);
  }
}

main();
