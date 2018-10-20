const AWS = require('aws-sdk');
const endpoint = process.env['ENDPOINT'] || 'data.iot.ap-northeast-1.amazonaws.com'
const iotdata = new AWS.IotData({endpoint: 'https://'+endpoint});

exports.handle = async (e) => {
  console.log(e)
  let deviceId = e.deviceInfo.deviceId
  let thingName = e.placementInfo.attributes.thingName || deviceId
  let clickType = e.deviceEvent.buttonClicked.clickType
  let payload = e.placementInfo.attributes[clickType] || JSON.stringify({"state":{"reported" : { "clickType" : clickType }}})
  try {
    const params = {
      thingName:thingName,
      payload: payload
    };
    const result = await iotdata.updateThingShadow(params).promise();
    console.log(result)
    return(result)
  } catch (err) {
    console.log('error:', err);
    return(err)
  }
};
