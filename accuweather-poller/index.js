require('dotenv').config();
const demoZipCodes = require('./constants/zipCodes.json')

const accuWeatherService = require('./services/accuWeatherService');
const accuPandaService = require('./services/accuPandaService');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Enter a metro area: ', async metroArea => {
    console.log(`Fetching weather for metro area: ${metroArea}`);
    readline.close();

    try {
        // get AccuWeather conditions
        const zipCodes = demoZipCodes[metroArea];
        const conditions = await accuWeatherService.getWeatherConditions(zipCodes)

        // send to AccuPanda API
        await accuPandaService.sendConditions(conditions)
    } catch (e) {
        console.error(e.message)
    }
});

