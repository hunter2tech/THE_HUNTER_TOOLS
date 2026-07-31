require('dotenv').config();
const { Telegraf, Scenes, session } = require('telegraf');
const shopScene = require('./scenes/shop.scene.js');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Middleware session
bot.use(session());

// Enregistrer la scène
const stage = new Scenes.Stage([shopScene]);
bot.use(stage.middleware());

module.exports = bot;