const start = `Salam men BOT\n. Isleyjaq bolg'an testin'izdin' ID sin mag'an jiberin'. Onin' ushin 'Juwaplardi jiberiw' knopkasin basin'.\n Eger test qosiwdi qalesen'iz @ikhasanmusaev'qa qabarlasin'.`;
const filePDF = `Testin'izdi .pdf ko'rinisinde mag'an jiberin'`;
const answer = `Testin'izdin' juwaplarin N/1a2b3c...Nd formatinda jiberin'.\n (N - sorawlar sani.)`;
const sentTest = `Islemekshi bolg'an testin'izdin' ID sin jiberin'`;
const getAnswerID = `Jibermekshi bolg'an juwaplarin'istin' Testinin' ID sin jiberin'`;
const getAnswer = `Endi juwaplarin'izdi to'mendegishe formatta jiberin'. \n \n 1a2b...30d. \nIltimas juaplardi duris belgilegenin'izdi tekserin'`;
const getResult = `Almaqshi bolg'an natijelerin'izdin' test ID sin jiberin'`;
const sendResultID = `Jibermekshi bolg'an na'tiyjelerin'istin' Testinin' ID sin jiberin'`;


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
    while (answer.search(i.toString()) + 1) {
        // if (cAnswer[i] === aAnswer[i]) result += 1;
        if (cAnswer[cAnswer.search(i.toString()) + i.toString().length] === aAnswer[aAnswer.search(i.toString()) + i.toString().length]) {
            result += 1;
            array.push(i.toString().concat(' ', `duris`));
        } else {
            array.push(i.toString().concat(' ', `juwabi: "`, `${cAnswer[cAnswer.search(i.toString()) + i.toString().length]}`, '"'));
        }
        i += 1;
    }
    return {result, array}
}

function addSpace(text) {
    juwap = text.replace(/(\r\n|\n|\r|\s)/gm, '').toLowerCase()
    let i = 1;
    while (juwap.search(i.toString()) + 1) {
        juwap = juwap.splice(juwap.search(i.toString()) + i.toString().length + 1, 0, ' ');
        i += 1
    }
    return juwap.trim().replace(/\s\s/g, ' ')
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
    sendResultID
};
