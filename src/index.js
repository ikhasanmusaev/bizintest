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
stage.register(scenes.addTest);
stage.register(scenes.sendResultID);
stage.register(scenes.sendResults);
bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
    const message = ctx.message;
    await ctx.telegram.sendMessage(message.chat.id, words.start);
    await ctx.reply(`Juwaplardi jiberiw di basin'`, Markup.keyboard(['Juwaplardi jiberiw']).oneTime().resize().extra())
});
//
bot.command('iamadmin', async (ctx) => {
    await ctx.scene.enter('testFile')
});

bot.command('addtest', async (ctx) => {
    await ctx.scene.enter('answerText').then()
})

bot.command('test', (async (ctx) => {
    await ctx.scene.enter('sendTest')
}));

bot.hears('Juwaplardi jiberiw', async (ctx) => {
    await ctx.scene.enter('getAnswerID')
});

bot.command('result', async (ctx) => {
    await ctx.scene.enter('getResult')
});

bot.command('sendresult', async ctx =>{
    await ctx.scene.enter('sendResultID')
})

bot.on('text', async (ctx) => {
    await ctx.reply(`Siz joq bolg'an buyriqti bajerdin'iz. Iltimas, a'meldi qayta teksirin'`);
    await ctx.scene.leave();
})


bot.startPolling();
