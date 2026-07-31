const db = require('./database/db.js');

module.exports = (bot) => {
  const { isSuperAdmin } = require('./utils/permissions.js');
if (!isSuperAdmin(ctx.from.id)) return;

  // ========== AJOUTER UNE CHAÎNE OBLIGATOIRE ==========
  bot.command('addchannel', (ctx) => {
    if (!isSuperAdmin(ctx)) return;

    const args = ctx.message.text.split('|').map(s => s.trim());
    // /addchannel @username | Titre | type
    // Exemple : /addchannel @moncanal | Mon Canal | channel

    const username = args[0]?.replace('/addchannel ', '').trim() || args[0];
    const title = args[1] || username;
    const type = args[2] || 'channel';

    if (!username || !username.startsWith('@')) {
      return ctx.reply('❓ ᴜsᴀɢᴇ : /addchannel @ᴜsᴇʀɴᴀᴍᴇ | ᴛɪᴛʀᴇ | ᴄʜᴀɴɴᴇʟ/ɢʀᴏᴜᴘ');
    }

    // Vérifier si le bot est admin du canal
    try {
      const botMember = ctx.telegram.getChatMember(username, ctx.botInfo.id);
    } catch (e) {
      return ctx.reply(`⚠️ ᴀᴄᴄᴇ̀s ʀᴇғᴜsᴇ́ ᴅᴇ ${username}. ᴠᴇ́ʀɪғɪᴇᴢ ǫᴜᴇ ʟᴇ ʙᴏᴛʜ ᴇsᴛ ᴀᴅᴍɪɴ ᴅᴇ ᴄᴇᴛᴛᴇ ᴄʜᴀɪ̂ɴᴇ.`);
    }

    const existing = db.prepare('SELECT * FROM required_channels WHERE channel_username = ?').get(username);
    if (existing) return ctx.reply('❌ ᴄᴇᴛᴛᴇ ᴄʜᴀɪ̂ɴᴇ ᴇsᴛ ᴅᴇ́ᴊᴀ̀ ɪɴᴄʟᴜs ᴅᴀɴs ʟᴀ ʟɪsᴛᴇ.');

    db.prepare('INSERT INTO required_channels (channel_username, channel_title, channel_type) VALUES (?, ?, ?)')
      .run(username, title, type);

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n✅ *ᴄʜᴀɪ̂ɴᴇ ᴀᴊᴏᴜᴛᴇ́ᴇ !*\n\n📢 ${title}\n🔗 ${username}\n🏷 ᴛʏᴘᴇ : ${type}\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });

  // ========== LISTER LES CHAÎNES ==========
  bot.command('channels', (ctx) => {
    if (!isAdmin(ctx)) return;

    const channels = db.prepare('SELECT * FROM required_channels ORDER BY added_at DESC').all();

    if (channels.length === 0) {
      return ctx.reply('📋 ᴀᴜᴄᴜɴᴇ ᴄʜᴀɪ̂ɴᴇ ᴀssᴏᴄɪᴇ́. ᴀᴊᴏᴜᴛᴇᴢ ᴀᴠᴇᴄ /addchannel');
    }

    let message = '📢 *ʟɪsᴛᴇ ᴅᴇs ᴄʜᴀɪɴᴇs*\n\n';

    for (const ch of channels) {
      const emoji = ch.is_active ? '🟢' : '🔴';
      const typeEmoji = ch.channel_type === 'group' ? '👥' : '📢';
      message += `━━━━━━━━━━━━━━━━━━━━\n${emoji} ${typeEmoji} *${ch.channel_title}*\n📢 ${ch.channel_username}\n🆔 : ${ch.id}\n━━━━━━━━━━━━━━━━━━━━`;
    }

    ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // ========== SUPPRIMER UNE CHAÎNE ==========
  bot.command('delchannel', (ctx) => {
    if (!isSuperAdmin(ctx)) return;

    const id = parseInt(ctx.message.text.split(' ')[1]);
    if (!id) return ctx.reply('❓ ᴜsᴀɢᴇ : /delchannel <ɪᴅ>');

    db.prepare('DELETE FROM required_channels WHERE id = ?').run(id);
    ctx.reply(`✅ ᴄʜᴀɪ̂ɴᴇ #${id} sᴜᴘᴘʀɪᴍᴇ́ᴇ.`);
  });

  // ========== ACTIVER/DÉSACTIVER UNE CHAÎNE ==========
  bot.command('togglechannel', (ctx) => {
    if (!isSuperAdmin(ctx)) return;

    const id = parseInt(ctx.message.text.split(' ')[1]);
    if (!id) return ctx.reply('❓ ᴜsᴀɢᴇ : /togglechannel <ɪᴅ>');

    const channel = db.prepare('SELECT * FROM required_channels WHERE id = ?').get(id);
    if (!channel) return ctx.reply('❌ ᴄʜᴀɪ̂ɴᴇ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    const newStatus = channel.is_active ? 0 : 1;
    db.prepare('UPDATE required_channels SET is_active = ? WHERE id = ?').run(newStatus, id);

    ctx.reply(`✅ ${channel.channel_title} : ${newStatus ? '🟢 ᴀᴄᴛɪᴠᴇ́ᴇ' : '🔴 ᴅᴇ́sᴀᴄᴛɪᴠᴇ́ᴇ'}`);
  });
};