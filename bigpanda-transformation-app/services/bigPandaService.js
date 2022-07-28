const axios = require("axios");

const STATUS_WARNING = 'warning';
const STATUS_CRITICAL = 'critical'

class BigPandaAlert {
    constructor(condition) {
        const { status, description } = this.getAlertStatusByTemperature(condition.Temperature.Imperial.Value);
        this.status = status;
        this.timestamp = condition.EpochTime;
        this.primary_property = 'LocationKey';
        this.secondary_property = 'WeatherText';
        this.description = description;

        Object.keys(condition).forEach(key => {
            // this is reflected in the timestamp, removed for redundancy
            if(key === 'EpochTime') {
                return;
            }

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
                return { status: STATUS_CRITICAL, description: 'Temperature has exceeded 100 degrees.' };
            default:
                return { status: STATUS_WARNING, description: 'Temperature is elevated.' };
        }
    }
}

async function sendRequestToBigPanda(bigPandaRequest, logger) {
    logger.log({
        level: 'info',
        message: bigPandaRequest
    });

    const res = await axios(bigPandaRequest)

    if(res.status > 204) {
        throw new Error(`Error sending request to BigPanda: ${res.status} ${res.statusText}`)
    }

    return res.data;
}

function createBigPandaAlertRequest(conditions) {
    return {
        method: 'post',
        url: process.env.BIG_PANDA_URL,
        headers: {
            'Authorization': `Bearer ${process.env.BIG_PANDA_TOKEN}`,
        },
        data: {
            "app_key": process.env.BIG_PANDA_APP_KEY,
            "alerts": conditions.map(condition => {
                return new BigPandaAlert(condition);
            })
        }
    }
}

module.exports = {
    sendRequestToBigPanda,
    createBigPandaAlertRequest
}