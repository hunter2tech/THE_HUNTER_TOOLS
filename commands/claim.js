const db = require('./database/db.js');
const { addCoins } = require('./utils/helpers.js');

module.exports = (bot) => {
  bot.command('claim', (ctx) => {
    const code = ctx.message.text.split(' ')[1]?.toUpperCase();

    if (!code) {
      return ctx.reply(
        `━━━━━━━━━━━━━━━━━━━━\n🎁 *ᴜᴛɪʟɪsᴇʀ ᴜɴ ᴄᴏᴅᴇ ᴄᴀᴅᴇᴀᴜ*\n\nғᴏʀᴍᴀᴛ : /claim <ᴄᴏᴅᴇ>\nᴇxᴇᴍᴘʟᴇ : \`/claim BONUS2026\`\n━━━━━━━━━━━━━━━━━━━━`,
        { parse_mode: 'Markdown' }
      );
    }

    const gift = db.prepare('SELECT * FROM gift_codes WHERE code = ? AND is_active = 1').get(code);

    if (!gift) {
      return ctx.reply('❌ ᴄᴇ ᴄᴏᴅᴇ ɪɴᴠᴀʟɪᴅᴇ.');
    }

    // Vérifier expiration
    if (gift.expires_at && new Date(gift.expires_at) < new Date()) {
      return ctx.reply('❌ ᴄᴇ ᴄᴏᴅᴇ ᴀ ᴇxᴘɪʀᴇ́.');
    }

    // Vérifier utilisations max
    if (gift.uses >= gift.max_uses) {
      return ctx.reply('❌ ᴄᴇ ᴄᴏᴅᴇ ᴀ ᴀᴛᴛᴇɪɴᴛ sᴀ ʟɪᴍɪᴛᴇ ᴅ\'ᴜᴛɪʟɪsᴀᴛɪᴏɴs.');
    }

    // Vérifier si l'utilisateur a déjà utilisé ce code
    const alreadyClaimed = db.prepare('SELECT * FROM gift_claims WHERE user_id = ? AND code_id = ?')
      .get(ctx.from.id, gift.id);

    if (alreadyClaimed) {
      return ctx.reply('❌ ᴠᴏᴜs ᴀᴠᴇᴢ ᴅᴇ́ᴊᴀ̀ ᴜᴛɪʟɪsᴇ́ ᴄᴇ ᴄᴏᴅᴇ ᴇᴛ ʀᴇ́ᴄᴜᴘᴇ́ʀᴇ́ ᴠᴏᴛʀᴇ ᴄᴀᴅᴇᴀᴜ.');
    }

    // Valider le code
    db.prepare('UPDATE gift_codes SET uses = uses + 1 WHERE id = ?').run(gift.id);
    db.prepare('INSERT INTO gift_claims (user_id, code_id) VALUES (?, ?)').run(ctx.from.id, gift.id);

    const newBalance = addCoins(ctx.from.id, gift.reward, 'earn', `Code cadeau : ${code}`);

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n🎁 *𝙲𝙰𝙳𝙴𝙰𝚄 𝙾𝚄𝚅𝙴𝚁𝚃 !*\n\n🔑 ᴄᴏᴅᴇ : \`${code}\`\n🪙 +${gift.reward} ᴄᴏɪɴs\n💰 ɴᴏᴜᴠᴇᴀᴜ sᴏʟᴅᴇ : *${newBalance} ᴄᴏɪɴs*\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });
};