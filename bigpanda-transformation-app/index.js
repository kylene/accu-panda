const awsService = require('./services/awsService');
const bigPandaService = require('./services/bigPandaService');

exports.handler = async function(event, context) {
        // TODO remove commented out lines here maybe
    // event.Records.forEach(message => {

        // SQS batch size is currently set to 1, so we should only ever have 1 record
        const sqsEvent = event.Records[0]
        const conditions = await awsService.getConditionsFromS3(sqsEvent);
        const bigPandaRequest = bigPandaService.createBigPandaAlertRequest(conditions);
        // const response = await bigPandaService.sendConditionsAlertsToBigPanda(bigPandaRequest)

        return {};
    // }
}