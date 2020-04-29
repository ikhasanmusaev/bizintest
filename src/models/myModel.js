mongoose = require('mongoose');
Schema = mongoose.Schema;

const Users = mongoose.model('users', new Schema({
    user_id:{type:String},
    username:{type:String, unique: true, dropDups: true},
    fullName:{type:String}
}));

const Test = mongoose.model('Test', new Schema({
    testId: {type: String, unique: true, dropDups: true },
    fileId: {type: String, required: false},
    correctAnswers: {type: String},
    value: {type: Number}
}));

const Result = mongoose.model('Result', new Schema({
    resultBall: {type:Number},
    answerUsers: {type: String},
    test_Id: {type: Schema.Types.ObjectId, ref: 'Test'},
    userId: {type:Schema.Types.ObjectId, ref: 'Users'},
    time: {type:String}
}));

module.exports = {Users, Test, Result};
