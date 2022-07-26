const axios = require('axios');

async function getLocationKeyByZipCode(zipCode) {
    if(zipCode.length !== 5) {
        throw new Error('ZIP Code must be 5 characters long.')
    }

    // TODO: update this to include country code
    const res = await axios.get(`${process.env.ACCUWEATHER_BASE_URL}/locations/v1/postalcodes/search?apikey=${process.env.ACCUWEATHER_API_KEY}&q=${zipCode}`)

    if(res.status !== 200) {
        throw new Error(`Error getting location keys: ${res.status} ${res.statusText}`)
    }

    const usLocationEntity = res.data.find(locationEntity => locationEntity['Country']['ID'] === 'US')

    if(!usLocationEntity || !usLocationEntity['Key']) {
        throw new Error(`Error getting location keys: No US location keys found for zip code ${zipCode}`)
    }

    return usLocationEntity['Key'];
}

async function getConditionsByLocationKey(locationKey) {
    if(!locationKey) {
        throw new Error('Error getting condtions: No location key provided.')
    }

    const res = await axios.get(`${process.env.ACCUWEATHER_BASE_URL}/currentconditions/v1/${locationKey}?apikey=${process.env.ACCUWEATHER_API_KEY}`)

    if(res.status !== 200) {
        throw new Error(`Error getting location keys: ${res.status} ${res.statusText}`)
    }

    return {
        LocationKey: locationKey,
        ...res.data[0]
    };
}

module.exports = {
    getLocationKeyByZipCode,
    getConditionsByLocationKey
}

