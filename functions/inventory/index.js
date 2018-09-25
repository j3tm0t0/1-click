const https = require('https');
const url = require('url');
const baseUrl = "https://api.soracom.io/v1/devices/"

const clickTypes={
  "SINGLE":1,
  "DOUBLE":2,
  "LONG":3
}

exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)
  let deviceId = e.placementInfo.attributes.deviceId
  if(deviceId == null)
  {
    cb("deviceId is not defined.")
    return
  }
  let secret = e.placementInfo.attributes.secretKey
  if(secret == null)
  {
    cb("secretKey is not defined.")
    return
  }

  let data = e.placementInfo.attributes
  data.clickType = clickTypes[e.deviceEvent.buttonClicked.clickType]
  data.remainingLife = e.deviceInfo.remainingLife
  delete data['secretKey']
  data.deviceId = e.deviceInfo.deviceId

  let targetUrl = baseUrl + deviceId + "/publish?device_secret="+encodeURIComponent(secret)

  let options = url.parse(targetUrl)
  options.method = 'POST'
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(data),'utf-8')
  }
  let req  = https.request (options, function(res){
    if (res.statusCode === 201)
    {
      console.log('succeeded with '+res.statusCode)
      cb(null, true)
    }
    else {
      cb("failed with "+res.statusCode)
    }
    return res;
  })
  req.write(JSON.stringify(data))
  req.end()
}
