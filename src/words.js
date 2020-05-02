const telegraph = require('telegraph-node');
const ph = new telegraph();
token = 'c0e38b3da59b03a2fb8b7fdc8bdd8c3335fb370e1b970a8543c5c4e426df';

const start = `Salom men BOT\n. Test javoblarini jo'natish uchun 'Javoblarni jo'natish' tugmachasini bosing.`;
const filePDF = `Testingizni .pdf ko'rinishida menga jo'nating`;
const answer = `Testingiz javoblarini N/1a2b3c...Nd formatida menga jo'nating.\n (N - savollar soni.)`;
const sentTest = `Test IDsini jo'nating`;
const getAnswerID = `Avval Test IDsini jo'nating`;
const getAnswer = `Javoblaringizni quyidagicha formatta jo'nating'. \n \n 1a2b...30d\n(Javoblar orasida bo'sh joy qoldirish yoki qoldirmaslik hech qanday ahamiyatga ega emas)`;
const getResult = `Natijalarni olish uchun avval Test IDsini jo'nating`;
const sendResultID = `Natijalarni jo'natish uchun avval Test IDsini jo'nating`;


String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function randomID() {
    return '_' + Math.random().toString(36).substr(2, 5);
}

function checkAnswers(answer, correctAnswer) {
    let result = 0;
    let cAnswer = correctAnswer;
    let aAnswer = addSpace(answer.trim());
    let i = 1;
    let array = [];
    while (correctAnswer.search(i.toString()) + 1) {
        // if (cAnswer[i] === aAnswer[i]) result += 1;
        if (cAnswer[cAnswer.search(i.toString()) + i.toString().length] === aAnswer[aAnswer.search(i.toString()) + i.toString().length]) {
            result += 1;
            array.push(i.toString().concat(' ', `to'g'ri`));
        } else {
            array.push(i.toString().concat(' ', `javob: "`, `${cAnswer[cAnswer.search(i.toString()) + i.toString().length]}`, '"'));
        }
        i += 1;
    }
    return {result, array}
}

function addSpace(text) {
    juwap = text.replace(/(\r\n|\n|\r|\s)/gm, '').toLowerCase();
    let i = 1;
    while (juwap.search(i.toString()) + 1) {
        juwap = juwap.splice(juwap.search(i.toString()) + i.toString().length + 1, 0, ' ');
        i += 1
    }
    return juwap.trim().replace(/\s\s/g, ' ')
}

async function create_telegraph(content) {
    return await ph.createPage(token, 'Test results', [{children: [content]}], {
        return_content: true
    })
}

module.exports = {
    start,
    filePDF,
    answer,
    sentTest,
    getAnswerID,
    getAnswer,
    getResult,
    randomID,
    checkAnswers,
    addSpace,
    sendResultID,
    create_telegraph
};
