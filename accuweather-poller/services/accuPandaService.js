const axios = require("axios");

async function postMessage(messageContents) {
    const accuPandaPostMessageRequest = {
        method: 'post',
        url: `${process.env.ACCUPANDA_API_URL}/message`,
        headers: {
            'Content-Type': `application/json`
        },
        data: messageContents
    }

    const res = await axios(accuPandaPostMessageRequest)

    if(res.status !== 200) {
        throw new Error(`Error getting location keys: ${res.status} ${res.statusText}`)
    }
}

module.exports = {
    postMessage,
}