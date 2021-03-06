var AWS = require("aws-sdk");
var S3 = new AWS.S3();
var bcyrpt = require("bcrypt");
var ddb = new AWS.DynamoDB({
    region: 'ap-south-1'
});
var CloudWatch = new AWS.CloudWatch({
    region: 'ap-south-1'
});
exports.handler = (event) => {
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
            // counter 
            var linecount = 0;
            lines.forEach((eachLine) => {
                var cols = eachLine.split(",");
                console.log(cols[3]);
                var item = {
                    TableName: 'AIRPORTS_NILESH',
                    Item: {
                        "airportid": {
                            "S": cols[0]
                        },
                        "airportcode": {
                            "S": cols[1]
                        },
                        "airportype": {
                            "S": cols[2]
                        },
                        "airportname": {
                            "S": cols[3]
                        },
                        "latitude_deg": {
                            "S": cols[4]
                        },
                        "longitude_deg": {
                            "S": cols[5]
                        }
                    }
                };
                if (lines != null || lines != undefined || lines != "" || lines.length != 0) {
                    ddb.putItem(item, (d_err, d_resp) => {
                        if (d_err)
                            console.log("Unable to Write to Database Dynamo ", d_err);
                        else
                            console.log("Writing Succeeded to Dynamo DB ");
                    });
                }
                linecount = linecount + 1;
            });
            console.log("Total Recordsd processd ", linecount);
            console.log("---------------------Publishing Metrics------------------")
            // Metric Construct // 
            var metric = {
                MetricData: [{
                    MetricName: 'TOTAL_RECORDS',
                    Dimensions: [{
                        Name: 'FILE_PROCESSING',
                        Value: 'RECORDS_PROCESSED'
                    }, ],
                    Timestamp: new Date(),
                    Unit: 'Count',
                    Value: linecount
                }],
                Namespace: 'nilapp'
            };
            CloudWatch.putMetricData(metric, (_perr, presp) => {
                if (_perr)
                    console.log(_perr);
                else
                    console.log("published metrics succesfully");
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
var event = {
    Records: [{
        s3: {
            bucket: {
                name: 'vinsys.com.lambdanilesh'
            },
            object: {
                key: 'airports.csv'
            }
        }
    }]
};
console.log(this.handler(event));