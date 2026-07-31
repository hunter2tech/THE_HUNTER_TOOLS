const db = require('./database/db.js');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let currentBroadcast = null;
let isBroadcasting = false;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = (bot) => {
  const { isAdmin } = require('./utils/permissions.js');

  // Intercepter le message de broadcast
  bot.use(async (ctx, next) => {
    if (!isAdmin(ctx)) return next();
    if (!ctx.message?.text) return next();

    const text = ctx.message.text;

    if (text.startsWith('/broadcast') &&
        !text.includes('confirm') &&
        !text.includes('cancel') &&
        !text.includes('stats')) {

      const messageText = text.replace('/broadcast', '').trim();

      if (messageText) {
        currentBroadcast = {
          text: messageText,
          forwardFrom: ctx.message.reply_to_message ? {
            chatId: ctx.message.reply_to_message.forward_from_chat?.id || ctx.chat.id,
            messageId: ctx.message.reply_to_message.message_id
          } : null
        };
      }
    }

    return next();
  });

  // ========== COMMANDE BROADCAST ==========
  bot.command('broadcast', (ctx) => {
    if (!isAdmin(ctx)) return;

    const message = ctx.message.text.replace('/broadcast', '').trim();

    if (!message) {
      return ctx.reply(
        `━━━━━━━━━━━━━━━━━━━━\n📢 *𝙱𝚁𝙾𝙰𝙳𝙲𝙰𝚂𝚃*\n\nᴇɴᴠᴏʏᴇᴢ ᴜɴ ᴍᴇssᴀɢᴇ ᴀ̀ ᴛᴏᴜs ʟᴇs ᴜᴛɪʟɪsᴀᴛᴇᴜʀs.\n\n*ғᴏʀᴍᴀᴛs :*\n*• /broadcast <ᴍᴇssᴀɢᴇ>* — ᴛᴇxᴛᴇ\n*• ʀᴇ́ᴘᴏɴᴅᴇᴢ ᴀ̀ ᴜɴ ᴍᴇssᴀɢᴇ ᴀᴠᴇᴄ + /broadcast*— ғᴏʀᴡᴀʀᴅ\n• \`/broadcast confirm\` — ᴇɴᴠᴏʏᴇʀ\n• \`/broadcast cancel\` — ᴀɴɴᴜʟᴇʀ\n• \`/broadcast stats\` — ʜɪsᴛᴏʀɪᴏ̨ᴜᴇ\n━━━━━━━━━━━━━━━━━━━━`,
        { parse_mode: 'Markdown' }
      );
    }

    if (message.toLowerCase() === 'stats') return showStats(ctx);

    return ctx.replyWithMarkdown(
      `━━━━━━━━━━━━━━━━━━━━\n📢 *𝙲𝙾𝙽𝙵𝙸𝚁𝙼𝙰𝚃𝙸𝙾𝙽*\n\n💭 *ᴍᴇssᴀɢᴇ :*\n${message}\n\n➡️ \`/broadcast confirm\` ᴘᴏᴜʀ ᴇɴᴠᴏʏᴇʀ\n❌ \`/broadcast cancel\` ᴘᴏᴜʀ ᴀɴɴᴜʟᴇʀ\n━━━━━━━━━━━━━━━━━━━━`
    );
  });

  // ========== CONFIRMER ==========
  bot.command('broadcast confirm', async (ctx) => {
    if (!isAdmin(ctx)) return;
    if (isBroadcasting) return ctx.reply('⏳ ʙʀᴏᴀᴅᴄᴀsᴛ ᴇɴ ᴄᴏᴜʀs...');

    const users = db.prepare('SELECT user_id FROM users').all();
    if (users.length === 0) return ctx.reply('❌ ᴀᴜᴄᴜɴ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ.');

    if (!currentBroadcast) return ctx.reply('❌ ᴀᴜᴄᴜɴ ᴍᴇssᴀɢᴇ ᴅᴇ ʙʀᴏᴀᴅᴄᴀsᴛ.');

    isBroadcasting = true;

    const statusMsg = await ctx.reply(`📢 ʙʀᴏᴀᴅᴄᴀsᴛ ᴅᴇ́ᴍᴀʀʀᴇ́... 0/${users.length}`);

    let success = 0, failed = 0, blocked = 0;

    for (let i = 0; i < users.length; i++) {
      try {
        await ctx.telegram.sendMessage(users[i].user_id, currentBroadcast.text, { parse_mode: 'Markdown' });
        success++;
      } catch (e) {
        e.code === 403 ? blocked++ : failed++;
      }

      if (i % 25 === 0 || i === users.length - 1) {
        try {
          await ctx.telegram.editMessageText(
            ctx.chat.id, statusMsg.message_id, null,
            `━━━━━━━━━━━━━━━━━━━━\n📢 *ʙʀᴏᴀᴅᴄᴀsᴛ ᴛᴇʀᴍɪɴᴇ́*\n\n✅ ${success}\n❌ ${failed}\n🚫 ${blocked}\n⏳ ${i + 1}/${users.length}\n━━━━━━━━━━━━━━━━━━━━`,
            { parse_mode: 'Markdown' }
          );
        } catch (e) {}
      }

      await sleep(30);
    }

    isBroadcasting = false;
    saveStats(users.length, success, failed, blocked);

    await ctx.telegram.editMessageText(
      ctx.chat.id, statusMsg.message_id, null,
      `━━━━━━━━━━━━━━━━━━━━\n📢 *ᴛᴇʀᴍɪɴᴇ́ !*\n✅ ${success}\n❌ ${failed}\n🚫 ${blocked}\n📊 ${Math.round(success / users.length * 100)}%\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );

    currentBroadcast = null;
  });

  // ========== ANNULER ==========
  bot.command('broadcast cancel', (ctx) => {
    if (!isAdmin(ctx)) return;
    currentBroadcast = null;
    ctx.reply('❌ ʙʀᴏᴀᴅᴄᴀsᴛ ᴀɴɴᴜʟᴇ́.');
  });

  // ========== STATS ==========
 bot.command('broadcast stats', (ctx) => {
    if (!isAdmin(ctx)) return;
    
   function showStats(ctx) {
    db.exec(`CREATE TABLE IF NOT EXISTS broadcast_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total INTEGER, success INTEGER, failed INTEGER, blocked INTEGER,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const stats = db.prepare('SELECT * FROM broadcast_stats ORDER BY sent_at DESC LIMIT 5').all();

    if (stats.length === 0) return ctx.reply('📊 ᴀᴜᴄᴜɴ ʙʀᴏᴀᴅᴄᴀsᴛ.');

    let message = '📊 *𝙷𝙸𝚂𝚃𝙾𝚁𝙸𝚀𝚄𝙴*\n\n';
    for (const s of stats) {
      message += `📅 ${new Date(s.sent_at).toLocaleDateString('fr-FR')} — ${Math.round(s.success / s.total * 100)}%\n`;
    }

    ctx.reply(message, { parse_mode: 'Markdown' });
  }

  function saveStats(total, success, failed, blocked) {
    db.exec(`CREATE TABLE IF NOT EXISTS broadcast_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total INTEGER, success INTEGER, failed INTEGER, blocked INTEGER,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.prepare('INSERT INTO broadcast_stats (total, success, failed, blocked) VALUES (?, ?, ?, ?)')
      .run(total, success, failed, blocked);
  }
};