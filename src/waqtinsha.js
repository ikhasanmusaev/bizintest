const Telegraf = require('telegraf');
const TelegrafFlow = require('telegraf-flow');
const {Scene, enter, leave} = TelegrafFlow;

require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

// Greeter scene
const greeterScene = new Scene('greeter');
greeterScene.enter((ctx) => ctx.reply('Hi'));
greeterScene.leave((ctx) => ctx.reply('Buy'));
greeterScene.hears(/hi/gi, leave());

greeterScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'));
// Echo scene
const echoScene = new Scene('echo');
echoScene.enter((ctx) => ctx.reply('echo scene'));
echoScene.leave((ctx) => ctx.reply('exiting echo scene'));
echoScene.command('back', leave());
echoScene.on('text', (ctx) => ctx.reply(ctx.message.text));

echoScene.on('message', (ctx) => ctx.reply('Only text messages please'));
const flow = new TelegrafFlow([greeterScene, echoScene], {ttl: 10});
// bot.use(Telegraf.memorySession());
bot.use(flow.middleware());
bot.command('help', (ctx) => ctx.reply('Help message'));
bot.command('greeter', enter('greeter'));
bot.command('echo', enter('echo'));

bot.startPolling();
