const start = `Salam men BOT\n. Isleyjaq bolg'an testin'istin' ID sin mag'an jiberin'. Onin' ushin /juwap komandasin jiberin'.\n Eger test qosiwdi qalesenis @ikhasanmusaev'qa qabarlasin.`;
const filePDF = `Testin'isti .pdf ko'rinisinde mag'an jiberin'`;
const answer = `Testin'istin' juwaplarin N/1a 2 b 3c ... Nd formatinda jiberin'.\n (N - sorawlar sani.)`;
const sentTest = `Islemekshi bolg'an testin'istin' ID sin jiberin'`;
const getAnswerID = `Jibermekshi bolg'an juwaplarin'istin' Testinin' ID sin jiberin'`;
const getAnswer = `Endi juwaplarin'isti to'mendegishe formatta jiberin'. \n \n 1a 2b ... 30d`;
const getResult = `Almaqshi bolg'an natijelerin'istin' test ID sin jiberin'`;

function randomID(){
    return '_' + Math.random().toString(36).substr(2, 5);
}

function checkAnswers(answer, correctAnswer){
    let result = 0;
    let cAnswer = correctAnswer.split('/')[1].trim().split(' ');
    let aAnswer = answer.trim().split(' ');
    for (let i = 0; i < answer.split(' ').length; i++){
        if (cAnswer[i] === aAnswer[i]) result += 1;
    }
    return result
}

function calculateResults(){

}

module.exports = {start, filePDF, answer, sentTest, getAnswerID, getAnswer, getResult, randomID, checkAnswers};
