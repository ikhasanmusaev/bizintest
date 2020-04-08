const Stage = require('telegraf/stage');
const session = require('telegraf/session');
const Markup = require('telegraf/markup');

const bot = require('./bot');
require('dotenv').config();
require('./db');
models = require('./models/myModel');
words = require('./words');

scenes = require('./scenes');

const stage = new Stage();
stage.command('cancel', ctx => {
    ctx.reply(`Siz shig'iwdi bastin'is, a'meldi basinan baslan'!`);
    ctx.scene.leave();
});

stage.register(scenes.testFile);
stage.register(scenes.answerText);
stage.register(scenes.sendTest);
stage.register(scenes.getAnswerID);
stage.register(scenes.getAnswer);
stage.register(scenes.verify);
stage.register(scenes.getResult);
bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
    const message = ctx.message;
    await ctx.telegram.sendMessage(message.chat.id, words.start);
    // ctx.reply(`🆔 di basin'`, Markup.keyboard(['🆔']).oneTime().resize().extra());
});
//
bot.command('iamadmin', (ctx) => {
    ctx.scene.enter('testFile');
});

bot.command('test', ((ctx) => {
    ctx.scene.enter('sendTest');
}));

bot.command('juwap', (ctx) => {
    ctx.scene.enter('getAnswerID');
});

bot.command('/result', (ctx) => {
    ctx.scene.enter('getResult');
});

bot.startPolling();
