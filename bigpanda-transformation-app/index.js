const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = async function(event, context) {

    // event.Records.forEach(message => {
    const sqsEvent = event.Records[0]
    const sqsMessageBody = JSON.parse(sqsEvent.body)
    const s3Event = sqsMessageBody.Records[0];
    const bucket = s3Event.s3.bucket.name;
    const key = s3Event.s3.object.key;

    var params = {Bucket: bucket, Key: key};

    const result = await s3.getObject(params).promise()
    console.log(result)
    // s3.getObject(params, function(err, data) { 
    //     console.log('S3.getObject called');

    //     if (err) {
    //         console.log(err, err.stack); // an error occurred
    //         callback(err);
    //     } else {
    //         console.log(data);           // successful response
    //         callback(null, null);
    //     }
    //     console.log('Leaving s3.getObject');
    // });

    // });
    return {};
}