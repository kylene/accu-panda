require('dotenv').config();

const accuWeatherService = require('./services/accuWeatherService');
const accuPandaService = require('./services/accuPandaService');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Enter a zip code: ', async zipCode => {
    console.log(`Fetching weather for zip code: ${zipCode}`);
    readline.close();

    try {
        // get AccuWeather conditions
        const conditions = await accuWeatherService.getWeatherConditions(zipCode)
        console.log("====================================")
        console.log(JSON.stringify(conditions))

        // send to AccuPanda API
        await accuPandaService.sendConditions(conditions)
    } catch (e) {
        console.error(e.message)
    }
});

