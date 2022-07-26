require('dotenv').config();
const winston = require('winston');

const demoZipCodes = require('./constants/zipCodes.json')

const accuWeatherService = require('./services/accuWeatherService');
const accuPandaService = require('./services/accuPandaService');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint()),
    defaultMeta: {
        service: 'AccuWeather Poller',
        environment: process.env.NODE_ENV
    },
    transports: [
        // Write all logs to console
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Enter a metro area: ', async metroArea => {
    logger.log({
        level: 'info',
        message: `Fetching weather for metro area: ${metroArea}`
    })

    readline.close();

    try {
        if(!Object.keys(demoZipCodes).includes(metroArea)) {
            throw new Error("Error reading user input: Invalid metro area.");
        }

        const zipCodes = demoZipCodes[metroArea];

        // get location keys for each ZIP code
        let locationKeysPromises = [];

        zipCodes.forEach(zipCode => {
            const locationKeyPromise = accuWeatherService.getLocationKeyByZipCode(zipCode)
            locationKeysPromises.push(locationKeyPromise);
        })

        const locationKeys = await Promise.all(locationKeysPromises)

        // get conditions by location key
        const conditionsPromises = [];

        locationKeys.forEach(locationKey => {
            const conditionsPromise = accuWeatherService.getConditionsByLocationKey(locationKey)
            conditionsPromises.push(conditionsPromise);
        })

        const conditions = await Promise.all(conditionsPromises)

        // send to AccuPanda API
        await accuPandaService.postMessage(conditions)
    } catch (e) {
        logger.log({
            level: 'error',
            message: e.message
        })
    }
});

