
let firstTimer = "00:00";
let SecondTimer = "00:00";

const startScraping = () => {
    
}

const setFirstTimer = (val) => {
    firstTimer = val;
}

const setSecondTimer = (val) => {
    SecondTimer = val;
}
const checkTime = () => {
    var now = new Date();
    let tim = "01:17";
    const time = now.getHours() + ":" + now.getMinutes();
    if(tim == time){
        console.log('start');
    }
    if(time == firstTimer || time == SecondTimer){
        // startScraping();
    }
}
module.exports = { checkTime, setFirstTimer, setSecondTimer }