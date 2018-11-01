import json
import logging
import urllib.request, urllib.parse

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info('Received event: ' + json.dumps(event)) # Output to Cloudwatch Log
    token = event['placementInfo']['attributes']['token']
    to = event['placementInfo']['attributes']['to']

    payload = 'Hi! This message from {}. Event type is {}. RemainingLife is {}.'.format(
           event['deviceInfo']['deviceId'],
           event['deviceEvent']['buttonClicked']['clickType'],
           event['deviceInfo']['remainingLife']).strip()

    body = {
        'to': to,
        'messages': [{"type": "text", "text": payload}]
    }
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {}'.format(token)
    }
    
    req = urllib.request.Request('https://api.line.me/v2/bot/message/push',
                                  data=json.dumps(body).encode('utf-8'),
                                  method='POST', headers=headers)
    with urllib.request.urlopen(req) as res:
        logger.info(res.read().decode("utf-8"))

    return {"statusCode": res.status}
