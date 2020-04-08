const Telegraf = require('telegraf');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = bot;
