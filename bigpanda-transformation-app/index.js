const winston = require('winston');

const awsService = require('./services/awsService');
const bigPandaService = require('./services/bigPandaService');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {
        service: 'BigPanda Transformation App',
    },
    transports: [
        // Write all logs to console
        new winston.transports.Console(),
    ],
});

exports.handler = async function(event, context) {
    try {
        // SQS batch size is currently set to 1, so we should only ever have 1 record
        const sqsEvent = event.Records[0]

        // get the weather conditions json object from S3
        const s3Object = awsService.parseSqsS3Event(sqsEvent)
        const conditions = await awsService.getJSONFromS3(s3Object);

        // format conditions into alerts
        const bigPandaRequest = bigPandaService.createBigPandaAlertRequest(conditions);

        // send request to BigPanda
        await bigPandaService.sendRequestToBigPanda(bigPandaRequest, logger)
    } catch(e) {
        logger.log({
            level: 'error',
            message: e.message
        });
    }

    return {};
}