const startTime = Date.now(); // temps de démarrage du processus

module.exports = (bot) => {
  bot.command('ping', async (ctx) => {
    const receivedAt = Date.now();
    
    // Calculer le temps de réponse du bot
    const processingTime = receivedAt - (ctx.message.date * 1000); // date du message (en secondes) -> ms
    const uptime = process.uptime(); // secondes depuis le lancement de Node.js

    // Formater l'uptime
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `${days}ᴊ ${hours}ʜ ${minutes}ᴍ ${seconds}s`;

    // Mesurer le ping vers l'API Telegram (optionnel mais sympa)
    const startPing = Date.now();
    try {
      await ctx.telegram.getMe();
    } catch (e) {}
    const apiPing = Date.now() - startPing;

    const message = 
      `━━━━━━━━━━━━━━━━━━━━\n🏓 *𝙿𝙾𝙽𝙶 !*\n\n⏱️ ᴛᴇᴍᴘs ᴅᴇ ʀᴇ́ᴘᴏɴsᴇ : *${processingTime} ᴍs*\n🌐 ᴘɪɴɢ ᴀᴘɪ ᴛᴇʟᴇɢʀᴀᴍ : *${apiPing} ᴍs*\n⏳ ᴜᴘᴛɪᴍᴇ : *${uptimeStr}*\n📅 ᴇɴ ʟɪɢɴᴇ ᴅᴇᴘᴜɪs ʟᴇ : *${new Date(startTime).toLocaleString('fr-FR')}*\n━━━━━━━━━━━━━━━━━━━━`;

    ctx.reply(message, { parse_mode: 'Markdown' });
  });
};