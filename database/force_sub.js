const db = require('./database/db.js');
const { Markup } = require('telegraf');

// Cache pour éviter de spammer l'API Telegram
const checkCache = new Map();
const CACHE_DURATION = 60 * 1000; // 1 minute

module.exports = (bot) => {
  bot.use(async (ctx, next) => {
    // Ignorer si pas d'utilisateur ou si c'est l'admin
    if (!ctx.from) return next();
    if (ctx.from.id.toString() === process.env.ADMIN_ID) return next();

    const userId = ctx.from.id;

    // Commandes toujours accessibles
    const allowedCommands = ['/start'];
    const messageText = ctx.message?.text || '';
    const isAllowedCommand = allowedCommands.some(cmd => messageText.startsWith(cmd));

    // Vérifier le cache
    const now = Date.now();
    const cached = checkCache.get(userId);
    if (cached && (now - cached.timestamp) < CACHE_DURATION && cached.subscribed) {
      return next();
    }

    // Récupérer toutes les chaînes obligatoires actives
    const channels = db.prepare('SELECT * FROM required_channels WHERE is_active = 1').all();

    if (channels.length === 0) {
      // Pas de chaîne obligatoire, on laisse passer
      checkCache.set(userId, { timestamp: now, subscribed: true });
      return next();
    }

    // Vérifier l'abonnement à chaque chaîne
    const notSubscribed = [];

    for (const channel of channels) {
      try {
        const member = await ctx.telegram.getChatMember(channel.channel_username, userId);
        
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);
        
        if (!isMember) {
          notSubscribed.push(channel);
        }
      } catch (error) {
        // Si le bot ne peut pas vérifier (bot pas admin du canal), on ignore
        console.error(`Erreur vérification ${channel.channel_username}:`, error.message);
      }
    }

    // Si l'utilisateur est abonné à tout, on laisse passer
    if (notSubscribed.length === 0) {
      checkCache.set(userId, { timestamp: now, subscribed: true });
      return next();
    }

    // Si c'est une commande autorisée, on laisse passer
    if (isAllowedCommand) {
      checkCache.set(userId, { timestamp: now, subscribed: false });
      return next();
    }

    // Bloquer l'accès et afficher les chaînes à rejoindre
    let message = '🔒 *𝙰𝙲𝙲𝙴̀𝚂 𝚁𝙴𝚂𝚃𝚁𝙴𝙸𝙽𝚃*\n\nᴠᴇᴜɪʟʟᴇᴢ ʀᴇᴊᴏɪɴᴅʀᴇ ᴛᴏᴜᴛ ʟᴇs ᴄᴀɴᴀᴜx ᴇᴛ ʀᴇ́ᴇssᴀʏᴇᴢ:\n\n';

    const buttons = [];

    for (const channel of notSubscribed) {
      const username = channel.channel_username.replace('@', '');
      const emoji = channel.channel_type === 'group' ? '👥' : '📢';
      
      message += `${emoji} *${channel.channel_title || channel.channel_username}*\n`;
      
      buttons.push([
        Markup.button.url(
          `🔗 ʀᴇᴊᴏɪɴᴅʀᴇ ${channel.channel_title || channel.channel_username}`,
          `https://t.me/${username}`
        )
      ]);
    }

    buttons.push([
      Markup.button.callback('✅ ᴊ\'ᴀɪ ʀᴇᴊᴏɪɴᴛ', 'check_subscription')
    ]);

    message += '\n*ᴠᴇᴜɪʟʟᴇᴢ ʀᴇᴊᴏɪɴᴅʀᴇ ᴛᴏᴜᴛ ʟᴇs ᴄᴀɴᴀᴜx ᴇᴛ ʀᴇ́ᴇssᴀʏᴇᴢ*.';

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery('❌ ᴀᴄᴄᴇ̀s ʀᴇғᴜsᴇ́. ᴠᴇᴜɪʟʟᴇᴢ ᴅ\'ᴀʙᴏʀᴅ ʀᴇᴊᴏɪɴᴅʀᴇ ᴛᴏᴜᴛ ʟᴇs ᴄᴀɴᴀᴜx.', { show_alert: true });
      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons)
      });
    } else {
      await ctx.reply(message, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons)
      });
    }

    // Ne pas continuer
    return;
  });

  // ========== BOUTON DE VÉRIFICATION ==========
  bot.action('check_subscription', async (ctx) => {
    const userId = ctx.from.id;

    const channels = db.prepare('SELECT * FROM required_channels WHERE is_active = 1').all();
    const notSubscribed = [];

    for (const channel of channels) {
      try {
        const member = await ctx.telegram.getChatMember(channel.channel_username, userId);
        if (!['member', 'administrator', 'creator'].includes(member.status)) {
          notSubscribed.push(channel);
        }
      } catch (error) {
        console.error(`Erreur vérification ${channel.channel_username}:`, error.message);
      }
    }

    if (notSubscribed.length === 0) {
      // Tout est bon !
      checkCache.set(userId, { timestamp: Date.now(), subscribed: true });
      
      await ctx.answerCbQuery('✅ ᴀᴄᴄᴇ̀s ᴅᴇ́ʙʟᴏǫᴜᴇ́. ᴠᴏᴜs ᴀᴠᴇᴢ ᴅᴇ́sᴏʀᴍᴀɪs ᴀᴄᴄᴇ̀s ᴀ ᴛᴏᴜᴛᴇs ʟᴇs ᴄᴏᴍᴍᴀɴᴅᴇs ᴅᴜ ʙᴏᴛ!', { show_alert: true });
      await ctx.editMessageText(
        '✅ *ᴀᴄᴄᴇ̀s ᴅᴇ́ʙʟᴏǫᴜᴇ́ !*\n\nᴠᴏᴜs ᴀᴠᴇᴢ ᴅᴇsᴏʀᴍᴀɪs ᴀᴄᴄᴇ̀s ᴀ ᴛᴏᴜᴛᴇs ʟᴇs ᴄᴏᴍᴍᴀɴᴅᴇs ᴅᴜ ʙᴏᴛ.\nᴛᴀᴘᴇᴢ /help ᴘᴏᴜʀ ᴠᴏɪʀ ᴛᴏᴜᴛᴇs ʟᴇs ᴄᴏᴍᴍᴀɴᴅᴇs.',
        { parse_mode: 'Markdown' }
      );
    } else {
      // Encore des chaînes manquantes
      let message = '❌ *ᴠᴏᴜs ᴅᴇᴠᴇᴢ ᴇɴᴄᴏʀᴇ ʀᴇᴊᴏɪɴᴅʀᴇ:*\n\n';
      
      for (const channel of notSubscribed) {
        message += `• ${channel.channel_title || channel.channel_username}\n`;
      }

      await ctx.answerCbQuery('❌ ᴄʜᴀɪ̂ɴᴇs ᴍᴀɴǫᴜᴀɴᴛᴇs', { show_alert: true });
      await ctx.editMessageText(message, { parse_mode: 'Markdown' });
    }
  });
};