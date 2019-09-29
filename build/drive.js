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
var fs_1 = __importDefault(require("fs"));
var googleapis_1 = require("googleapis");
;
// If modifying these scopes, delete token.json.
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
var TOKEN_PATH = 'token.json';
var REDIRECT_URL = 'https://eb61593c.ngrok.io/auth';
var oauth2Client = new googleapis_1.google.auth.OAuth2('1047761845586-iphu1hp2vdb7u591eff2mqvd481kkudf.apps.googleusercontent.com', 'TsrepX6LXKjC9iC6Gz3FzE-9', REDIRECT_URL);
var Drive = /** @class */ (function () {
    function Drive() {
    }
    /**
     * Lists the names and IDs of up to 10 files.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    Drive.prototype.listFiles = function (auth) {
        var drive = googleapis_1.google.drive({ version: 'v3', auth: auth });
        drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        }, function (err, res) {
            if (err || !res) {
                return console.log('The API returned an error: ' + err);
            }
            else {
                var files = res.data.files;
                if (files && files.length > 0) {
                    console.log('Files:');
                    files.map(function (file) {
                        console.log(file.name + " (" + file.id + ")");
                    });
                }
                else {
                    console.log('No files found.');
                }
            }
        });
    };
    Drive.prototype.getAuthorization = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Check if we have previously stored a token.
            fs_1.default.readFile(TOKEN_PATH, function (err, token) {
                if (err) {
                    var authURL = _this.getAuthURL();
                    return reject(authURL);
                }
                oauth2Client.setCredentials(JSON.parse(token));
                return resolve(oauth2Client);
            });
        });
    };
    Drive.prototype.getAuthURL = function () {
        return oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
            // If you only need one scope you can pass it as a string
            scope: SCOPES
        });
    };
    Drive.prototype.setTokens = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oauth2Client.getToken(code)];
                    case 1:
                        tokens = (_a.sent()).tokens;
                        oauth2Client.setCredentials(tokens);
                        return [2 /*return*/, this.saveTokenToFile(code)];
                }
            });
        });
    };
    Drive.prototype.saveTokenToFile = function (token) {
        // Store the token to disk for later program executions
        fs_1.default.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
            if (err)
                return console.error(err);
            console.log('Token saved to', TOKEN_PATH);
        });
    };
    return Drive;
}());
exports.DriveHandler = new Drive();
