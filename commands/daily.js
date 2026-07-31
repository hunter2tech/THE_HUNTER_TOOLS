const db = require('./database/db.js');

module.exports = (bot) => {
  bot.command('daily', (ctx) => {
    const userId = ctx.from.id;
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);

    if (!user) return ctx.reply('❌ ғᴀɪᴛᴇs /start ᴅ\'ᴀʙᴏʀᴅ.');

    const now = new Date();
    const lastDaily = user.last_daily ? new Date(user.last_daily) : null;

    // Vérifier si 24h sont passées
    if (lastDaily && (now - lastDaily) < 24 * 60 * 60 * 1000) {
      const remaining = new Date(24 * 60 * 60 * 1000 - (now - lastDaily));
      const hours = remaining.getUTCHours();
      const minutes = remaining.getUTCMinutes();
      return ctx.reply(`⏳ᴠᴏᴜs ᴀᴠᴇᴢ ᴅᴇ́ᴊᴀ̀ ʀᴇ́ᴄᴜᴘᴇ́ʀᴇ́ ᴠᴏᴛʀᴇ ʙᴏɴᴜs ǫᴜᴏᴛɪᴅɪᴇɴ. ʀᴇᴠᴇɴᴇᴢ ᴅᴀɴs ${hours}ʜ ${minutes}ᴍɪɴ.`);
    }

    // Bonus aléatoire
    const bonus = Math.floor(Math.random() * 41) + 10; // 10-50 coins

    db.prepare('UPDATE users SET coins = coins + ?, last_daily = ?, total_earned = total_earned + ? WHERE user_id = ?')
      .run(bonus, now.toISOString(), bonus, userId);

    db.prepare('INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)')
      .run(userId, 'daily', bonus, 'Récompense quotidienne');

    ctx.reply(`🎁 ᴠᴏᴜs ᴀᴠᴇᴢ ʀᴇᴄ̧ᴜ *${bonus} ᴄᴏɪɴs* ! ᴍᴇʀᴄɪ ᴘᴏᴜʀ ᴠᴏᴛʀᴇ ғɪᴅᴇ́ʟɪᴛᴇ́ ᴇᴛ ᴀ ᴅᴇᴍᴀɪɴ ᴘᴏᴜʀ ᴜɴ ᴘʀᴏᴄʜᴀɪɴ ʙᴏɴᴜs.`, { parse_mode: 'Markdown' });
  });
};