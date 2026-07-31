const { isAdmin, isSuperAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('help', async (ctx) => {
    const userId = ctx.from.id;
    let message = '━━━━━━━━━━━━━━━━━━━━\n📋 𝙻𝙸𝚂𝚃𝙴 𝙳𝙴𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝙴𝚂\n\n';

    // 👤 Commandes utilisateur
    message += '*👤 𝚄𝚃𝙸𝙻𝙸𝚂𝙰𝚃𝙴𝚄𝚁*\n';
    message += '/start - ᴅᴇ́ᴍᴀʀʀᴇʀ ʟᴇ ʙᴏᴛ\n';
    message += '/profile - ᴠᴏɪʀ ᴠᴏᴛʀᴇ ᴘʀᴏғɪʟ\n';
    message += '/daily - ʀᴇ́ᴄᴏᴍᴘᴇɴsᴇ ǫᴜᴏᴛɪᴅɪᴇɴɴᴇ\n';
    message += '/shop - ᴘᴀʀᴄᴏᴜʀɪʀ ʟᴇs la ʙᴏᴜᴛɪǫᴜᴇ\n';
    message += '/buycoins - ᴀᴄʜᴇᴛᴇʀ ᴅᴇs ᴄᴏɪɴs\n';
    message += '/referral - ᴠᴏᴛʀᴇ ʟɪᴇɴ ᴅᴇ ᴘᴀʀʀᴀɪɴᴀɢᴇ\n';
    message += '/tasks - ᴛᴀ̂ᴄʜᴇs ᴅɪsᴘᴏɴɪʙʟᴇs ᴘᴏᴜʀ ɢᴀɢɴᴇʀ ᴅᴇs ᴄᴏɪɴs\n';
    message += '/claim - ᴜᴛɪʟɪsᴇʀ ᴜɴ ᴄᴏᴅᴇ ᴄᴀᴅᴇᴀᴜ\n';
    message += '/transfer - ᴛʀᴀɴsғᴇ́ʀᴇʀ ᴅᴇs ᴄᴏɪɴs ᴀ̀ ᴜɴ ᴀᴍɪ\n';
    message += '/feedback - ᴇɴᴠᴏʏᴇʀ ᴜɴ ᴍᴇssᴀɢᴇ ᴀ̀ ʟ\'ᴀᴅᴍɪɴ\n';
    message += '/ping - ᴠᴇ́ʀɪғɪᴇʀ ʟ\'ᴇ́ᴛᴀᴛ ᴅᴜ ʙᴏᴛ\n';
    message += '/help - ʟɪsᴛᴇ ᴅᴇs ᴄᴏᴍᴍᴀɴᴅᴇs\n━━━━━━━━━━━━━━━━━━━━';

    // 🛡️ Commandes Admin
    if (isAdmin(userId)) {
      message += '\n*🛡️ 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝚃𝙴𝚄𝚁*\n';
      message += '/adminmenu - ᴠᴏɪʀ ʟᴇs ᴄᴏᴍᴍᴀɴᴅᴇs ᴀᴅᴍɪɴ\n';
      message += '/addcoins - ᴀᴊᴏᴜᴛᴇʀ ᴅᴇs ᴄᴏɪɴs\n';
      message += '/removecoins - ʀᴇᴛɪʀᴇʀ ᴅᴇs ᴄᴏɪɴs\n';
      message += '/userinfo - ɪɴғᴏs sᴜʀ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ\n';
      message += '/gift - ᴄʀᴇ́ᴇʀ ᴜɴ ᴄᴏᴅᴇ ᴄᴀᴅᴇᴀᴜ\n';
      message += '/gifts - ʟɪsᴛᴇ ᴅᴇs ᴄᴏᴅᴇs ᴄᴀᴅᴇᴀᴜx\n';
      message += '/addtask - ᴀᴊᴏᴜᴛᴇʀ ᴜɴᴇ ᴛᴀ̂ᴄʜᴇ\n';
      message += '/listtasks - ʟɪsᴛᴇ ᴅᴇs ᴛᴀ̂ᴄʜᴇs\n';
      message += '/removetask - sᴜᴘᴘʀɪᴍᴇʀ ᴜɴᴇ ᴛᴀ̂ᴄʜᴇ\n';
      message += '/toggletask - (ᴅᴇ́s)ᴀᴄᴛɪᴠᴇʀ ᴜɴᴇ ᴛᴀ̂ᴄʜᴇ\n';
      message += '/completetask - ᴠᴀʟɪᴅᴇʀ ᴜɴᴇ ᴛᴀ̂ᴄʜᴇ ᴍᴀɴᴜᴇʟʟᴇᴍᴇɴᴛ\n';
      message += '/channels - ʟɪsᴛᴇ ᴅᴇs ᴄʜᴀɪ̂ɴᴇs\n';
      message += '/premiuminfo - ɪɴғᴏs ᴅ\'ᴜɴ ᴘʀᴇᴍɪᴜᴍ\n';
      message += '/broadcast - ᴇɴᴠᴏʏᴇʀ ᴜɴ ᴍᴇssᴀɢᴇ ᴀ̀ ᴛᴏᴜs ʟᴇs ᴜᴛɪʟɪsᴀᴛᴇᴜʀs\n';
      message += '/state - ᴠᴏɪʀ ʟᴇ ᴘᴀɴɴᴇᴀᴜ ᴀᴅᴍɪɴ ᴄᴏᴍᴘʟᴇᴛ\n━━━━━━━━━━━━━━━━━━━━';

      // 👑 Commandes proprio uniquement
      if (isSuperAdmin(userId)) {
        message += '\n*👨‍💻 𝙿𝚁𝙾𝙿𝚁𝙸𝙴́𝚃𝙰𝙸𝚁𝙴*\n';
        message += '/super - ᴠᴏɪʀ ʟᴇs ᴄᴏᴍᴍᴀɴᴅᴇs ᴘʀᴏᴘʀɪᴏ\n';
        message += '/ban - ʙᴀɴɴɪʀ ᴜɴ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ\n';
        message += '/unban - ᴅᴇ́ʙᴀɴɴɪʀ ᴜɴ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ\n';
        message += '/delgift - ᴅᴇ́sᴀᴄᴛɪᴠᴇʀ ᴜɴ ᴄᴏᴅᴇ ᴄᴀᴅᴇᴀᴜ\n';
        message += '/addchannel - ᴀᴊᴏᴜᴛᴇʀ ᴜɴᴇ ᴄʜᴀɪ̂ɴᴇ\n';
        message += '/delchannel - sᴜᴘᴘʀɪᴍᴇʀ ᴜɴᴇ ᴄʜᴀɪ̂ɴᴇ\n';
        message += '/togglechannel - (ᴅᴇ́s)ᴀᴄᴛɪᴠᴇʀ ᴜɴᴇ ᴄʜᴀɪ̂ɴᴇ\n';
        message += '/addpremium - ᴀᴄᴛɪᴠᴇʀ ᴜɴ ᴘʀᴇᴍɪᴜᴍ\n';
        message += '/removepremium - ʀᴇ́ᴠᴏǫᴜᴇʀ ʟᴇ ᴘʀᴇᴍɪᴜᴍ\n';
        message += '/togglepremium - (ᴅᴇ́s)ᴀᴄᴛɪᴠᴇʀ ʟᴇ ᴘʀᴇᴍɪᴜᴍ\n';
        message += '/addadmin - ᴀᴊᴏᴜᴛᴇʀ ᴜɴ ᴀᴅᴍɪɴɪsᴛʀᴀᴛᴇᴜʀ\n';
        message += '/removeadmin - ʀᴇᴛɪʀᴇʀ ᴜɴ ᴀᴅᴍɪɴɪsᴛʀᴀᴛᴇᴜʀ\n';
        message += '/admins - ʟɪsᴛᴇ ᴅᴇs ᴀᴅᴍɪɴɪsᴛʀᴀᴛᴇᴜʀs\n';
        message += '/statistics - sᴛᴀᴛɪsᴛɪǫᴜᴇs ᴅᴇs ᴠᴇɴᴛᴇs\n━━━━━━━━━━━━━━━━━━━━';
      }
    }

    ctx.reply(message, { parse_mode: 'Markdown' });
  });
};