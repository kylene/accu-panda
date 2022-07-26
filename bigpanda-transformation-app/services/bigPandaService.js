const axios = require("axios");

const bigPandaUrl = 'https://api.bigpanda.io/data/v2/alerts';
const bigPandaToken = '92867a91b9a5792f04ffd8282f3e6a65';
const bigPandaAppKey = '8eb857809a461f877394a316a7f0fdcb';

class BigPandaAlert {
    constructor(condition) {
        const { status, description } = this.getAlertStatusByTemperature(condition.Temperature.Imperial.Value);
        this.status = status;
        this.timestamp = condition.EpochTime;
        this.primary_property = 'LocationKey';
        this.secondary_property = 'WeatherText';
        this.description = description;

        Object.keys(condition).forEach(key => {
            if(key === 'Temperature') {
                this['Temperature_Metric'] = `${condition.Temperature.Metric.Value} ${condition.Temperature.Metric.Unit}`
                this['Temperature_Imperial'] = `${condition.Temperature.Imperial.Value} ${condition.Temperature.Imperial.Unit}`
                return;
            }

            this[key] = condition[key]?.toString();
        })
    };

    getAlertStatusByTemperature(temperature) {
        switch(true) {
            case temperature > 100:
                return { status: 'critical', description: 'Temperature has exceeded 100 degrees.' };
            case temperature > 90:
                return { status: 'warning', description: 'Temperature has exceeded 90 degrees.' };
            default:
                return 'ok'
        }
    }
}

async function sendRequestToBigPanda(bigPandaRequest) {
    console.log(bigPandaRequest)
    const res = await axios(bigPandaRequest)

    if(res.status !== 201) {
        throw new Error(res.statusText)
    }

    return res.data;
}

function createBigPandaAlertRequest(conditions) {
    return {
        method: 'post',
        url: bigPandaUrl,
        headers: {
            'Authorization': `Bearer ${bigPandaToken}`,
        },
        data: {
            "app_key": bigPandaAppKey,
            "alerts": JSON.parse(JSON.stringify(conditions.map(condition => {
                return new BigPandaAlert(condition);
            })))
        }
    }
}

module.exports = {
    bigPandaUrl,
    bigPandaAppKey,
    sendRequestToBigPanda,
    createBigPandaAlertRequest
}