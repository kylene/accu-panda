const axios = require("axios");

const bigPandaUrl = 'https://api.bigpanda.io/data/v2/alerts';
const bigPandaToken = '92867a91b9a5792f04ffd8282f3e6a65';
const bigPandaAppKey = '8eb857809a461f877394a316a7f0fdcb';

class BigPandaAlert {
    constructor(condition) {
        // this.app_key = bigPandaAppKey;
        this.status = this.getAlertStatusByWeatherText(condition.WeatherText);
        this.timestamp = condition.EpochTime;
        this.primaryProperty = condition.LocationKey;
        this.secondaryProperty = condition.WeatherText;

        Object.keys(condition).forEach(key => {
            if(key === 'Temperature') {
                this['Temperate_Metric'] = `${condition.Temperature.Metric.Value} ${condition.Temperature.Metric.Unit}`
                this['Temperate_Imperial'] = `${condition.Temperature.Imperial.Value} ${condition.Temperature.Imperial.Unit}`
            }

            this[key] = condition[key].toString();
        })
    };

    getAlertStatusByWeatherText(weatherText) {
        switch(weatherText) {
            default:
                return "critical"
        }
    }
}

async function sendConditionsToBigPanda(bigPandaRequest) {
    const res = await axios(bigPandaRequest)

    if(res.status !== 200) {
        throw new Error(res.statusText)
    }

    return res.data;
}

// TODO complete transformConditions() method
function createBigPandaAlertRequest(conditions) {
    return {
        method: 'post',
        url: bigPandaUrl,
        headers: {
            'Authorization': `Bearer ${bigPandaToken}`,
        },
        data: {
            app_key: bigPandaAppKey,
            alerts: [
                conditions.forEach(condition => {
                    return new BigPandaAlert(condition);
                })
            ]
        }
    }
}

module.exports = {
    bigPandaUrl,
    bigPandaAppKey,
    sendConditionsToBigPanda,
    createBigPandaAlertRequest
}