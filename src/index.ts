
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import ngrok from 'ngrok';
import { Telegraf, Context } from 'telegraf';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bot = new Telegraf<Context>(process.env.BOT_TOKEN || "");
const isProduction: boolean = process.env.NODE_ENV === "production";


// Set up your bot webhook URL
let webhookUrl = '';

// Use ngrok to expose your local server to the internet
if (!isProduction) {
(async () => {
  try {
    webhookUrl = await ngrok.connect({
      addr: 3000,
      //authtoken: 'YOUR_NGROK_AUTH_TOKEN',
    });
    console.log(`Webhook URL: ${webhookUrl}`);
    bot.telegram.setWebhook(`${webhookUrl}/bot${process.env.BOT_TOKEN}`)
   console.log(`webhook set ke : ${webhookUrl}/bot${process.env.BOT_TOKEN}`)
  } catch (error) {
    console.error('Error connecting to ngrok', error);
  }
})();
} else {
 bot.telegram.setWebhook(`https://${process.env.WEBHOOK_DOMAIN}/bot${process.env.BOT_TOKEN}`)
 
 console.log(`webhook set ke : https://${process.env.WEBHOOK_DOMAIN}/bot${process.env.BOT_TOKEN}`)
 
}

// Handle incoming updates from Telegram
app.post(`/bot${process.env.BOT_TOKEN}`, async (req: Request, res: Response) => {
  try {

    await bot.handleUpdate(req.body);
    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Send a welcome message to new users
bot.start(async (ctx) => {
  const user = ctx.from;
  await ctx.reply(`Welcome to my bot, ${user.first_name}!`);
});

// Start the Express server
app.listen(3000, () => {
  console.log('Express server started on port 3000');
});

export default app;