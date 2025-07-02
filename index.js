
const venom = require('venom-bot');
const axios = require('axios');
const fs = require('fs');

venom
  .create()
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });

function start(client) {
  client.onMessage(async (message) => {
    if (message.body.startsWith('.fb') && message.isGroupMsg === false) {
      const url = message.body.split(' ')[1];
      if (!url) {
        client.sendText(message.from, 'يرجى إرسال رابط فيسبوك بعد الأمر مثل:\n.fb https://facebook.com/...');
        return;
      }

      client.sendText(message.from, '🔄 جاري تحميل الفيديو، يرجى الانتظار...');

      try {
        const response = await axios.get(`https://api.snapsave.app/action.php?url=${encodeURIComponent(url)}`);
        const links = response.data.data;

        if (!links || links.length === 0) {
          client.sendText(message.from, '❌ لم يتم العثور على فيديو في الرابط المُرسل.');
          return;
        }

        const videoLink = links[0].url;
        await client.sendFileFromUrl(message.from, videoLink, 'video.mp4', '✅ تم تحميل الفيديو بنجاح');
      } catch (err) {
        console.error(err);
        client.sendText(message.from, '❌ حدث خطأ أثناء تحميل الفيديو. تأكد من الرابط وحاول مجددًا.');
      }
    }
  });
}
