import { WebClient, ErrorCode } from '@slack/web-api';
const web = new WebClient(process.env.SLACK_TOKEN);

(async () => {
  try {
    const res = await web.auth.test()
    const userId: any = res.user_id
    // Use the `chat.postMessage` method to send a message from this app
    await web.chat.postMessage({
      channel: userId,
      text: `My nice message from a test slack bot`,
    });

    console.log('Message posted!');
  } catch (error) {
    // Check the code property, and when its a PlatformError, log the whole response.
    if (error.code === ErrorCode.PlatformError) {
      console.log(error.data);
    } else {
      // Some other error, oh no!
      console.log('Well, that was unexpected.');
    }
  }
})()