module.exports = (bot) => {
  bot.command('shop', (ctx) => ctx.scene.enter('shop-wizard'));
};