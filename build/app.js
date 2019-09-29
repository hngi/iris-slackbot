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
var express_1 = __importDefault(require("express"));
var events_api_1 = require("@slack/events-api");
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var body_parser_1 = __importDefault(require("body-parser"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var database_1 = require("./config/database");
dotenv_1.default.config();
var app = express_1.default();
// An access token (from your Slack app or custom integration - xoxp, xoxb)
var token = process.env.SLACK_BOT_TOKEN;
var secret = process.env.SLACK_SIGNING_SECRET;
// Initialize using signing secret from environment variables
var slackEvents = events_api_1.createEventAdapter(secret);
/* Database Configuration */
database_1.configureDB(mongoose_1.default);
// Attach the event adapter to the express app as a middleware
app.use('/slack/events', slackEvents.expressMiddleware());
// app.use('/slack/actions', slackInteractions.expressMiddleware());
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
var PORT = process.env.PORT || 3000;
app.get('/auth', function (req, res) {
    var code = req.query.code;
    drive_1.DriveHandler.setTokens(code);
});
app.post('/slack/iris', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var command, welcomeMessage;
    return __generator(this, function (_a) {
        command = req.body;
        // res.sendStatus(200);
        // ack();
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
            res.json(welcomeMessage);
        }
        else if (command.text.includes('save')) {
            res.send('We are unable to save your conversations now :(');
        }
        else if (command.text.includes('list')) {
            res.send('We are unable to list your saved conversations now :(');
        }
        else {
            res.send('invalid command: ' + command.text);
        }
        return [2 /*return*/];
    });
}); });
slackEvents.on('error', function (err) {
    console.error(err);
});
app.post('/slack/actions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var action, response, action_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                action = JSON.parse(req.body.payload);
                console.log(action);
                response = '';
                if (!(action.actions[0].action_id === 'connect_drive')) return [3 /*break*/, 2];
                return [4 /*yield*/, drive_1.DriveHandler.getAuthorization()
                        .catch(function (url) {
                        console.log(url);
                        return respond('Click on this link to authorize: ' + url, action.response_url);
                    })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (action.actions[0].action_id === 'google_auth') {
                    action_1 = req.body;
                    console.log(action_1);
                    console.log(action_1.message.text);
                    // DriveHandler.setTokens(code).then(() => console.log('Successfully authorized', action.text));
                }
                return [2 /*return*/];
        }
    });
}); });
function respond(text, url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, messageData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1.default(url, {
                        method: "post",
                        headers: {
                            // "Authorization": `Bearer ${MEDIUM_ACCESS_TOKEN}`,
                            "Content-type": "application/json",
                            "Accept": "application/json",
                            "Accept-Charset": "utf-8"
                        },
                        body: JSON.stringify({ text: text, repsponse_type: 'in_channel' })
                    })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    messageData = _a.sent();
                    // the API frequently returns 201
                    if ((response.status !== 200) && (response.status !== 201)) {
                        console.error("Invalid response status " + response.status + ".");
                        throw messageData;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Start your app
app.listen(PORT, function () { return console.log("\u26A1\uFE0F Iris slack bot is running on " + PORT + "!"); });
