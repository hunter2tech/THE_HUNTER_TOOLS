const db = require('./database/db.js');

module.exports = (bot) => {
  bot.start(async (ctx) => {
    const user = ctx.from;
    const refCode = ctx.payload || null;

    const existing = db.prepare('SELECT * FROM users WHERE user_id = ?').get(user.id);
    const imageUrl = process.env.WELCOME_IMAGE_URL;

    // Fonction pour envoyer la réponse (photo ou texte)
    const sendWelcome = async (caption) => {
      if (imageUrl) {
        try {
          await ctx.replyWithPhoto(imageUrl, { caption, parse_mode: 'Markdown' });
        } catch (e) {
          // Si l'URL est invalide, fallback texte
          await ctx.reply(caption, { parse_mode: 'Markdown' });
        }
      } else {
        await ctx.reply(caption, { parse_mode: 'Markdown' });
      }
    };

    if (!existing) {
      // Nouvel utilisateur
      const refCodeGen = 'REF' + user.id + Math.random().toString(36).substring(2, 6).toUpperCase();
      let referredBy = null;

      if (refCode) {
        const referrer = db.prepare('SELECT user_id FROM users WHERE ref_code = ?').get(refCode);
        if (referrer && referrer.user_id !== user.id) {
          referredBy = referrer.user_id;
          db.prepare('UPDATE users SET coins = coins + 50 WHERE user_id = ?').run(referrer.user_id);
          db.prepare('INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)')
            .run(referrer.user_id, 'referral', 50, `🎊 ɴᴏᴜᴠᴇᴀᴜ ғɪʟʟᴇᴜʟ: ${user.first_name}`);
        }
      }

      db.prepare(`
        INSERT INTO users (user_id, username, first_name, coins, ref_code, referred_by)
        VALUES (?, ?, ?, 100, ?, ?)
      `).run(user.id, user.username, user.first_name, refCodeGen, referredBy);

      const caption =
        `━━━━━━━━━━━━━━━━━━━━\n🎉 ʙɪᴇɴᴠᴇɴᴜᴇ sᴜʀ ᴛʜᴇ ʜᴜɴᴛᴇʀ ᴛᴏᴏʟs ${user.first_name} !\n\n**ᴄᴇ ʙᴏᴛ ᴇsᴛ ᴄᴏɴᴄᴜ ᴘᴏᴜʀ ᴄᴏɴᴛᴇɴɪʀ ᴛᴏᴜᴛ ᴄᴇ ᴅᴏɴᴛ ᴜɴ ᴘᴜʀɢᴇᴜʀ ᴅᴏɪs ᴀᴠᴏɪʀ ʙᴇsᴏɪɴ. sᴄʀɪᴘᴛs, ᴀᴘᴋs, ᴄʜᴇᴄᴋs, ᴛᴜᴛᴏs, ᴇᴛᴄ...**\n\n💰 ʙᴏɴᴜs ᴅᴇ ʙɪᴇɴᴠᴇɴᴜᴇ : 100 🪙.\n👥 ᴄᴏᴅᴇ ᴅᴇ ᴘᴀʀᴀɪɴᴀɢᴇ : \`${refCodeGen}\`\n\n𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝙴𝚂 :\n/profile - ᴘʀᴏғɪʟ\n/daily - ʙᴏɴᴜs ǫᴜᴏᴛɪᴅɪᴇɴ\n/shop - ʙᴏᴜᴛɪǫᴜᴇ\n/buycoins - ᴀᴄʜᴇᴛᴇʀ ᴅᴇs ᴄᴏɪɴs\n/referral - ᴘᴀʀʀᴀɪɴᴀɢᴇ\n/tasks - ᴛᴀ̂ᴄʜᴇs ʀᴇ́ᴍᴜɴᴇ́ʀᴇ́ᴇs\n/feedback - ᴍᴇssᴀɢᴇ ᴀ̀ ʟ'ᴀᴅᴍɪɴ\n/transfer - ᴛʀᴀɴsғᴇ́ʀᴇʀ ᴅᴇs ᴄᴏɪɴs\n/ping - ᴇ́ᴛᴀᴛ ᴅᴜ ʙᴏᴛ\n/help - ᴠᴏɪʀ ᴛᴏᴜᴛᴇs ʟᴇs ᴄᴏᴍᴍᴀɴᴅᴇs\n━━━━━━━━━━━━━━━━━━━━`;

      await sendWelcome(caption);
      return;
    }

    // Utilisateur existant
    const caption = `👋 ᴄᴏɴᴛᴇɴᴛ ᴅᴇ ᴠᴏᴜs ʀᴇᴠᴏɪʀ, ${user.first_name} !`;
    await sendWelcome(caption);
  });
};