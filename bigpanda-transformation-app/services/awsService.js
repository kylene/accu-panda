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

async function getJSONFromS3(s3Object) {
    const result = await s3.getObject(s3Object).promise()
    const message = JSON.parse(result.Body.toString())

    return message.body;
}

module.exports = {
    parseSqsS3Event,
    getJSONFromS3
}