const { isSuperAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('super', (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return;

    const message = 
      `━━━━━━━━━━━━━━━━━━━━\n👨‍💻 *𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝙴𝚂 𝙿𝚁𝙾𝙿𝚁𝙸𝙴́𝚃𝙰𝙸𝚁𝙴*\n\n/ban - ʙᴀɴɴɪʀ ᴜɴ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ\n/unban - ᴅᴇ́ʙᴀɴɴɪʀ ᴜɴ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ\n/delgift - ᴅᴇ́sᴀᴄᴛɪᴠᴇʀ ᴜɴ ᴄᴏᴅᴇ ᴅᴜ\n/addchannel - ᴀᴊᴏᴜᴛᴇʀ ᴜɴᴇ ᴄʜᴀɪɴᴇ\n/delchannel - sᴜᴘᴘʀɪᴍᴇʀ ᴜɴᴇ ᴄʜᴀɪ̂ɴᴇ\n/togglechannel - (ᴅᴇ́s)ᴀᴄᴛɪᴠᴇʀ ᴜɴᴇ ᴄʜᴀɪ̂ɴᴇ\n/addpremium - ᴀᴊᴏᴜᴛᴇʀ ᴜɴ ᴘʀᴇᴍɪᴜᴍ\n/removepremium - ʀᴇ́ᴠᴏǫᴜᴇʀ ᴜɴ ᴘʀᴇᴍɪᴜᴍ\n/togglepremium - (ᴅᴇ́s)ᴀᴄᴛɪᴠᴇʀ ᴜɴ ᴘʀᴇᴍɪᴜᴍ\n/addadmin - ᴀᴊᴏᴜᴛᴇʀ ᴜɴ ᴀᴅᴍɪɴ\n/removeadmin - ʀᴇᴛɪʀᴇʀ ᴜɴ ᴀᴅᴍɪɴ\n/admins - ʟɪsᴛᴇ ᴅᴇs ᴀᴅᴍɪɴs\n/statistics - sᴛᴀᴛɪsᴛɪǫᴜᴇs ᴅᴇs ᴠᴇɴᴛᴇs\n━━━━━━━━━━━━━━━━━━━━`;

    ctx.reply(message, { parse_mode: 'Markdown' });
  });
};