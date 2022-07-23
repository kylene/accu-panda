const axios = require("axios");

async function sendConditions(conditions) {
    const accuPandaRequest = {
        method: 'post',
        url: process.env.ACCUPANDA_API_URL,
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