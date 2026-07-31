const db = require('./database/db.js');
const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.command('buycoins', (ctx) => {
    // Bouton qui ouvre la mini-app
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.webApp('⭐ ᴀᴄʜᴇᴛᴇʀ ᴠɪᴀ sᴛᴀʀs', process.env.MINI_APP_URL)]
    ]);

    ctx.reply(
      '⭐ *ᴀᴄʜᴇᴛᴇʀ ᴅᴇs ᴄᴏɪɴs ᴇɴ ᴇ́ᴄʜᴀɴɢᴇ ᴅ\'ᴇ́ᴛᴏɪʟᴇs ᴛᴇʟᴇɢʀᴀᴍ*\n\n' +
      'ᴄʟɪǫᴜᴇᴢ sᴜʀ ʟᴇ ʙᴏᴜᴛᴏɴ ᴄɪ-ᴅᴇssᴏᴜs ᴘᴏᴜʀ ᴏᴜᴠʀɪʀ ʟᴀ ʙᴏᴜᴛɪǫᴜᴇ ᴇᴛ ᴘᴀʏᴇʀ ᴅᴇs ᴄᴏɪɴs.',
      { parse_mode: 'Markdown', ...keyboard }
    );
  });

  // Recevoir les données de la mini-app
  bot.on('web_app_data', async (ctx) => {
    try {
      const data = JSON.parse(ctx.webAppData.data);

      if (data.action === 'buy_coins') {
        const pack = db.prepare('SELECT * FROM coin_packs WHERE id = ? AND is_active = 1').get(data.pack_id);

        if (!pack) {
          return ctx.reply('❌ ᴘᴀᴄᴋ ɪɴᴅɪsᴘᴏɴɪʙʟᴇ.');
        }

        const totalCoins = data.coins + data.bonus;

        // Créer la facture Telegram Stars
        await ctx.replyWithInvoice(
          data.pack_name,
          `${totalCoins} ᴄᴏɪɴs (${data.coins} + ${data.bonus} ʙᴏɴᴜs)`,
          JSON.stringify({
            pack_id: pack.id,
            user_id: ctx.from.id,
            total_coins: totalCoins
          }),
          'XTR',
          [{ label: `${totalCoins} ᴄᴏɪɴs`, amount: data.stars }],
          {
            need_name: false,
            need_phone_number: false,
            need_email: false,
            need_shipping_address: false,
            is_flexible: false
          }
        );
      }
    } catch (error) {
      console.error('Erreur web_app_data:', error);
      ctx.reply('❌ ᴇʀʀᴇᴜʀ ʟᴏʀs ᴅᴜ ᴛʀᴀɪᴛᴇᴍᴇɴᴛ.');
    }
  });

  // Validation pre_checkout
  bot.on('pre_checkout_query', async (ctx) => {
    await ctx.answerPreCheckoutQuery(true);
  });

  // Paiement réussi
  bot.on('successful_payment', async (ctx) => {
    const payment = ctx.message.successful_payment;
    const payload = JSON.parse(payment.invoice_payload);
    const telegramPaymentId = payment.telegram_payment_charge_id;

    // Anti-doublon
    const existing = db.prepare('SELECT * FROM star_purchases WHERE telegram_payment_id = ?').get(telegramPaymentId);
    if (existing) return;

    // Enregistrer
    db.prepare(`
      INSERT INTO star_purchases (user_id, telegram_payment_id, pack_id, coins_received, stars_paid, status)
      VALUES (?, ?, ?, ?, ?, 'completed')
    `).run(payload.user_id, telegramPaymentId, payload.pack_id, payload.total_coins, payment.total_amount);

    // Créditer
    db.prepare('UPDATE users SET coins = coins + ?, total_earned = total_earned + ? WHERE user_id = ?')
      .run(payload.total_coins, payload.total_coins, payload.user_id);

    db.prepare('INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)')
      .run(payload.user_id, 'earn', payload.total_coins, 'Achat Stars');

    db.prepare('UPDATE admin_stats SET total_stars_earned = total_stars_earned + ? WHERE id = 1')
      .run(payment.total_amount);

    const user = db.prepare('SELECT coins FROM users WHERE user_id = ?').get(payload.user_id);

    await ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n✅ *𝙿𝙰𝙸𝙴𝙼𝙴𝙽𝚃 𝚁𝙴𝚄𝚂𝚂𝙸 !*\n\n🪙 +${payload.total_coins} ᴄᴏɪɴs ᴀᴊᴏᴜᴛᴇ́s\n💰 ɴᴏᴜᴠᴇᴀᴜ sᴏʟᴅᴇ : *${user.coins} ᴄᴏɪɴs*\n\n🎊 ᴍᴇʀᴄɪ ᴘᴏᴜʀ ᴠᴏᴛʀᴇ ᴀᴄʜᴀᴛ !\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });
};