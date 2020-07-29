// imports the aws-sdk 
var AWS = require("aws-sdk");
var S3 = new AWS.S3();

exports.handler = (event) => {
    //console.log(event);
    // storage as a service ...
    var bucketName = event.Records[0].s3.bucket.name;
    var objectName = event.Records[0].s3.object.key;

    S3.getObject({
        Bucket: bucketName,
        Key: objectName
    }, (err, res) => {
        if (err) {
            console.log("This log goes to cloud watch.......", err);
        } else {
            var content = res.Body.toString();
            var lines = content.split("\n");
            lines.forEach((eachLine) => {
                var cols = eachLine.split(",");
                console.log(cols[3]);
            });
        }
    });
    var response = {};
    console.log(bucketName);
    console.log(objectName);
    response.status = 200;
    response.message = "Helloworld";
    return response;
};

