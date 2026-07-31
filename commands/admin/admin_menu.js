const { isAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('adminmenu', (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

    const db = require('./database/db.js');
    const admin = db.prepare('SELECT * FROM admins WHERE user_id = ?').get(ctx.from.id);

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n🛡 *𝙿𝙰𝙽𝙽𝙴𝙰𝚄 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝚃𝙸𝙵*\n\nɴɪᴠᴇᴀᴜ : *${admin.level}*\n\n*ᴄᴏᴍᴍᴀɴᴅᴇs ᴅɪsᴘᴏɴɪʙʟᴇs :*\n/addcoins — ᴀᴊᴏᴜᴛᴇʀ ᴅᴇs ᴄᴏɪɴs\n/removecoins — ʀᴇᴛɪʀᴇʀ ᴅᴇs ᴄᴏɪɴs\n/userinfo — ɪɴғᴏs ᴜᴛɪʟɪsᴀᴛᴇᴜʀ\n/gift — ᴄʀᴇ́ᴇʀ ᴄᴏᴅᴇ ᴄᴀᴅᴇᴀᴜ\n/gifts — ʟɪsᴛᴇ ᴅᴇs ᴄᴏᴅᴇs\n/broadcast — ᴍᴇssᴀɢᴇ ᴇɴ ᴍᴀssᴇ\n/addtask — ᴀᴊᴏᴜᴛᴇʀ ᴜɴᴇ ᴛᴀ̂ᴄʜᴇ\n/listtasks — ʟɪsᴛᴇ ᴅᴇs ᴛᴀ̂ᴄʜᴇs\n/removetask — sᴜᴘᴘʀɪᴍᴇʀ ᴛᴀ̂ᴄʜᴇ\n/toggletask — ᴀᴄᴛɪᴠᴇʀ/ᴅᴇ́sᴀᴄᴛɪᴠᴇʀ ᴛᴀ̂ᴄʜᴇ\n/completetask — ᴠᴀʟɪᴅᴇʀ ᴛᴀ̂ᴄʜᴇ\n/channels — ʟɪsᴛᴇ ᴅᴇs ᴄʜᴀɪ̂ɴᴇs\n/state — ᴘᴀɴɴᴇᴀᴜ ᴅ'ᴇ́ᴛᴀᴛ\n/adminmenu — ᴘᴀɴɴᴇᴀᴜ ᴀᴅᴍɪɴɪsᴛʀᴀᴛɪғ\n/premiuminfo — ɪɴғᴏ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ᴘʀᴇᴍɪᴜᴍ\n━━━━━━━━━━━━━━━━━━━━` +
      { parse_mode: 'Markdown' }
    );
  });
};