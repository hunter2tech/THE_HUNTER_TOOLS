const db = require('./database/db.js');

module.exports = (bot) => {
  bot.command('state', (ctx) => {
    const { isAdmin } = require('./utils/permissions.js');
if (!isAdmin(ctx.from.id)) {
      return ctx.reply('⛔ ᴄᴏᴍᴍᴀɴᴅᴇ ᴜɴɪǫᴜᴇᴍᴇɴᴛ ᴘᴏᴜʀ ʟᴇs ᴀᴅᴍɪɴs.');
    }

    const stats = db.prepare('SELECT * FROM admin_stats WHERE id = 1').get();
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalCoins = db.prepare('SELECT SUM(coins) as total FROM users').get().total;

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n📊 *𝙿𝙰𝙽𝙽𝙴𝙰𝚄 𝙳'𝙴́𝚃𝙰𝚃*\n\n👥 ᴜᴛɪʟɪsᴀᴛᴇᴜʀs : *${totalUsers}*\n💰 ᴄᴏɪɴs ᴇɴ ᴄɪʀᴄᴜʟᴀᴛɪᴏɴ : *${totalCoins || 0}*\n⭐ sᴛᴀʀs ɢᴀɢɴᴇ́ᴇs : *${stats?.total_stars_earned || 0}*\n💎 ᴠᴏʟᴜᴍᴇ ᴛʀᴀɴs : *${stats?.total_transactions_value || 0} ᴄᴏɪɴs*\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });
};