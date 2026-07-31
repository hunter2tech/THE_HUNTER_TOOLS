const db = require('./database/db.js');
const { isSuperAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('statistics', (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return ctx.reply('⛔ ᴄᴏᴍᴍᴀɴᴅᴇ ʀᴇ́sᴇʀᴠᴇ́ ᴀᴜ ᴘʀᴏᴘʀɪᴇ́ᴛᴀɪʀᴇ.');

    // Total des ventes
    const totalSales = db.prepare("SELECT COUNT(*) as count, SUM(amount) as total FROM transactions WHERE type = 'spend' AND description LIKE 'Achat:%'").get();
    const totalTransactions = totalSales.count || 0;
    const totalCoinsSpent = totalSales.total || 0;
    const totalCommission = Math.floor(totalCoinsSpent * (parseInt(process.env.COMMISSION_RATE || 100) / 100));

    // Stats par article
    const articles = db.prepare("SELECT description, COUNT(*) as count, SUM(amount) as total FROM transactions WHERE type = 'spend' AND description LIKE 'Achat:%' GROUP BY description ORDER BY count DESC").all();

    let message = `\n━━━━━━━━━━━━━━━━━━━━\n📊 *𝚂𝚃𝙰𝚃𝙸𝚂𝚃𝙸𝚀𝚄𝙴𝚂 𝙳𝙴𝚂 𝚅𝙴𝙽𝚃𝙴𝚂*\n\n🛒 ᴛᴏᴛᴀʟ ᴠᴇɴᴛᴇs : *${totalTransactions}*\n💰 ᴛᴏᴛᴀʟ ᴅᴇ́ᴘᴇɴsᴇ́ : *${totalCoinsSpent} ᴄᴏɪɴs*\n💎 ᴄᴏᴍᴍɪssɪᴏɴ : *${totalCommission} ᴄᴏɪɴs*\n\n`;

    if (articles.length === 0) {
      message += 'ᴀᴜᴄᴜɴᴇ ᴠᴇɴᴛᴇ ᴘᴏᴜʀ ʟᴇ ᴍᴏᴍᴇɴᴛ.';
    } else {
      // Article le plus / moins vendu
      const mostSold = articles[0];
      const leastSold = articles[articles.length - 1];

      message += `🏆 *ᴀʀᴛɪᴄʟᴇ ʟᴇ ᴘʟᴜs ᴠᴇɴᴅᴜ :* ${mostSold.description.replace('Achat: ', '')} (${mostSold.count} ᴠᴇɴᴛᴇs)\n📉 *ᴀʀᴛɪᴄʟᴇ ʟᴇ ᴍᴏɪɴs ᴠᴇɴᴅᴜ :* ${leastSold.description.replace('Achat: ', '')} (${leastSold.count} ᴠᴇɴᴛᴇs)\n\n*ᴅᴇ́ᴛᴀɪʟs ᴘᴀʀ ᴀʀᴛɪᴄʟᴇ :*\n`;
      for (const a of articles) {
        message += `• ${a.description.replace('Achat: ', '')} : ${a.count} ᴠᴇɴᴛᴇs, ${a.total} ᴄᴏɪɴs\n━━━━━━━━━━━━━━━━━━━━`;
      }
    }

    ctx.reply(message, { parse_mode: 'Markdown' });
  });
};