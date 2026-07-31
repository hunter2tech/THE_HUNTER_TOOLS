const db = require('./database/db.js');

module.exports = (bot) => {
  bot.use(async (ctx, next) => {
    // Ignorer les updates sans utilisateur
    if (!ctx.from) return next();

    const isBanned = db.prepare('SELECT * FROM banned_users WHERE user_id = ?').get(ctx.from.id);

    if (isBanned) {
      // Bloquer silencieusement ou répondre
      if (ctx.message || ctx.callbackQuery) {
        // Répondre seulement aux messages directs
        try {
          await ctx.reply('🚫 ᴠᴏᴜs ᴀᴠᴇᴢ ᴇ́ᴛᴇ́ ʙᴀɴɴɪ ᴅᴜ ʙᴏᴛ. ᴠᴇᴜɪʟʟᴇᴢ ᴄᴏɴᴛᴀᴄᴛᴇʀ @anotherdev009 ᴘᴏᴜʀ ᴠᴏᴜs ғᴀɪʀᴇ ᴅᴇʙᴀɴɴɪʀ.');
        } catch (e) {}
      }
      return; // Ne pas continuer
    }

    return next();
  });
};