const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();
const clickTypes={
  "SINGLE":1,
  "DOUBLE":2,
  "LONG":3
}

exports.handle = async (e) => {
  console.log(e)
  let deviceId = e.deviceInfo.deviceId
  let clickType = e.deviceEvent.buttonClicked.clickType

  try {
    const params = {
      Namespace: 'Button',
      MetricData:[
        {
          MetricName: 'ClickType',
          Dimensions: [{
            Name: 'DeviceId',
            Value: deviceId
          }],
          Value: clickTypes[clickType],
          Unit: "Count"
        }
      ]
    };
    const result = await cloudwatch.putMetricData(params).promise();
    console.log(result)
    return(result)
  } catch (err) {
    console.log('error:', err);
    return(err)
  }
};
