words = require('./words');
models = require('./models/myModel');

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

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
        const answers = words.addSpice(answer[1]);
        if (answer.length > 1) {
            if (n === answers.split(/\s/g).length) {
                ctx.session.testId = words.randomID();
                await ctx.replyWithMarkdown(`Siz ${n} sorawli test jiberdin'iz!. Sizdin test ID'in'iz to'mendegishe`);
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
                ctx.reply(`Testin'isti' sani N, juwaplar sanina ten' emes yamasa test formati qa'te!`)
            }
        } else {
            ctx.reply(`Testin'isti' sani N, juwaplar sanina ten' emes yamasa test formati qa'te!`)
        }
    } catch (e) {
        ctx.reply(`Qa'telik boldi. A'meldi bastan baslan'`);
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
            await ctx.reply(`Sizdin' Testin'is`);
            await ctx.telegram.sendDocument(`${ctx.chat.id}`, fileId[0].fileId);
            ctx.reply(`Juwap jiberiwden aldin /juwap komandasin jiberin'`);
            await ctx.scene.leave();
        } else {
            ctx.reply(`Siz qa'te test ID jiberdin'is yaki bunday ID li test joq!`)
        }
    } catch (e) {
        ctx.reply(`Qa'telik boldi. A'meldi bastan baslan'`);
        await ctx.scene.leave();
    }
});

getAnswerID.enter(async (ctx) => {
    await ctx.reply(words.getAnswerID);
});
getAnswerID.on('text', async (ctx) => {
    const test_id = await models.Test.find({
        testId: ctx.message.text.trim()
    }, '_id');
    if (ctx.message.text[0] === '_' && test_id) {
        ctx.session.getAnswerID = ctx.message.text || '';
        await ctx.scene.enter('getAnswer');
    } else {
        ctx.reply(`Qa'te ID jiberdin'iz`);
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
        ctx.reply(`Qa'telik boldi. A'meldi bastan baslan'`);
        await ctx.scene.leave();
    }
});

verify.enter(async (ctx) => {
    try {
        ctx.session.answerUsers = ctx.message.text;
        const answer = ctx.message.text;
        const correctAnswer = await models.Test.find({
            testId: ctx.session.getAnswerID
        }, 'testId fileId correctAnswers value');
        const user = await models.Users.find({
            user_id: ctx.from.id
        }, 'resultBall test_Id fullName');
        const result = words.checkAnswers(answer, correctAnswer[0].correctAnswers);
        const resultTest = new models.Result({
            resultBall: result.result.toString(),
            answerUsers: result.array.toString(),
            test_Id: correctAnswer[0]._id,
            userId: user[0]._id
        });
        resultTest.save();
        await ctx.replyWithMarkdown(`Siz ${result.result} sorawg'a duris juwap berdin'is!`);
        await ctx.scene.leave();
    } catch (e) {
        await ctx.reply(`Qa'telik boldi. A'meldi basinan baslan'`);
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
        }, 'resultBall userId').sort({resultBall: -1});
        let result = [];
        for (let i of results) {
            let j = await models.Users.find({
                _id: i.userId
            }, 'fullName username');
            result.push(`${j[0].fullName || ''} ${(j[0].username) ? (('@' + j[0].username || '')) : ('')} Natije: ${i.resultBall}`);
        }
        ctx.reply(result.join(';\n'));
        await ctx.scene.leave();
    } else {
        ctx.reply(`Qa'te ID jiberdin'iz`);
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
        await ctx.reply(`Siz qa'te ID jiberdin'iz!`)
    }
})

sendResults.enter(async (ctx) => {
    await ctx.reply(`Na'tiyjelerdi jiberiw.. \n   Awa - Yaq`, Markup.keyboard(['Awa', 'Yaq']).oneTime().resize().extra());
})
sendResults.on('text', async (ctx) => {
    if (ctx.message.text === 'Awa') {
        await ctx.reply(`Na'tiyjeler jiberildi!`, {reply_markup: {remove_keyboard: true}});
        const test_id = ctx.session.sendResultID;
        const users = await models.Users.find({}, '_id user_id');
        for (i of users) {
            const result = await models.Result.find({
                test_Id: test_id[0]._id,
                userId: i._id
            }, 'resultBall answerUsers');
            if (await result.length > 0) {
                await ctx.telegram.sendMessage(i.user_id, `Siz ${result[0].resultBall.toString()} sorawg'a juwap berdin'iz. Juwaplar na'tiyjesi to'mendegishe: `);
                await ctx.telegram.sendMessage(i.user_id, `${result[0].answerUsers}`);
            }
        }
        await ctx.scene.leave()
    } else {
        await ctx.reply(`Na'tiyjelerdi jiberiw biykar etildi!`, {reply_markup: {remove_keyboard: true}});
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
