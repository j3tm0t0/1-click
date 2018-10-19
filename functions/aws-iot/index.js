const AWS = require('aws-sdk');
const endpoint = process.env['ENDPOINT'] || 'https://data.iot.ap-northeast-1.amazonaws.com'
const iotdata = new AWS.IotData({endpoint: endpoint});
const default_topic = process.env['TOPIC'] || 'buttons'
const default_qos = process.env['QOS'] || 0

const clickTypes={
  "SINGLE":1,
  "DOUBLE":2,
  "LONG":3
}

exports.handle = async (e) => {
  console.log(e)
  let deviceId = e.deviceInfo.deviceId
  let topic = e.placementInfo.attributes.topic || default_topic
  let qos = e.placementInfo.attributes.qos || 0
  try {
    const params = {
      topic: topic+"/"+deviceId,
      payload: JSON.stringify(e),
      qos: qos
    };
    const result = await iotdata.publish(params).promise();
    console.log(result)
    return(result)
  } catch (err) {
    console.log('error:', err);
    return(err)
  }
};
