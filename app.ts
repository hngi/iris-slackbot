import { DriveHandler } from './drive';
import express from 'express';
import { createEventAdapter } from '@slack/events-api';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import fetch from 'node-fetch';
import { configureDB } from './config/database';
import { Convo } from './models/convo';

dotenv.config();

const app = express();
// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_BOT_TOKEN;
const secret: any = process.env.SLACK_SIGNING_SECRET;

// Initialize using signing secret from environment variables
const slackEvents = createEventAdapter(secret);

/* Database Configuration */
configureDB(mongoose);

// Attach the event adapter to the express app as a middleware
app.use('/slack/events', slackEvents.expressMiddleware());
// app.use('/slack/actions', slackInteractions.expressMiddleware());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/auth', (req, res) => {
  const { code } = req.query;

  DriveHandler.setTokens(code);
});

app.post('/slack/iris', async (req, res) => {
  // console.log(req.body);
  const command: CommandResponse = req.body;
  // res.sendStatus(200);
  // ack();
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
    res.json(welcomeMessage);
  } else if (command.text.includes('save')) {
    res.send('We are unable to save your conversations now :(');
  } else if (command.text.includes('list')) {
    res.send('We are unable to list your saved conversations now :(');
  } else {
    res.send('invalid command: ' + command.text);
  }
});

slackEvents.on('error', err => {
  console.error(err);
});

app.post('/slack/actions', async (req, res) => {
  const action = JSON.parse(req.body.payload);
  console.log(action);
  // return res.send('yeah!');
  let response: string = '';
  // Acknowledge the action
  if (action.actions[0].action_id === 'connect_drive') {
    await DriveHandler.getAuthorization()
      .catch((url: string) => {
        console.log(url);
        return respond('Click on this link to authorize: ' + url, action.response_url);
      });
    // return respond('Click on this link to authorize: ' + url, action.response_url);
    // return res.send('Already linked your dirve to Iris.');
  }

  if (action.actions[0].action_id === 'google_auth') {
    const action = req.body;
    console.log(action);
    console.log(action.message.text);
    // DriveHandler.setTokens(code).then(() => console.log('Successfully authorized', action.text));
  }
});

async function respond(text: string, url: string) {
  const response = await fetch(url, {
    method: "post",
    headers: {
      // "Authorization": `Bearer ${MEDIUM_ACCESS_TOKEN}`,
      "Content-type": "application/json",
      "Accept": "application/json",
      "Accept-Charset": "utf-8"
    },
    body: JSON.stringify({ text, repsponse_type: 'in_channel' })
  });

  const messageData = await response.json();

  // the API frequently returns 201
  if ((response.status !== 200) && (response.status !== 201)) {
    console.error(`Invalid response status ${response.status}.`);
    throw messageData;
  }
}
// Start your app
app.listen(PORT, () => console.log(`⚡️ Iris slack bot is running on ${PORT}!`));


interface CommandResponse {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
}