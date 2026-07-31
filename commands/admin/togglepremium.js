const db = require('./database/db.js');
const { isSuperAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('togglepremium', (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return;

    const itemId = parseInt(ctx.message.text.split(' ')[1]);
    if (!itemId) return ctx.reply('❓ ᴜsᴀɢᴇ : /togglepremium <ɪᴅ_ᴀʀᴛɪᴄʟᴇ>');

    const item = db.prepare('SELECT * FROM shop_items WHERE id = ?').get(itemId);
    if (!item) return ctx.reply('❌ ᴀʀᴛɪᴄʟᴇ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    const newStatus = item.premium_only ? 0 : 1;
    db.prepare('UPDATE shop_items SET premium_only = ? WHERE id = ?').run(newStatus, itemId);

    ctx.reply(
      `✅ ᴀʀᴛɪᴄʟᴇ #${itemId} "${item.name}" : ${newStatus ? '💎 ᴘʀᴇᴍɪᴜᴍ ᴜɴɪǫᴜᴇᴍᴇɴᴛ' : '🌐 ᴛᴏᴜᴛ ᴘᴜʙʟɪᴄ'}`
    );
  });
};