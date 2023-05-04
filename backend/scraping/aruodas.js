const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { insertMultiItems } = require('../db')
const { gotScraping } = require("got-scraping");
const fs = require("fs");

const NodeGeocoder = require('node-geocoder');

const UrlList = [
    {
        url: 'https://m.en.aruodas.lt/butu-nuoma/puslapis/',
        type: '2',
        go2Page:false,
    },
    {
        url: 'https://m.en.aruodas.lt/namu-nuoma/puslapis/',
        type: '3',
        go2Page:true,
    },
    {
        url: 'https://m.en.aruodas.lt/butai/puslapis/',
        type: '0',
        go2Page:false,
    },
    {
        url: 'https://m.en.aruodas.lt/namai/puslapis/',
        type: '1',
        go2Page:true,
    },
];

const options = {
    provider: 'google',

    apiKey: 'AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

const header = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": "application=1; saved_search=d9cbb0fdadd1dc8f9cebe4c4e8f9eeb5; OTAdditionalConsentString=1~39.43.46.55.61.70.83.89.93.108.117.122.124.135.136.143.144.147.149.159.162.167.171.192.196.202.211.218.228.230.239.241.259.266.286.291.311.317.322.323.327.338.367.371.385.389.394.397.407.413.415.424.430.436.445.449.453.482.486.491.494.495.501.503.505.522.523.540.550.559.560.568.574.576.584.587.591.737.745.787.802.803.817.820.821.839.864.867.874.899.904.922.931.938.979.981.985.1003.1024.1027.1031.1033.1040.1046.1051.1053.1067.1085.1092.1095.1097.1099.1107.1127.1135.1143.1149.1152.1162.1166.1186.1188.1201.1205.1211.1215.1226.1227.1230.1252.1268.1270.1276.1284.1286.1290.1301.1307.1312.1345.1356.1364.1365.1375.1403.1415.1416.1419.1440.1442.1449.1455.1456.1465.1495.1512.1516.1525.1540.1548.1555.1558.1564.1570.1577.1579.1583.1584.1591.1603.1616.1638.1651.1653.1665.1667.1677.1678.1682.1697.1699.1703.1712.1716.1721.1725.1732.1745.1750.1765.1769.1782.1786.1800.1810.1825.1827.1832.1838.1840.1842.1843.1845.1859.1866.1870.1878.1880.1889.1899.1917.1929.1942.1944.1962.1963.1964.1967.1968.1969.1978.2003.2007.2008.2027.2035.2039.2044.2047.2052.2056.2064.2068.2070.2072.2074.2088.2090.2103.2107.2109.2115.2124.2130.2133.2135.2137.2140.2145.2147.2150.2156.2166.2177.2183.2186.2202.2205.2216.2219.2220.2222.2225.2234.2253.2264.2279.2282.2292.2299.2305.2309.2312.2316.2322.2325.2328.2331.2334.2335.2336.2337.2343.2354.2357.2358.2359.2370.2376.2377.2387.2392.2394.2400.2403.2405.2407.2411.2414.2416.2418.2425.2440.2447.2461.2462.2465.2468.2472.2477.2481.2484.2486.2488.2493.2497.2498.2499.2501.2510.2511.2517.2526.2527.2532.2534.2535.2542.2552.2563.2564.2567.2568.2569.2571.2572.2575.2577.2583.2584.2596.2601.2604.2605.2608.2609.2610.2612.2614.2621.2628.2629.2633.2634.2636.2642.2643.2645.2646.2647.2650.2651.2652.2656.2657.2658.2660.2661.2669.2670.2677.2681.2684.2686.2687.2690.2695.2698.2707.2713.2714.2729.2739.2767.2768.2770.2772.2784.2787.2791.2792.2798.2801.2805.2812.2813.2816.2817.2818.2821.2822.2827.2830.2831.2834.2838.2839.2840.2844.2846.2847.2849.2850.2852.2854.2856.2860.2862.2863.2865.2867.2869.2873.2874.2875.2876.2878.2880.2881.2882.2883.2884.2886.2887.2888.2889.2891.2893.2894.2895.2897.2898.2900.2901.2908.2909.2911.2912.2913.2914.2916.2917.2918.2919.2920.2922.2923.2924.2927.2929.2930.2931.2939.2940.2941.2947.2949.2950.2956.2958.2961.2963.2964.2965.2966.2968.2970.2973.2974.2975.2979.2980.2981.2983.2985.2986.2987.2991.2994.2995.2997.2999.3000.3002.3003.3005.3008.3009.3010.3012.3016.3017.3018.3019.3024.3025.3028.3034.3037.3038.3043.3045.3048.3052.3053.3055.3058.3059.3063.3065.3066.3068.3070.3072.3073.3074.3075.3076.3077.3078.3089.3090.3093.3094.3095.3097.3099.3104.3106.3109.3112.3117.3118.3119.3120.3124.3126.3127.3128.3130.3135.3136.3145.3149.3150.3151.3154.3155.3162.3163.3167.3172.3173.3180.3182.3183.3184.3185.3187.3188.3189.3190.3194.3196.3197.3209.3210.3211.3214.3215.3217.3219.3222.3223.3225.3226.3227.3228.3230.3231.3232.3234.3235.3236.3237.3238.3240.3244.3245.3250.3251.3253.3257.3260.3268.3270.3272.3281.3288.3290.3292.3293.3295.3296.3300.3306.3307.3308.3314.3315.3316.3318.3324.3327.3328.3330.3531.3831.3931; _ga_2XD8PMX8TR=deleted; _ga_2XD8PMX8TR=deleted; _pubcid=4040afdd-b73b-4863-907a-fef886e2b9ef; _cc_id=1d1222b36696dc0b477292433eac01b; _au_1d=AU1D-0100-001681802058-HZ8PXFW1-VETN; _au_last_seen_iab_tcf=1681802060489; __gads=ID=80d9a035cde447b4:T=1681802050:S=ALNI_MZg-hzQYEC1dz9pqsQm-LJCRLfwJQ; _au_last_seen_pixels=eyJhcG4iOjE2ODE4NDQzMTYsInR0ZCI6MTY4MTg0NDMxNiwicHViIjoxNjgxODQ0MzE2LCJydWIiOjE2ODE4NDQzMTYsInRhcGFkIjoxNjgxODQ0MzE2LCJhZHgiOjE2ODE4NDQzMTYsImdvbyI6MTY4MTg0NDMxNiwiYWRvIjoxNjgxODQ0MzE5LCJtZWRpYW1hdGgiOjE2ODE4NDQzMTksInNvbiI6MTY4MTg0NDMxOSwiaW1wciI6MTY4MTg0NDMxOSwiYmVlcyI6MTY4MTg0NDMxNiwicHBudCI6MTY4MTg0NDMxOSwib3BlbngiOjE2ODE4NDQzMTksInNtYXJ0IjoxNjgxODQ0MzE5LCJ1bnJ1bHkiOjE2ODE4NDQzMTYsInRhYm9vbGEiOjE2ODE4NDQzMTl9; __gpi=UID=00000bd7f6f7013e:T=1681802050:RT=1681844314:S=ALNI_MbPXUMZUv81BOr-gPVk3sjFi5ebiA; cto_bundle=Vvyre185aWs3M3pQQXAlMkJ3WTRwQnRDQUxXUFVWS284Zm1EQmxPQXRNcTVWeHZDVGUwaGszajBoeHNhZFB2cXFkVWY3bnQzRUh1dHJoNlhCcU1nWGtWalZQelglMkJGSWY5T3glMkJ1czJRTSUyQkM3UXZuSnVCSVRJeXAxTkl2N1RTQVpaTzB6UEd3QlZPcDNDNDBaViUyQmNPSk52dW9NczBRJTNEJTNE; cto_bundle=Vvyre185aWs3M3pQQXAlMkJ3WTRwQnRDQUxXUFVWS284Zm1EQmxPQXRNcTVWeHZDVGUwaGszajBoeHNhZFB2cXFkVWY3bnQzRUh1dHJoNlhCcU1nWGtWalZQelglMkJGSWY5T3glMkJ1czJRTSUyQkM3UXZuSnVCSVRJeXAxTkl2N1RTQVpaTzB6UEd3QlZPcDNDNDBaViUyQmNPSk52dW9NczBRJTNEJTNE; cto_bundle=Vvyre185aWs3M3pQQXAlMkJ3WTRwQnRDQUxXUFVWS284Zm1EQmxPQXRNcTVWeHZDVGUwaGszajBoeHNhZFB2cXFkVWY3bnQzRUh1dHJoNlhCcU1nWGtWalZQelglMkJGSWY5T3glMkJ1czJRTSUyQkM3UXZuSnVCSVRJeXAxTkl2N1RTQVpaTzB6UEd3QlZPcDNDNDBaViUyQmNPSk52dW9NczBRJTNEJTNE; _pbjs_userid_consent_data=7796755180336078; cto_bidid=I8z0cl9HRlAyTyUyQk9NNXFFMmJQQUFPYnhmJTJGZUxUN3FZZVhLdnJERzJjYjZsT285cDBGJTJGcVRzbWpnZ3NZV282S1Via2gwZ0xHdUR1NSUyQmdVTVNtdngxYXlTdXpEdHFIZ1NqMjdWYnpVUzhKNmI1UVZVJTNE; cto_bundle=hdXLY185aWs3M3pQQXAlMkJ3WTRwQnRDQUxXUFFKTDVOJTJGM013dkNWOWNBQmpTSktkWUclMkYlMkYzOW5XTm1JMiUyQlBNcHhIV1VYY3NKS0l4V01aVUx0NUZzYml2RGtBclV2Sk5KWDhQcUVubEJWdW5HcnVsM2hicXNBSm5oTXFiUExyQmdFNVkzaDdiU2Znall4eEc2cVhWQTNzYmdWQ21nJTNEJTNE; OptanonAlertBoxClosed=2023-04-26T18:16:23.027Z; __gfp_64b=0_DFW_NdzJHtncNc96do35PAZXE7C4AAufq.nJeGReP.s7|1681646956; _ga=GA1.1.367636208.1681646982; cf_clearance=WQt7lQx2rZ5q23TmTFdt7wmiIJ1gknaSucGX8KlDP3M-1682791351-0-160; eupubconsent-v2=CPq1lGAPq1lGAAcABBENDCCsAP_AAH_AAChQJaNf_X__b2_r-_5_f_t0eY1P9_7__-0zjhfdl-8N3f_X_L8X52M7vF36tq4KuR4ku3LBIUdlHPHcTVmw6okVryPsbk2cr7NKJ7PEmnMbO2dYGH9_n1_z-ZKY7___f_7z_v-v________7-3f3__5___-__e_V__9zfn9_____9vP___9v-_9__________3_79_7_H9-f_9BLMAkw1biALsyxwZtowigRAjCsJCqBQAUUAwtEBhA6uCnZXAT6wiQAoBQBOBECHAFGTAIAABIAkIgAkCPBAIACIBAACABUIhAAxsAgsALAQCAAUA0LFGKAIQJCDIiIiFMCAqRIKCeyoQSg_0NMIQ6ywAoNH_FQgI1kDFYEQkLByHBEgJeLJA8xRvkAIwAoBRKhWopPTQELGQAAAAA.f_gAD_gAAAAA; mobile_search_thumbs_style=small_thumbs; captcha_token=03AL8dmw900Wd-myd908aRI3TUdHv37kRO1FBvXduLCOxhkkXpwTpZDh4x7XJ9uNwqrpKQzDW7A0w85HXJ-bwlBecZymd9k085Ad4jk-UBUiqO66ezaiGCZa8dYY_1rQUqT4nN7TMD0rMJRQpq6lg4wpYGMhIUX-hlt3COqWd6kA2M9RE8SG0XwHfC5xrzMzFmYDUi8tEo_wLr9nMhHjMQdEh0Ak7BTfj7X4tEZNxmdkhz-n_owOGREz3JHF-BT_BYRPHv4IbNelRnoUi6B1qdjTC2piODzotG9W3VsaP9Kh5E-sCQARTJYYKi59KTk1d78Nlq3u2iLvuDvy76mT49xAD_fIXLmlzUIyleBPry5jjprn-S_q5ve5jYNYGlPxrb1-_TpzmU4VYGPX6OS1EULDQqfepWXUU5ciVFN3u3B40UuVhyyrrspQYGMfdnhzKA3HIERHDmtxWa7Jc-iXm0GsTCwtBGoj7AI5oXtSwtfRxmn_eBC4btAzfxN827C1BZODNjdiHRYwceYPFc_A5tgMpsiQAgGMIdPBN5IjWv4Kq8DTIUiHWlqTM; PHPSESSID=fv4r3fp78134ckni0llus5lgkd; __cf_bm=z2mEDp0PSZo5a3nU_SK2cPkF7z4awp0uy_6k2KqBC9c-1682847128-0-AfhECxidDF2Uj6sLDTmuqtQtc9g9A+uooZJEFgUZwzSzUQUmXO89QGtHzyYGNjx2ZQlYj6fGx3MVCVSnemGEZVc=; OptanonConsent=isIABGlobal=false&datestamp=Sun+Apr+30+2023+05%3A32%3A58+GMT-0400+(Chile+Standard+Time)&version=202303.2.0&hosts=&consentId=998720de-d6ed-414c-829c-4c8f9de6919b&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0002%3A1%2CC0004%3A1%2CSTACK42%3A1&geolocation=RU%3B&AwaitingReconsent=false&isGpcEnabled=0&browserGpcFlag=0; _ga_2XD8PMX8TR=GS1.1.1682845941.10.1.1682847186.0.0.0",
    "Referer": "https://m.en.aruodas.lt/",
    "Referrer-Policy": "no-referrer-when-downgrade",
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
};
const delay = ms => new Promise(res => setTimeout(res, ms));
const getDataAruodas = async () => {

    let scrapeData = [];
    for (var i = 0; i < UrlList.length; i++) {
        let response = null;
        let pageLength = 1;
        try {
            response = await gotScraping.get(UrlList[i]?.url + "1/", {http2: true, "headers": header});
            if (response.statusCode == 200) {
                const dom = new JSDOM(response.body);
                const addrRegex = /^\s*(.*?)\s*$/;
                let pageList = dom.window.document.querySelector("#divBodyContainer > div.body-content-container.min-320 > div.nav-toolbar-v2 > div.page-select-v2 > a").textContent.replace(/(\r\n|\n|\r|\t)/gm, "");
                pageList = pageList.match(addrRegex)[1];
                pageLength =  parseInt( pageList.split("from")[1].replace(/\s/g, "") );
                let val = await getDetailOfRoom(pageLength, UrlList[i].url, UrlList[i].type, UrlList[i].go2Page);
                scrapeData = scrapeData.concat(val);
            }
        } catch (err) {
            // console.log(err);
        }
        await delay(3000);
    }
    if (scrapeData.length > 0) {
        insertMultiItems(scrapeData);
        console.log('completed on Aruodas!!!!!!!!!');
    }
};

const getDetailOfRoom = async (length, url, type, go2Page) => {
    let partData = [];
    for (let i = 0 + 1; i <= length; i++) {
        console.log("processing: " + i + " of " + length + " on Aruodas");
        try {
            response = await gotScraping.get(url + `${i}/`, {http2: true, "headers": header});
            const dom = new JSDOM(response.body);
            let details = dom.window.document.querySelectorAll("#divBodyContainer > div.body-content-container.min-320 > ul.search-result-list-v2 > .result-item-v3");
            const addrRegex = /^\s*(.*?)\s*$/;
            var allPromises = [];
            for(let j = 0; j < details.length; j ++){
                let imgSrc="", addr, area, price, rooms, detail;
                let res;
                imgSrc = details[j].querySelector('img').getAttribute('src');
                addr = details[j].querySelector('span > span.item-address-v3').textContent.replace(/(\r\n|\n|\r|\t)/gm, "");
                addr = addr.match(addrRegex)[1];
                detail = details[j].querySelector('span > span.item-description-v3').textContent.replace(/(\r\n|\n|\r|\t)/gm, "");
                price = details[j].querySelector('span > span.item-price-main-v3');
                const match = price?.textContent.split("€")[0].replace(/\s/g, "");
                const number = parseFloat(match);
                if(go2Page){
                    let link = details[j].querySelector('a').getAttribute('href');
                    res = gotScraping.get("https://m.en.aruodas.lt/" + link, {http2: true, "headers": header}).then((rmDetail) =>{
                        const detailDom = new JSDOM(rmDetail.body);
                        let x, y;
                        let map = detailDom.window.document.querySelector('#divBodyContainer > div.body-content-container > div > div.show-map-line-wrapper > a.show-map-line-inner');
                        map = map.getAttribute('href').split("query=")[1];
                        x = parseFloat(map.split("C")[0]);
                        y = parseFloat(map.split("C")[1]);
                        const dl = detailDom.window.document.querySelector('#advertInfoContainer > dl');
                        const dt = dl.querySelectorAll('dt');
                        const dd = dl.querySelectorAll('dd');
                        let roomIndex=-1, areaIndex=-1;
                        for(let k = 0; k < dt.length; k ++){
                            if(dt[k].textContent.includes('Number of rooms')){
                                roomIndex = k;
                            }
                            if(dt[k].textContent.includes('Area')){
                                areaIndex = k;
                            }
                        }
                        const obj = {
                            type:type,
                            adressline:addr,
                            title:'',
                            img:imgSrc,
                            area:dd[areaIndex] ? dd[areaIndex].textContent.split("m²")[0].replace(",", ".").replace(/\s/g, "") : '1',
                            rooms:dd[roomIndex] ? dd[roomIndex].textContent.replace(/\s/g, "") : '1',
                            priceEUR:number,
                            x:x,
                            y:y
                        };
                        partData.push(obj);
                    });
                }else{
                    detail = detail.match(addrRegex)[1];
                    detail = detail.split('m²')[0];
                    rooms = detail.split('rooms')[0].replace(/\s/g, "");
                    area = detail.split('rooms')[1].slice('1').replace(",", ".").replace(/\s/g, "");
                    res = geocoder.geocode(addr).then((cooder) =>{
                        const obj = {
                            type:type,
                            adressline:addr,
                            title:'',
                            img:imgSrc,
                            area:area? area : "1",
                            rooms:rooms ? rooms : "1",
                            priceEUR:number,
                            x:cooder?.[0].latitude,
                            y:cooder?.[0].longitude
                        };
                        partData.push(obj);
                    });
                }
                allPromises.push(res);
            }
            await Promise.all(allPromises);
        } catch (err) {
            // console.log(err);
        }
    }
    return partData;
};

module.exports = { getDataAruodas };
