const { Telegraf } = require('telegraf')

const express = require('express');
const ngrok = require('ngrok');
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();



// menambahkan handler
bot.hears('hello', (ctx) => {
  ctx.reply('Hello World');
});

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
// Production mode
/*
if (process.env.NODE_ENV === 'production') {
  app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));
  bot.telegram.setWebhook(`https://yourdomain.com/bot${process.env.BOT_TOKEN}`);
  app.get('/', (req, res) => res.send('Bot is running on production'));
}
// Development mode
else {
  bot.start((ctx) => {
    ctx.reply('Welcome to my bot!');
  });

  bot.on('text', (ctx) => {
    ctx.reply('You said: ' + ctx.message.text);
  });

  // Delete existing webhook before setting up new webhook
  bot.telegram.deleteWebhook();

  // Start ngrok to create a public webhook URL
  ngrok.connect(3000)
    .then(url => {
      console.log(`Webhook set up! Public URL is: ${url}`);
      bot.telegram.setWebhook(`${url}/bot${process.env.BOT_TOKEN}`);
      app.listen(3000, () => {
        console.log('Bot is running on development mode');
      });
    })
    .catch(err => {
      console.error('Error setting up ngrok', err);
      process.exit(1);
    });
}

// Start the bot
*/

// set webhook tergantung pada kondisi development atau production
if (process.env.NODE_ENV === 'production') {
  const port = process.env.PORT || 3000;
 // app.use(bot.webhookCallback('/5824625543:AAEslB26tupftKCDQTs0OULDa1uYWxv6XfM'));
  //bot.telegram.setWebhook(`https://test-bot-vercel.vercel.app`);
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} else {
  const ngrok = require('ngrok');
  (async function () {
   await bot.telegram.deleteWebhook()
    const url = await ngrok.connect(3000);
    console.log(`Bot running at ${url}`);
   // bot.telegram.setWebhook(`${url}/${process.env.BOT_TOKEN}`);
  })();
}

bot.launch();

// Export the app for Vercel
module.exports = app;
