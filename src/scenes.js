words = require('./words');
models = require('./models/myModel');

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');
const moment = require('moment');

const testFile = new Scene('testFile');
const answerText = new Scene('answerText');
const sendTest = new Scene('sendTest');
const getAnswerID = new Scene('getAnswerID');
const getAnswer = new Scene('getAnswer');
const verify = new Scene('verify');
const getResult = new Scene('getResult');
const addTest = new Scene('addTest');
const sendResultID = new Scene('sendResultID');
const sendResults = new Scene('sendResults');

addTest.enter((ctx) => {
    ctx.scene.enter('answerText').then()
})
// addTest.on()

testFile.enter((ctx) => {
    ctx.reply(words.filePDF).then();
    console.log('iamadmin');
});
testFile.on('document', (ctx) => {
    if (ctx.message.document.file_name.split('.')[Array.length] === 'pdf') {
        ctx.session.fileId = ctx.message.document.file_id || '';
        ctx.scene.enter('answerText').then();
    } else {
        ctx.reply(`.pdj formatta fayl jiberin'!`)
    }
});

answerText.enter((ctx) => {
    ctx.reply(words.answer).then();
});
answerText.on('text', async (ctx) => {
    try {
        const answer = ctx.message.text.split('/');
        const n = parseInt(answer[0].trim())
        const answers = words.addSpace(answer[1]);
        if (answer.length > 1) {
            if (n === answers.split(/\s/g).length) {
                ctx.session.testId = words.randomID();
                await ctx.replyWithMarkdown(`Sizning ${n} savoldan iborat test qo'shdingiz!. Sizning testingiz IDsi`);
                await ctx.reply(ctx.session.testId);
                const test = await new models.Test({
                    testId: ctx.session.testId,
                    fileId: ctx.session.fileId || '',
                    correctAnswers: answers,
                    value: n
                });
                test.save();
                await ctx.scene.leave();
            } else {
                ctx.reply(`Savollar soni N, javoblar soniga tesh emas yoki test formati xato!`)
            }
        } else {
            ctx.reply(`Savollar soni N, javoblar soniga tesh emas yoki test formati xato!`)
        }
    } catch (e) {
        ctx.reply(`Xatolik kuzatildi. Iltimos, amalni boshidan boshlang`);
        await ctx.scene.leave();

    }
});

sendTest.enter((ctx) => {
    ctx.reply(words.sentTest).then()
});
sendTest.on('text', async (ctx) => {
    try {
        const fileId = await models.Test.find({
            testId: ctx.message.text
        }, 'fileId');
        if (fileId && fileId[0].fileId) {
            await ctx.reply(`Sizning Testingiz`);
            await ctx.telegram.sendDocument(`${ctx.chat.id}`, fileId[0].fileId);
            ctx.reply(`Javoblarni jo'natish uchun 'Javoblarni jo'natish' tugmachasini bosing`);
            await ctx.scene.leave();
        } else {
            ctx.reply(`Siz xato ID jo'natdingiz yoki bunday ID mavjud emas!`)
        }
    } catch (e) {
        ctx.reply(`Xatolik kuzatildi. Iltimos, amalni boshidan boshlang'`);
        await ctx.scene.leave();
    }
});

getAnswerID.enter(async (ctx) => {
    await ctx.reply(words.getAnswerID);
});
getAnswerID.on('text', async (ctx) => {
    const test_id = await models.Test.find({
        testId: ctx.message.text.trim()
    }, '_id correctAnswers');
    const is_there = await models.Result.find({}, 'userId')
        .populate({
            path: 'userId',
            select: 'user_id',
            match: {user_id: ctx.from.id}
        })
        .populate({
            path: 'test_Id',
            select: 'test_id',
            math: {test_id: ctx.message.text}
        });
    if (ctx.message.text[0] === '_' && test_id.length > 0) {
        if (!(is_there[0].test_Id && is_there[0].userId)) {
            ctx.session.getAnswerID = ctx.message.text || '';
            await ctx.scene.enter('getAnswer');
        } else {
            await ctx.reply(`Siz oldin bu testdan o'tgansiz. Iltimos, Test natijasini kuting!`);
            await ctx.scene.leave();
        }
    } else {
        ctx.reply(`Siz xato ID jo'natdingiz yoki bunday ID mavjud emas`);
    }

});

getAnswer.enter(async (ctx) => {
    await ctx.reply(words.getAnswer);

});
getAnswer.on('text', async (ctx) => {
    try {
        const user = await models.Users.findOneAndUpdate({username: ctx.from.username}, {
            user_id: ctx.from.id,
            username: ctx.from.username,
            fullName: `${ctx.from.first_name || ''} ${ctx.from.last_name || ''}`
        }, {new: true, upsert: true,});
        user.save();
        await ctx.scene.enter('verify')
    } catch (e) {
        ctx.reply(`Xatolik kuzatildi. Iltimos, amalni boshidan boshlang'`);
        await ctx.scene.leave();
    }
});

verify.enter(async (ctx) => {
    try {
        moment.locale('uz-latn');
        const now = moment().format('LLL:ss');
        ctx.session.answerUsers = ctx.message.text;
        const answer = ctx.message.text;
        const correctAnswer = await models.Test.find({
            testId: ctx.session.getAnswerID
        }, 'testId fileId correctAnswers value');
        const user = await models.Users.find({
            user_id: ctx.from.id
        }, 'username fullName');
        const result = words.checkAnswers(answer, correctAnswer[0].correctAnswers);
        const resultTest = new models.Result({
            resultBall: result.result,
            answerUsers: result.array.join(', '),
            test_Id: correctAnswer[0]._id,
            userId: user[0]._id,
            time: now
        });
        resultTest.save();
        await ctx.reply(`👤 Foydalanuvchi: ${user[0].fullName}\n🆔 Test IDsi: ${ctx.session.getAnswerID}\n✏️ Jami savollar: ${correctAnswer[0].value}\n✅ To'g'ri javoblar: ${result.result}\n🕐${now}`);
        await ctx.telegram.sendMessage('39656921', `${(user[0].username) ? (('@' + user[0].username || '')) : (user[0].fullName)} ${ctx.session.getAnswerID} - Test javoblarini jo'natdi \n(🕐${now} ✅: ${result.result})`)
        await ctx.scene.leave();
    } catch (e) {
        await ctx.reply(`Xatolik kuzatildi. Iltimos, amalni boshidan boshlang`);
        await ctx.scene.leave();
    }
});

getResult.enter((ctx) => {
    ctx.reply(words.getResult).then()
});
getResult.on('text', async (ctx) => {
    const test_id = await models.Test.find({
        testId: ctx.message.text
    }, '_id');
    if (ctx.message.text[0] === '_' && test_id) {
        const results = await models.Result.find({
            test_Id: test_id[0]
        }, 'resultBall userId time').sort({resultBall: -1, time: 1});
        let result = [];
        moment.locale('uz-latn');
        let k = 1;
        for (let i of results) {
            let j = await models.Users.find({
                _id: i.userId
            }, 'fullName username');
            result.push(`${k}. ${j[0].fullName || ''} ${(j[0].username) ? (('@' + j[0].username || '')) : ('')} Natija: ${i.resultBall}  (${moment(i.time).format('LLL:ss')})`);
            k += 1;
        }
        const send_results = await words.create_telegraph(result.join(';\n'))
        await ctx.reply(send_results.url);
        await ctx.scene.leave();
    } else {
        ctx.reply(`Siz xato ID jo'natdingiz yoki bunday ID mavjud emas`);
    }
});

sendResultID.enter(async (ctx) => {
    await ctx.reply(words.sendResultID);
})
sendResultID.on('text', async (ctx) => {
    const test_id = await models.Test.find({
        testId: ctx.message.text.trim()
    }, '_id');
    if (test_id.length > 0) {
        ctx.session.sendResultID = test_id;
        await ctx.scene.enter('sendResults')
    } else {
        await ctx.reply(`Siz xato ID jo'natdingiz yoki bunday ID mavjud emas!`)
    }
})

sendResults.enter(async (ctx) => {
    await ctx.reply(`Barcha natijalarni jo'natish.. \n   Ha - Yo'q`, Markup.keyboard(['Ha', `Yo'q`]).oneTime().resize().extra());
})
sendResults.on('text', async (ctx) => {
    if (ctx.message.text === 'Ha') {

        const test_id = ctx.session.sendResultID;
        const users = await models.Users.find({}, '_id user_id');
        for (i of users) {
            const result = await models.Result.find({
                test_Id: test_id[0]._id,
                userId: i._id
            }, 'resultBall answerUsers');
            if (await result.length > 0) {
                ctx.telegram.sendMessage(i.user_id, `Siz ${result[0].resultBall.toString()} savolga to'g'ri javob berdingiz. Test javoblari natijasi quyidagicha: \n\n${result[0].answerUsers}`).then(function (resp) {
                }).catch(function (error) {
                    if (error.response && error.response.statusCode === 403) {
                        console.log(error);
                    }
                });
            }
        }
        await ctx.reply(`Natijalar yetkazildi!`, {reply_markup: {remove_keyboard: true}});
        await ctx.scene.leave()
    } else {
        await ctx.reply(`Natijalarni yetkazish bekor qilindi!`, {reply_markup: {remove_keyboard: true}});
        await ctx.scene.leave()
    }
})

module.exports = {
    testFile,
    answerText,
    sendTest,
    getAnswerID,
    getAnswer,
    verify,
    getResult,
    addTest,
    sendResults,
    sendResultID
};
