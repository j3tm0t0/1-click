const AWS = require('aws-sdk');
const endpoint = process.env['ENDPOINT'] || 'data.iot.ap-northeast-1.amazonaws.com'
const iotdata = new AWS.IotData({endpoint: 'https://'+endpoint});
const default_topic = process.env['TOPIC'] || 'buttons'
const default_qos = process.env['QOS'] || 0

exports.handle = async (e) => {
  console.log(e)
  let deviceId = e.deviceInfo.deviceId
  let topic = e.placementInfo.attributes.topic || default_topic
  let qos = e.placementInfo.attributes.qos || 0
  let clickType = e.deviceEvent.buttonClicked.clickType
  let payload = e.placementInfo.attributes[clickType] || JSON.stringify(p)
  try {
    const params = {
      topic: topic+"/"+deviceId,
      payload: payload,
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
