import { SayArguments, App } from "@slack/bolt";

export default class Bot {
  constructor(public app: App) {
    this.app = app;
  }

  sendConnectMessage() {
    // Listens to incoming messages that contain "hello"
    this.app.message('hello', ({ message, say }) => {

      const welcomeMessage: SayArguments = {
        text: '',
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `Hi ${message.user} :wave:`
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
                "value": "click_me_123"
              }
            ]
          }
        ]
      };
      // say() sends a message to the channel where the event was triggered
      say(welcomeMessage);
    });
  }
}