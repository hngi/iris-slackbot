"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var drive_1 = require("./drive");
var web_api_1 = require("@slack/web-api");
var express_1 = __importDefault(require("express"));
var events_api_1 = require("@slack/events-api");
var interactive_messages_1 = require("@slack/interactive-messages");
var app = express_1.default();
// An access token (from your Slack app or custom integration - xoxp, xoxb)
var token = process.env.SLACK_BOT_TOKEN;
var secret = process.env.SLACK_SIGNING_SECRET;
var web = new web_api_1.WebClient(token);
// Initialize using signing secret from environment variables
var slackEvents = events_api_1.createEventAdapter(secret);
var slackInteractions = interactive_messages_1.createMessageAdapter(secret);
// Attach the event adapter to the express app as a middleware
app.use('/slack/events', slackEvents.expressMiddleware());
app.use('/slack/actions', slackInteractions.expressMiddleware());
var PORT = process.env.PORT || 3000;
app.get('/auth', function (req, res) {
    var code = req.query.code;
    drive_1.DriveHandler.setTokens(code);
});
slackEvents.on('/iris', function (_a) {
    var command = _a.command, ack = _a.ack, say = _a.say;
    return __awaiter(void 0, void 0, void 0, function () {
        var welcomeMessage;
        return __generator(this, function (_b) {
            ack();
            // catch no text error
            if (command.text.includes('link')) {
                welcomeMessage = {
                    text: '',
                    blocks: [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "Hi there :wave:"
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
            }
            else {
                say('invalid command: ' + command.text);
            }
            return [2 /*return*/];
        });
    });
});
slackEvents.on('error', function (err) {
    console.error(err);
});
slackInteractions.action('connect_drive', function (_a) {
    var body = _a.body, ack = _a.ack, say = _a.say, context = _a.context, trigger_id = _a.payload;
    // Acknowledge the action
    ack();
    drive_1.DriveHandler.getAuthorization()
        .then(function () { return say('Already linked your dirve to Iris.'); })
        .catch(function (url) { return say('Click on this link to authorize: ' + url); });
});
slackInteractions.action('google_auth', function (_a) {
    var body = _a.body, ack = _a.ack, say = _a.say;
    ack();
    console.log(body);
    // DriveHandler.setTokens(code).then(() => console.log('Successfully authorized', code));
});
// Start your app
app.listen(PORT, function () { return console.log("\u26A1\uFE0F Iris slack bot is running on " + PORT + "!"); });
