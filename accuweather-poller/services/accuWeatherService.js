const axios = require('axios');

async function getWeatherConditions(zipCodes) {
    // get location keys
    let locationKeysPromises = [];

    zipCodes.forEach(zipCode => {
        const locationKeyPromise = getLocationKeyByZipCode(zipCode)
        locationKeysPromises.push(locationKeyPromise);
    })

    const locationKeys = await Promise.all(locationKeysPromises)

    // get conditions by location key
    const conditionsPromises = [];

    locationKeys.forEach(locationKey => {
        const conditionsPromise = getConditionsByLocationKey(locationKey)
        conditionsPromises.push(conditionsPromise);
    })

    return await Promise.all(conditionsPromises)
}

async function getLocationKeyByZipCode(zipCode) {
    if(zipCode.length !== 5) {
        throw new Error('Zip Code must be 5 characters long.')
    }

    const res = await axios.get(`${process.env.ACCUWEATHER_BASE_URL}/locations/v1/postalcodes/search?apikey=${process.env.ACCUWEATHER_API_KEY}&q=${zipCode}`)

    if(res.status !== 200) {
        throw new Error(res.statusText)
    }

    const usLocationEntity = res.data.find(locationEntity => locationEntity['Country']['ID'] === 'US')

    if(!usLocationEntity || !usLocationEntity['Key']) {
        throw new Error(`No US location keys found for zip code ${zipCode}`)
    }

    return usLocationEntity['Key'];
}

async function getConditionsByLocationKey(locationKey) {
    if(!locationKey) {
        throw new Error('No location key provided.')
    }

    const res = await axios.get(`${process.env.ACCUWEATHER_BASE_URL}/currentconditions/v1/${locationKey}?apikey=${process.env.ACCUWEATHER_API_KEY}`)

    if(res.status !== 200) {
        throw new Error(res.statusText)
    }

    return res.data;
}

module.exports = {
    getWeatherConditions,
    getLocationKeyByZipCode
}

