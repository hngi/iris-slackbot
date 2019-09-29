import fs from 'fs';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

interface Credentials { client_id: string; client_secret: string; redirect_uris: string[]; };
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
const REDIRECT_URL = 'https://9a4207c8.ngrok.io/auth';
const oauth2Client = new google.auth.OAuth2(
  '1047761845586-urbiftqu0plg77jnbqgrd37d96ri2fdv.apps.googleusercontent.com',
  'Ak7fuYbcIAcYARmO61ksxQcE',
  REDIRECT_URL
);

class Drive {
  /**
   * Lists the names and IDs of up to 10 files.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  public listFiles(auth: OAuth2Client) {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
      if (err || !res) {
        return console.log('The API returned an error: ' + err);
      } else {
        const files = res.data.files;
        if (files && files.length > 0) {
          console.log('Files:');
          files.map((file) => {
            console.log(`${file.name} (${file.id})`);
          });
        } else {
          console.log('No files found.');
        }
      }
    });
  }

  public getAuthorization(): Promise<OAuth2Client> {
    return new Promise((resolve, reject) => {
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token: any) => {
        if (err) {
          const authURL = this.getAuthURL();
          return reject(authURL);
        }
        oauth2Client.setCredentials(JSON.parse(token));
        return resolve(oauth2Client);
      });
    });
  }

  private getAuthURL() {
    return oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      // If you only need one scope you can pass it as a string
      scope: SCOPES
    });
  }

  public async setTokens(code: string) {
    // This will provide an object with the access_token and refresh_token.
    // Save these somewhere safe so they can be used at a later time.
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
    return this.saveTokenToFile(code);
  }

  private saveTokenToFile(token: string) {
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) return console.error(err);
      console.log('Token saved to', TOKEN_PATH);
    });
  }
}

export const DriveHandler = new Drive();