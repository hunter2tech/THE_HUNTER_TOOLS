async function deliverFile(ctx, item, userId) {
  const fs = require('fs');
  const path = require('path');
const baseDir = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? process.env.RAILWAY_VOLUME_MOUNT_PATH
  : path.join(__dirname, '../');
const filePath = path.join(baseDir, 'files', item.file_path);

const { Scenes, Markup } = require('telegraf');
const db = require('./database/db.js');
const { isPremium } = require('./utils/helpers.js');

const shopScene = new Scenes.WizardScene(
  'shop',

  // ----------------- ÉTAPE 1 : CHOIX DE LA CATÉGORIE -----------------
  async (ctx) => {
    const categories = db.prepare('SELECT DISTINCT category FROM shop_items WHERE is_active = 1').all();

    if (categories.length === 0) {
      await ctx.reply('🛒 ʟᴀ ʙᴏᴜᴛɪǫᴜᴇ ᴇsᴛ ᴠɪᴅᴇ ᴘᴏᴜʀ ʟᴇ ᴍᴏᴍᴇɴᴛ ʀᴇᴠᴇɴᴇᴢ ᴀᴘʀᴇ̀s.');
      return ctx.scene.leave();
    }

    const buttons = categories.map(cat => [
      Markup.button.callback(`📦 ${cat.toUpperCase()}`, `shopcat_${cat}`)
    ]);
    buttons.push([Markup.button.callback('ғᴇʀᴍᴇʀ ʟᴀ ʙᴏᴜᴛɪǫᴜᴇ', 'shop_cancel')]);

    await ctx.reply(
      '🛒 *𝙱𝙾𝚄𝚃𝙸𝚀𝚄𝙴*\n\nsᴇʟᴇᴄᴛɪᴏɴɴᴇᴢ ᴜɴᴇ ᴄᴀᴛᴇ́ɢᴏʀɪᴇ :',
      { parse_mode: 'Markdown', ...Markup.inlineKeyboard(buttons) }
    );

    return ctx.wizard.next();
  },

  // ----------------- ÉTAPE 2 : CHOIX DE L'ARTICLE -----------------
  async (ctx) => {
    // Gestion des actions spéciales
    if (ctx.callbackQuery?.data === 'shop_cancel') {
      await ctx.answerCbQuery();
      await ctx.editMessageText('🛒 ʙᴏᴜᴛɪǫᴜᴇ ғᴇʀᴍᴇ́.');
      return ctx.scene.leave();
    }

    if (ctx.callbackQuery?.data === 'shop_back') {
      // Retour à l'étape 1 (catégories)
      ctx.wizard.selectStep(0);
      return ctx.wizard.steps[0](ctx);
    }

    const category = ctx.callbackQuery.data.split('_')[1];
    const items = db.prepare('SELECT * FROM shop_items WHERE category = ? AND is_active = 1').all(category);

    if (items.length === 0) {
      await ctx.answerCbQuery('ᴀᴜᴄᴜɴ ᴀʀᴛɪᴄʟᴇ ᴅᴇ ᴄᴇᴛᴛᴇ ᴄᴀᴛᴇ́ɢᴏʀɪᴇ ᴘᴏᴜʀ ʟᴇ ᴍᴏᴍᴇɴᴛ.');
      return ctx.scene.leave();
    }

    ctx.wizard.state.category = category;

    // Création des boutons avec badge premium si nécessaire
    const buttons = items.map(item => {
      const label = `${item.premium_only ? '💎 ' : ''}${item.name} - ${item.price} 🪙`;
      return [Markup.button.callback(label, `shopitem_${item.id}`)];
    });
    buttons.push([Markup.button.callback('🔙 ʀᴇᴛᴏᴜʀ', 'shop_back')]);
    buttons.push([Markup.button.callback('❌ ғᴇʀᴍᴇʀ', 'shop_cancel')]);

    await ctx.editMessageText(
      `📦 ᴄᴀᴛᴇ́ɢᴏʀɪᴇ *${category.toUpperCase()}*\n\nᴄʜᴏɪsɪssᴇᴢ ᴜɴ ᴀʀᴛɪᴄʟᴇ :`,
      { parse_mode: 'Markdown', ...Markup.inlineKeyboard(buttons) }
    );

    return ctx.wizard.next();
  },

  // ----------------- ÉTAPE 3 : CONFIRMATION D'ACHAT -----------------
  async (ctx) => {
    // Retour ou annulation
    if (ctx.callbackQuery?.data === 'shop_back') {
      ctx.wizard.selectStep(1);
      return ctx.wizard.steps[1](ctx);
    }
    if (ctx.callbackQuery?.data === 'shop_cancel') {
      await ctx.answerCbQuery();
      await ctx.editMessageText('🛒 ᴀᴄʜᴀᴛ ᴀɴɴᴜʟᴇ́.');
      return ctx.scene.leave();
    }

    const itemId = parseInt(ctx.callbackQuery.data.split('_')[1]);
    const item = db.prepare('SELECT * FROM shop_items WHERE id = ?').get(itemId);

    if (!item) {
      await ctx.answerCbQuery('❓ ᴀʀᴛɪᴄʟᴇ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');
      return ctx.scene.leave();
    }

    // Vérification premium
    if (item.premium_only && !isPremium(ctx.from.id)) {
      await ctx.answerCbQuery('🔒 ᴀʀᴛɪᴄʟᴇ ʀᴇ́sᴇʀᴠᴇ́ ᴀᴜx ᴜᴛɪʟɪsᴀᴛᴇᴜʀs ᴘʀᴇᴍɪᴜᴍ !', { show_alert: true });
      return ctx.scene.leave();
    }

    // Vérification du stock (si limité)
    if (item.stock !== -1 && item.stock <= 0) {
      await ctx.answerCbQuery('❌ ʀᴜᴘᴛᴜʀᴇ ᴅᴇ sᴛᴏᴄᴋ.', { show_alert: true });
      return ctx.scene.leave();
    }

    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(ctx.from.id);

    if (user.coins < item.price) {
      await ctx.answerCbQuery('❌ ᴠᴏᴜs ɴ\'ᴀᴠᴇᴢ ᴘᴀs ᴀssᴇᴢ ᴅᴇ ᴄᴏɪɴs !', { show_alert: true });
      return ctx.scene.leave();
    }

    // Stockage dans le state pour l'étape finale
    ctx.wizard.state.itemId = item.id;
    ctx.wizard.state.itemName = item.name;
    ctx.wizard.state.itemPrice = item.price;

    const confirmButtons = [
      [
        Markup.button.callback('✅ ᴄᴏɴғɪʀᴍᴇʀ', 'shop_confirm'),
        Markup.button.callback('❌ ᴀɴɴᴜʟᴇʀ', 'shop_cancel')
      ]
    ];

    let confirmMessage = `━━━━━━━━━━━━━━━━━━━━\n🛍 *𝙰𝙲𝙷𝙰𝚃 𝙴𝙽 𝙲𝙾𝚄𝚁𝚂*\n\n📦 ᴀʀᴛɪᴄʟᴇ : *${item.name}*\n🪙 ᴘʀɪx : *${item.price} ᴄᴏɪɴs*\n💵 sᴏʟᴅᴇ : *${user.coins} ᴄᴏɪɴs*\n💷 ʀᴇsᴛᴇ : *${user.coins - item.price} ᴄᴏɪɴs*\n\nᴛʜᴇ ʜᴜɴᴛᴇʀ • ᴀʟʟ ʀɪɢʜᴛs ʀᴇsᴇʀᴠᴇᴅ\n━━━━━━━━━━━━━━━━━━━━`;

    if (item.premium_only) {
      confirmMessage += `🔒 *ᴀʀᴛɪᴄʟᴇ ʀᴇ́sᴇʀᴠᴇ́ ᴀᴜx ᴜᴛɪʟɪsᴀᴛᴇᴜʀs ᴘʀᴇᴍɪᴜᴍ*\n\n`;
    }

    confirmMessage += `ᴄᴏɴғɪʀᴍᴇʀ ᴠᴏᴜs ʟ'ᴀᴄʜᴀᴛ ?`;

    await ctx.editMessageText(confirmMessage, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(confirmButtons)
    });

    return ctx.wizard.next();
  },

  // ----------------- ÉTAPE 4 : FINALISATION ET LIVRAISON -----------------
  async (ctx) => {
    if (ctx.callbackQuery?.data === 'shop_cancel') {
      await ctx.answerCbQuery();
      await ctx.editMessageText('🛒 ᴀᴄʜᴀᴛ ᴀɴɴᴜʟᴇ́.');
      return ctx.scene.leave();
    }

    if (ctx.callbackQuery?.data === 'shop_confirm') {
      const { itemId, itemName, itemPrice } = ctx.wizard.state;
      const userId = ctx.from.id;
      const commission = Math.floor(itemPrice * (parseInt(process.env.COMMISSION_RATE || 10) / 100));

      const item = db.prepare('SELECT * FROM shop_items WHERE id = ?').get(itemId);

      // Vérification ultime (stock)
      if (item.stock !== -1 && item.stock <= 0) {
        await ctx.answerCbQuery('❌ ʟ\'ᴀʀᴛɪᴄʟᴇ ɴ\'ᴇsᴛ ᴘʟᴜs ᴅɪsᴘᴏɴɪʙʟᴇ.', { show_alert: true });
        await ctx.editMessageText('❌ ʀᴜᴘᴛᴜʀᴇ ᴅᴇ sᴛᴏᴄᴋ.');
        return ctx.scene.leave();
      }

      // Débiter l'utilisateur
      db.prepare('UPDATE users SET coins = coins - ?, total_spent = total_spent + ? WHERE user_id = ?')
        .run(itemPrice, itemPrice, userId);

      // Mettre à jour le stock si limité
      if (item.stock !== -1) {
        db.prepare('UPDATE shop_items SET stock = stock - 1 WHERE id = ?').run(itemId);
      }

      // Enregistrer la transaction
      db.prepare('INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)')
        .run(userId, 'spend', itemPrice, `ᴀᴄʜᴀᴛ: ${itemName}`);

      // Créditer les stats admin (votre marge)
      db.prepare('UPDATE admin_stats SET total_stars_earned = total_stars_earned + ?, total_transactions_value = total_transactions_value + ? WHERE id = 1')
        .run(commission, itemPrice);

      const updatedUser = db.prepare('SELECT coins FROM users WHERE user_id = ?').get(userId);

      await ctx.answerCbQuery('⏳ ᴇɴ ᴄᴏᴜʀs ᴅᴇ ʟɪᴠʀᴀɪsᴏɴ...');

      // Message de confirmation
      await ctx.editMessageText(
        `━━━━━━━━━━━━━━━━━━━━\n✅ *𝙰𝙲𝙷𝙰𝚃 𝙲𝙾𝙽𝙵𝙸𝚁𝙼𝙴́ !*\n\n📦 ᴀʀᴛɪᴄʟᴇ : *${itemName}*\n🪙 ᴘʀɪx : *${itemPrice} ᴄᴏɪɴs*\n💵 sᴏʟᴅᴇ : *${updatedUser.coins} ᴄᴏɪɴs*\n\n📥 ᴀʀᴛɪᴄʟᴇ ᴇɴ ᴄᴏᴜʀs ᴅᴇ ʟɪᴠʀᴀɪsᴏɴ...\n━━━━━━━━━━━━━━━━━━━━`,
        { parse_mode: 'Markdown' }
      );

      // 📥 LIVRAISON DU FICHIER
      await deliverFile(ctx, item, userId);

      return ctx.scene.leave();
    }
  }
);

// ===================== GESTION DES ACTIONS =====================
shopScene.action(/shopcat_.+/, async (ctx) => {
  ctx.wizard.selectStep(1);
  return ctx.wizard.steps[1](ctx);
});

shopScene.action(/shopitem_.+/, async (ctx) => {
  ctx.wizard.selectStep(2);
  return ctx.wizard.steps[2](ctx);
});

shopScene.action('shop_back', async (ctx) => {
  ctx.wizard.selectStep(0);
  return ctx.wizard.steps[0](ctx);
});

shopScene.action('shop_cancel', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText('🛒 ʟᴀ ʙᴏᴜᴛɪǫᴜᴇ ᴇsᴛ ғᴇʀᴍᴇ́.');
  await ctx.scene.leave();
});

shopScene.action('shop_confirm', async (ctx) => {
  ctx.wizard.selectStep(3);
  return ctx.wizard.steps[3](ctx);
});

// ===================== FONCTION DE LIVRAISON =====================
async function deliverFile(ctx, item, userId) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, '../../files', item.file_path);

  if (!fs.existsSync(filePath)) {
    await ctx.reply(
      '⚠️ *ғɪᴄʜɪᴇʀ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.*\n\nᴜɴ ᴀᴅᴍɪɴ ᴠᴀs ᴠᴏᴜs ᴄᴏɴᴛᴀᴄᴛᴇʀ ᴘᴏᴜʀ ʟᴀ ʟɪᴠʀᴀɪsᴏɴ ᴏᴜ ᴘᴏᴜʀ ᴜɴ ʀᴇᴍʙᴏᴜʀsᴇᴍᴇɴᴛ.',
      { parse_mode: 'Markdown' }
    );
    ctx.telegram.sendMessage(
      process.env.ADMIN_ID,
      `🚨 ғɪᴄʜɪᴇʀ ᴍᴀɴǫᴜᴀɴᴛ : ${item.file_path}\nᴀᴄʜᴇᴛᴇ́ ᴘᴀʀ : ${username}\nᴀʀᴛɪᴄʟᴇ : ${item.name}`
    );
    return;
  }

  const caption = `📦 *${item.name}*\n\n🛒 ᴍᴇʀᴄɪ ᴘᴏᴜʀ ᴠᴏᴛʀᴇ ᴀᴄʜᴀᴛ ᴇᴛ ᴀ ʟᴀ ᴘʀᴏᴄʜᴀɪɴᴇ.`;

  try {
    switch (item.file_type) {
      case 'photo':
        await ctx.replyWithPhoto(
          { source: filePath },
          { caption, parse_mode: 'Markdown' }
        );
        break;
      case 'video':
        await ctx.replyWithVideo(
          { source: filePath },
          { caption, parse_mode: 'Markdown' }
        );
        break;
      case 'audio':
        await ctx.replyWithAudio(
          { source: filePath },
          { caption, parse_mode: 'Markdown' }
        );
        break;
      case 'document':
      case 'archive':
      case 'app':
      default:
        await ctx.replyWithDocument(
          { source: filePath, filename: item.file_name },
          { caption, parse_mode: 'Markdown' }
        );
        break;
    }
  } catch (error) {
    console.error('Erreur livraison:', error);
    await ctx.reply('❌ ᴇʀʀᴇᴜʀ ʟᴏʀs ᴅᴇ ʟᴀ ʟɪᴠʀᴀɪsᴏɴ. ᴜɴ ᴀᴅᴍɪɴɪsᴛʀᴀᴛᴇᴜʀ ᴠᴀ ᴠᴏᴜs ᴄᴏɴᴛᴀᴄᴛᴇʀ.');
    ctx.telegram.sendMessage(
      process.env.ADMIN_ID,
      `🚨 ᴇʀʀᴇᴜʀ ᴅᴇ ʟɪᴠʀᴀɪsᴏɴ : ${item.file_path}\nᴀᴄʜᴇᴛᴇ́ ᴘᴀʀ : ${username}\nᴇʀʀᴇᴜʀ : ${error.message}`
    );
  }
}

module.exports = shopScene;