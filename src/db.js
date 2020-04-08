// import mongoose from "mongoose";
mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then(res => {
    console.log("Connected to db")
});

module.exports = mongoose;
