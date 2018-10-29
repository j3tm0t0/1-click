const https = require('https');
const url = require('url');
const defaultSlackUrl=process.env['SLACK_URL']
const defaultMessage={
    "SINGLE": "Single Click",
    "DOUBLE": "Double Click",
    "LONG": "Long Click"
}

exports.handle = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var slackUrl = (event.placementInfo.attributes.slackUrl)? event.placementInfo.attributes.slackUrl:defaultSlackUrl
    if(!slackUrl){

    }
    var slackReqOptions = url.parse(slackUrl);
    slackReqOptions.method = 'POST';
    slackReqOptions.headers = { 'Content-Type': 'application/json' };
    var text = event.placementInfo.attributes[event.deviceEvent.buttonClicked.clickType]
    if(text)
    {
      var text = event.placementInfo.attributes[event.deviceEvent.buttonClicked.clickType]
      var payload = {'text': text}
    }
    else {
      var text = defaultMessage[event.deviceEvent.buttonClicked.clickType]
      var payload = {'text': text, "attachments":[{"text":JSON.stringify(event,null,2)}] }
    }
    if (event.placementInfo.attributes.username)
    {
        payload.username = event.placementInfo.attributes.username;
    }
    if (event.placementInfo.attributes.iconEmoji)
    {
        payload.icon_emoji = event.placementInfo.attributes.iconEmoji;
    }
    if (event.placementInfo.attributes.iconUrl)
    {
        payload.icon_url = event.placementInfo.attributes.iconUrl;
        payload.as_user = false;
    }
    if (event.placementInfo.attributes.slackChannel)
    {
        payload.channel = event.placementInfo.attributes.slackChannel;
    }
    var body = JSON.stringify(payload);
    slackReqOptions.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
    };
    var req = https.request(slackReqOptions, function(res) {
        if (res.statusCode === 200) {
            console.log('Posted to slack');
            callback(null, {"result":"ok"});
        } else {
            callback(false, {"result":"ng", "reason":'Failed to post slack ' + res.statusCode})
        }
        return res;
    });
    req.write(body);
    req.end();
};
