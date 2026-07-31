const db = require('./database/db.js');
const { addCoins, removeCoins, formatNumber } = require('./utils/helpers.js');

module.exports = (bot) => {
  bot.command('transfer', async (ctx) => {
    const args = ctx.message.text.split(' ');
    const targetRaw = args[1];      // @username ou user_id
    const amount = parseInt(args[2]);

    if (!targetRaw || !amount || isNaN(amount) || amount <= 0) {
      return ctx.reply('❓ ᴜsᴀɢᴇ : /transfer <@ᴜsᴇʀɴᴀᴍᴇ/ɪᴅ> <ᴍᴏɴᴛᴀɴᴛ>');
    }

    const senderId = ctx.from.id;
    const sender = db.prepare('SELECT * FROM users WHERE user_id = ?').get(senderId);
    if (!sender) return ctx.reply('❌ ᴜᴛɪʟɪsᴇᴢ /start ᴅ\'ᴀʙᴏʀᴅ.');

    // Vérifier le solde
    if (sender.coins < amount) {
      return ctx.reply('❌ ᴠᴏᴛʀᴇ sᴏʟᴅᴇ ᴇsᴛ ɪɴsᴜғғɪsᴀɴᴛ.');
    }

    // Trouver le destinataire
    let receiverId;
    if (targetRaw.startsWith('@')) {
      // Chercher par username
      const username = targetRaw.substring(1);
      const receiver = db.prepare('SELECT user_id FROM users WHERE username = ?').get(username);
      if (!receiver) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ. ᴠᴇ́ʀɪғɪᴇᴢ ǫᴜ\'ɪʟ ᴀ ʙɪᴇɴ ᴜᴛɪʟɪsᴇ́ ʟᴇ ʙᴏᴛ.');
      receiverId = receiver.user_id;
    } else {
      // ID numérique
      receiverId = parseInt(targetRaw);
      if (isNaN(receiverId)) return ctx.reply('❌ ʟᴇ ᴅᴇsᴛɪɴᴀᴛᴀɪʀᴇ ᴇsᴛ ɪɴᴠᴀʟɪᴅᴇ.');
    }

    if (receiverId === senderId) {
      return ctx.reply('❌ ᴠᴏᴜs ɴᴇ ᴘᴏᴜᴠᴇᴢ ᴘᴀs ᴠᴏᴜs ᴛʀᴀɴsғᴇ́ʀᴇʀ ᴅᴇs ᴄᴏɪɴs ᴀ̀ ᴠᴏᴜs-ᴍᴇ̂ᴍᴇ.');
    }

    const receiver = db.prepare('SELECT * FROM users WHERE user_id = ?').get(receiverId);
    if (!receiver) return ctx.reply('❌ ᴅᴇsᴛɪɴᴀᴛᴀɪʀᴇ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ (ɴ\'ᴀ ᴊᴀᴍᴀɪs ᴜᴛɪʟɪsᴇ́ ʟᴇ ʙᴏᴛ).');

    // Taxe optionnelle de 2%
    const tax = Math.floor(amount * 0.02);
    const receivedAmount = amount - tax;

    // Débiter l'expéditeur
    const newSenderBalance = removeCoins(senderId, amount, `Transfert à ${receiver.first_name || receiver.user_id}`);
    if (newSenderBalance === false) return ctx.reply('❌ ᴇʀʀᴇᴜʀ ʟᴏʀs ᴅᴜ ᴛʀᴀɴsғᴇʀᴛ.');

    // Créditer le destinataire
    addCoins(receiverId, receivedAmount, 'earn', `Transfert de ${sender.first_name || sender.user_id}`);

    // Message à l'expéditeur
    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n✅ *𝚃𝚁𝙰𝙽𝚂𝙵𝙴𝚁𝚃 𝙳𝙴 𝙲𝙾𝙸𝙽𝚂 !*\n\n💸 ᴍᴏɴᴛᴀɴᴛ : *${formatNumber(amount)} ᴄᴏɪɴs*\n📤 ᴇɴᴠᴏʏᴇ́ ᴀ̀ : ${receiver.first_name || receiver.user_id}\n🧾 ᴛᴀxᴇ : ${tax} ᴄᴏɪɴs (2%)\n💰 ɴᴏᴜᴠᴇᴀᴜ sᴏʟᴅᴇ : *${formatNumber(newSenderBalance)} ᴄᴏɪɴs*\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );

    // Notification au destinataire
    bot.telegram.sendMessage(
      receiverId,
      `━━━━━━━━━━━━━━━━━━━━\n💸 *𝚁𝙴́𝙲𝙴𝙿𝚃𝙸𝙾𝙽 𝙳𝙴 𝙲𝙾𝙸𝙽𝚂 !*\n\n📥 ᴅᴇ : ${sender.first_name || sender.user_id}\n💸 ᴍᴏɴᴛᴀɴᴛ : *${formatNumber(receivedAmount)} ᴄᴏɪɴs*\n💰 ɴᴏᴜᴠᴇᴀᴜ sᴏʟᴅᴇ : *${formatNumber(receiver.coins + receivedAmount)} ᴄᴏɪɴs*\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    ).catch(() => {});
  });
};