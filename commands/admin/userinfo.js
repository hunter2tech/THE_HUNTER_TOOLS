const db = require('./database/db.js');
const { formatNumber } = require('./utils/helpers.js');

module.exports = (bot) => {
  bot.command('userinfo', (ctx) => {
    const { isAdmin } = require('./utils/permissions.js');
if (!isAdmin(ctx.from.id)) return;

    const userId = parseInt(ctx.message.text.split(' ')[1]) || ctx.from.id;
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
    if (!user) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    const isBanned = db.prepare('SELECT * FROM banned_users WHERE user_id = ?').get(userId);
    const transactionCount = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?').get(userId).count;
    const taskCount = db.prepare('SELECT COUNT(*) as count FROM task_completions WHERE user_id = ?').get(userId).count;
    const referralCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE referred_by = ?').get(userId).count;

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n👤 *𝙸𝙽𝙵𝙾𝚂 𝚂𝚄𝚁 𝙻'𝚄𝚃𝙸𝙻𝙸𝚂𝙰𝚃𝙴𝚄𝚁*\n\n🆔 ɪᴅ : ${user.user_id}\n📛 ɴᴏᴍ : ${user.first_name}\n🔖 ᴜsᴇʀɴᴀᴍᴇ : @${user.username || 'N/A'}\n🪙 ᴄᴏɪɴs : ${formatNumber(user.coins)}\n💰 ᴛᴏᴛᴀʟ ɢᴀɢɴᴇ́ : ${formatNumber(user.total_earned)}\n🛒 ᴛᴏᴛᴀʟ ᴅᴇ́ᴘᴇɴsᴇ́ : ${formatNumber(user.total_spent)}\n👥 ғɪʟʟᴇᴜʟs : ${referralCount}\n📋 ᴛᴀ̂ᴄʜᴇs : ${taskCount}\n💳 ᴛʀᴀɴsᴀᴄᴛɪᴏɴs : ${transactionCount}\n🚫 ʙᴀɴɴɪ : ${isBanned ? 'ᴏᴜɪ' : 'ɴᴏɴ'}\n📅 ɪɴsᴄʀɪᴛ : ${user.joined_at}\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });
};