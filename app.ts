import { DriveHandler } from './drive';
import { WebClient } from '@slack/web-api';
import express from 'express';
import { createEventAdapter } from '@slack/events-api';
import { createMessageAdapter } from '@slack/interactive-messages';

const app = express();
// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_BOT_TOKEN;
const secret: any = process.env.SLACK_SIGNING_SECRET;

const web = new WebClient(token);
// Initialize using signing secret from environment variables
const slackEvents = createEventAdapter(secret);
const slackInteractions = createMessageAdapter(secret);

// Attach the event adapter to the express app as a middleware
app.use('/slack/events', slackEvents.expressMiddleware());
app.use('/slack/actions', slackInteractions.expressMiddleware());

const PORT = process.env.PORT || 3000;

app.get('/auth', (req, res) => {
  const { code } = req.query;

  DriveHandler.setTokens(code);
});

slackEvents.on('/iris', async ({ command, ack, say }) => {
  ack();
  // catch no text error
  if (command.text.includes('link')) {
    // Listens to incoming messages that contain "hello"
    const welcomeMessage = {
      text: '',
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Hi there :wave:`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Let's get you started with exporting your conversations to your drive account."
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "But before that, we need you to connect your Google Drive. Simply click the button below:"
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Connect Account",
                "emoji": true
              },
              "action_id": "connect_drive"
            }
          ]
        }
      ]
    };
    // say() sends a message to the channel where the event was triggered
    say(welcomeMessage);
  } else {
    say('invalid command: ' + command.text);
  }
});

slackEvents.on('error', err => {
  console.error(err);
});

slackInteractions.action('connect_drive', ({ body, ack, say, context, payload: trigger_id }) => {
  // Acknowledge the action
  ack();
  DriveHandler.getAuthorization()
    .then(() => say('Already linked your dirve to Iris.'))
    .catch((url: string) => say('Click on this link to authorize: ' + url));
});

slackInteractions.action('google_auth', ({ body, ack, say }) => {
  ack();
  console.log(body);
  // DriveHandler.setTokens(code).then(() => console.log('Successfully authorized', code));
});

// Start your app
app.listen(PORT, () => console.log(`⚡️ Iris slack bot is running on ${PORT}!`));
