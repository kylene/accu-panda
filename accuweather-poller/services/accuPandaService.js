const axios = require("axios");

// TODO: move to env variables
const accuPandaApiUrl = 'https://pm1jiuoa8l.execute-api.us-west-2.amazonaws.com/dev/accupanda/message';

async function sendConditions(conditions) {
    const accuPandaRequest = {
        method: 'post',
        url: accuPandaApiUrl,
        headers: {
            'Content-Type': `application/json`
        },
        data: conditions
    }

    const res = await axios(accuPandaRequest)

    return;
}

module.exports = {
    sendConditions,
}