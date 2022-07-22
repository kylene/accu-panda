const axios = require('axios');

const accuWeatherBaseUrl = 'http://dataservice.accuweather.com';

// TODO: move to env variables
const accuWeatherApiKey = 'Q7FmHNhcT9oLhLirPaixbz5WFmgThFEz';

// TODO: create classes for location entity and conditions

async function getWeatherConditions(zipCode) {

    // get location key
    const locationKey = await getLocationKeyByZipCode(zipCode)

    // get conditions by location key
    return await getConditionsByLocationKey(locationKey);
}

async function getLocationKeyByZipCode(zipCode) {
    if(zipCode.length !== 5) {
        throw new Error('Zip Code must be 5 characters long.')
    }

    const res = await axios.get(`${accuWeatherBaseUrl}/locations/v1/postalcodes/search?apikey=${accuWeatherApiKey}&q=${zipCode}`)

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

    const res = await axios.get(`${accuWeatherBaseUrl}/currentconditions/v1/${locationKey}?apikey=${accuWeatherApiKey}`)

    if(res.status !== 200) {
        throw new Error(res.statusText)
    }

    return res.data;
}

module.exports = {
    getWeatherConditions,
    getLocationKeyByZipCode
}

