module.exports = (bot) => {
  bot.command('feedback', (ctx) => {
    const message = ctx.message.text.replace('/feedback', '').trim();

    if (!message) {
      return ctx.reply(
        `━━━━━━━━━━━━━━━━━━━━\n📩 *ᴇɴᴠᴏʏᴇʀ ᴜɴ ᴍᴇssᴀɢᴇ ᴀ̀ ʟ\'ᴀᴅᴍɪɴ*\n\n❓ ᴜsᴀɢᴇ : /feedback <ᴍᴇssᴀɢᴇ>\nᴇxᴇᴍᴘʟᴇ : \`/feedback ʙᴏɴᴊᴏᴜʀ, ᴊ\'ᴀɪ ᴜɴ sᴏᴜᴄɪs.\`\n━━━━━━━━━━━━━━━━━━━━`,
        { parse_mode: 'Markdown' }
      );
    }

    const user = ctx.from;
    const adminId = process.env.ADMIN_ID;

    // Envoyer le message à l'admin
    const textToAdmin =
      `━━━━━━━━━━━━━━━━━━━━\n📩 *𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝙳'𝚄𝙽 𝚄𝚃𝙸𝙻𝙸𝚂𝙰𝚃𝙴𝚄𝚁*\n\n👤 ᴍᴇssᴀɢᴇ ᴅᴇ : ${user.first_name} (ɪᴅ: ${user.id})\n🔖 ᴜsᴇʀɴᴀᴍᴇ : @${user.username || 'N/A'}\n\n💬 ᴍᴇssᴀɢᴇ :\n${message}\n\nᴛʜᴇ ʜᴜɴᴛᴇʀ ᴢᴏɴᴇ • ᴄᴏᴘʏʀɪɢʜᴛ 2026\n━━━━━━━━━━━━━━━━━━━━`;

    bot.telegram.sendMessage(adminId, textToAdmin, { parse_mode: 'Markdown' })
      .then(() => {
        ctx.reply('✅ ᴠᴏᴛʀᴇ ᴍᴇssᴀɢᴇ ᴀ ʙɪᴇɴ ᴇ́ᴛᴇ́ ᴇɴᴠᴏʏᴇ́ ᴀ̀ ʟ\'ᴀᴅᴍɪɴɪsᴛʀᴀᴛᴇᴜʀ. ᴍᴇʀᴄɪ !');
      })
      .catch(() => {
        ctx.reply('❌ ᴇʀʀᴇᴜʀ ʟᴏʀs ᴅᴇ ʟ\'ᴇɴᴠᴏɪ. ᴠᴇᴜɪʟʟᴇᴢ ʀᴇ́ᴇssᴀʏᴇʀ ᴘʟᴜs ᴛᴀʀᴅ.');
      });
  });
};