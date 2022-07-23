const aws = require('aws-sdk');
const s3 = new aws.S3();

class S3Object {
    constructor(bucket, key) {
        this.Bucket = bucket;
        this.Key = key;
    };
}

function parseSqsS3Event(sqsEvent) {
    const sqsMessageBody = JSON.parse(sqsEvent.body)
    const s3Event = sqsMessageBody.Records[0];
    const bucket = s3Event.s3.bucket.name;
    const key = s3Event.s3.object.key;

    return new S3Object(bucket, key);
}

async function getConditionsFromS3(sqsEvent) {
    const s3Object = parseSqsS3Event(sqsEvent);

    // const params = { Bucket: s3Object.Bucket, Key: s3Object.key };

    const result = await s3.getObject(s3Object).promise()
    // console.log(result)
    // console.log(result.Body.toString())

    const message = JSON.parse(result.Body.toString())
    const conditions = message.body
    // console.log(conditions);
    // console.log(conditions.length);

    return conditions;
}

module.exports = {
    getConditionsFromS3
}