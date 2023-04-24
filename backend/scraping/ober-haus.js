const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require('../db')

const UrlList = [
    {
        url: 'https://www.ober-haus.lt/en/apartments-for-sale/?f_ad_type=Apartment&f_investment_type&f_object_purpose&f_plot_purpose&f_deal_type=Sale&f_keyword&f_city&f_districts&f_streets&f_price_min&f_price_max&f_rooms_min&f_rooms_max&f_area_min&f_area_max&f_plot_area_min&f_plot_area_max&f_floors_min&f_floors_max&f_floor_type&f_build_year_from&f_build_year_to&f_material&f_heating_type&f_condition&f_object_nr&map=true',
        type:'0'
    },
    {
        url: 'https://www.ober-haus.lt/en/houses-for-sale/?f_ad_type=House&f_investment_type&f_object_purpose&f_plot_purpose&f_deal_type=Sale&f_keyword&f_city&f_districts&f_streets&f_price_min&f_price_max&f_rooms_min&f_rooms_max&f_area_min&f_area_max&f_plot_area_min&f_plot_area_max&f_floors_min&f_floors_max&f_floor_type&f_build_year_from&f_build_year_to&f_material&f_heating_type&f_condition&f_object_nr&map=true',
        type:'1'
    },
    {
        url: 'https://www.ober-haus.lt/en/apartments-for-rent/?f_ad_type=Apartment&f_investment_type&f_object_purpose&f_plot_purpose&f_deal_type=Rental&f_keyword&f_city&f_districts&f_streets&f_price_min&f_price_max&f_rooms_min&f_rooms_max&f_area_min&f_area_max&f_plot_area_min&f_plot_area_max&f_floors_min&f_floors_max&f_floor_type&f_build_year_from&f_build_year_to&f_material&f_heating_type&f_condition&f_object_nr&map=true',
        type:'2'
    },
    {
        url: 'https://www.ober-haus.lt/en/houses-for-rent/?f_ad_type=House&f_investment_type&f_object_purpose&f_plot_purpose&f_deal_type=Rental&f_keyword&f_city&f_districts&f_streets&f_price_min&f_price_max&f_rooms_min&f_rooms_max&f_area_min&f_area_max&f_plot_area_min&f_plot_area_max&f_floors_min&f_floors_max&f_floor_type&f_build_year_from&f_build_year_to&f_material&f_heating_type&f_condition&f_object_nr&map=true',
        type:'3'
    }
];

const getData = async () => {
    let scrapeData = [];
    for(var i = 0; i < UrlList.length; i ++){

        let response = null;
        try {
            response = await fetch(UrlList[i]?.url, {method: "get"});
        } catch (err) {
            console.log(err);
        }
        const result = await response.text();
        const dom = new JSDOM(result);
        let scriptElements = dom.window.document.querySelectorAll("script");
        scriptElements.forEach((item) => {
            let myVariable = null;
            const scriptCode = item?.textContent;
            try {
                myVariable = eval(scriptCode + "; objects_array");
            } catch (e) {
                if (e instanceof SyntaxError) {
                    console.log(e.message);
                }
            }
            if(myVariable?.length > 0){
                myVariable.forEach((item) => {
                    const area = item.area.split(' ')[0];
                    item.area = area;
                    item.type = UrlList[i]?.type;
                    scrapeData.push(item);
                });
            }
        });
    }

    if(scrapeData){
        insertMultiItems(scrapeData);
    }

};

module.exports = { getData };
