const axios = require("axios");

const bigPandaUrl = 'https://api.bigpanda.io/data/v2/alerts';
const bigPandaToken = '92867a91b9a5792f04ffd8282f3e6a65';
const bigPandaAppKey = '8eb857809a461f877394a316a7f0fdcb';

async function sendConditionsToBigPanda(conditions) {

    const bigPandaRequest = {
        method: 'post',
        url: bigPandaUrl,
        headers: {
            'Authorization': `Bearer ${bigPandaToken}`
        },
        data: {
            "app_key": bigPandaAppKey,
            "status": "ok",
            "host": "production-database-1",
            "check": "CPU overloaded",
            "description": "test notification"
        }
    }

    const res = await axios(bigPandaRequest)

    if(res.status !== 200) {
        throw new Error(res.statusText)
    }

    return res.data;
}

// TODO complete transformConditions() method
function transformConditions(conditions) {

}

module.exports = {
    sendConditionsToBigPanda,
    transformConditions
}