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
    ctx.reply(`Siz chiqish buyrug'ini jo'natdingiz, amalni boshidan boshlang!`);
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
    try {
        const message = ctx.message;
        await ctx.telegram.sendMessage(message.chat.id, words.start);
        await ctx.reply(`'Javoblarni jo'natish'ni bosing`, Markup.keyboard(['Javoblarni jo\'natish']).oneTime().resize().extra())
    } catch (error) {
        if (error.response && error.response.statusCode === 403) {
            console.log(error);
        } else {
            console.log(error);
        }
    }
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

bot.hears('Javoblarni jo\'natish', async (ctx) => {
    await ctx.scene.enter('getAnswerID')
});

bot.command('result', async (ctx) => {
    await ctx.scene.enter('getResult')
});

bot.command('sendresult', async ctx => {
    await ctx.scene.enter('sendResultID')
})

bot.on('text', async (ctx) => {
    await ctx.reply(`Siz mavjud bo'lmagan buyruqni jo'natdingiz. Iltimos, amalni qayta tekshiring!`);
    await ctx.scene.leave();
})


bot.startPolling();
