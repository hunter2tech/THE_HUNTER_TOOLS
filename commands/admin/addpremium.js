const db = require('./database/db.js');
const { isSuperAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('addpremium', (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return;

    const args = ctx.message.text.split(' ');
    const userId = parseInt(args[1]);
    const durationDays = parseInt(args[2]) || 0; // 0 = permanent

    if (!userId) return ctx.reply('❓ ᴜsᴀɢᴇ : /addpremium <ᴜsᴇʀ_ɪᴅ> [ᴅᴜʀᴇ́ᴇ_ᴇɴ_ᴊᴏᴜʀs]');

    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
    if (!user) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    const alreadyPremium = db.prepare('SELECT * FROM premium_users WHERE user_id = ?').get(userId);
    if (alreadyPremium) {
      // Mettre à jour la durée (on ajoute si permanent, sinon on prolonge)
      if (durationDays === 0) {
        db.prepare('UPDATE premium_users SET premium_until = NULL, activated_by = ? WHERE user_id = ?')
          .run(ctx.from.id, userId);
      } else {
        const currentUntil = alreadyPremium.premium_until ? new Date(alreadyPremium.premium_until) : new Date();
        const newUntil = new Date(currentUntil.getTime() + durationDays * 24 * 60 * 60 * 1000);
        db.prepare('UPDATE premium_users SET premium_until = ?, activated_by = ? WHERE user_id = ?')
          .run(newUntil.toISOString(), ctx.from.id, userId);
      }
    } else {
      const premiumUntil = durationDays === 0
        ? null
        : new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      db.prepare('INSERT INTO premium_users (user_id, premium_until, activated_by) VALUES (?, ?, ?)')
        .run(userId, premiumUntil, ctx.from.id);
    }

    const premium = db.prepare('SELECT * FROM premium_users WHERE user_id = ?').get(userId);
    const untilStr = premium.premium_until
      ? new Date(premium.premium_until).toLocaleDateString('fr-FR')
      : 'Permanent';

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n✅ *ᴀʙᴏɴɴᴇᴍᴇɴᴛ ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴛɪᴠᴇ́ !*\n\n👤 ${user.first_name} (ɪᴅ: ${userId})\n📅 ᴇxᴘɪʀᴇ : ${untilStr}\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );

    bot.telegram.sendMessage(userId,
      `━━━━━━━━━━━━━━━━━━━━\n🌟 *ᴠᴏᴜs ᴇ̂ᴛᴇs ᴍᴀɪɴᴛᴇɴᴀɴᴛ ᴘʀᴇᴍɪᴜᴍ !*\n\n📅 ᴠᴀʟᴀʙʟᴇ ᴊᴜsǫᴜ'ᴀᴜ : ${untilStr}\nᴍᴇʀᴄɪ ᴘᴏᴜʀ ᴠᴏᴛʀᴇ sᴏᴜsᴄʀɪᴘᴛɪᴏɴ !\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    ).catch(() => {});
  });
};