const db = require('./database/db.js');
const { Markup } = require('telegraf');
const { addCoins } = require('./utils/helpers.js');

module.exports = (bot) => {
  // ========== VOIR LES TÂCHES DISPONIBLES ==========
  bot.command('tasks', (ctx) => {
    const tasks = db.prepare('SELECT * FROM tasks WHERE is_active = 1').all();

    if (tasks.length === 0) {
      return ctx.reply('📋 ᴀᴜᴄᴜɴᴇ ᴛᴀ̂ᴄʜᴇ ɴ\'ᴇsᴛ ᴅɪsᴘᴏɴɪʙʟᴇ ᴘᴏᴜʀ ʟᴇ ᴍᴏᴍᴇɴᴛ. ʀᴇᴠᴇɴɴᴇᴢ ᴘʟᴜs ᴛᴀʀᴅ!');
    }

    let message = '━━━━━━━━━━━━━━━━━━━━\n📋 *ᴛᴀ̂ᴄʜᴇs ᴅɪsᴘᴏɴɪʙʟᴇs*\n\n';
    message += 'ᴄᴏᴍᴘʟᴇ́ᴛᴇᴢ ᴅᴇs ᴛᴀ̂ᴄʜᴇs ᴘᴏᴜʀ ɢᴀɢɴᴇʀ ᴅᴇs ᴄᴏɪɴs !\n\n';

    const buttons = [];

    for (const task of tasks) {
      // Vérifier si déjà complétée
      const completed = db.prepare('SELECT * FROM task_completions WHERE user_id = ? AND task_id = ?')
        .get(ctx.from.id, task.id);

      const status = completed ? '✅' : '⬜';
      
      message += `${status} *${task.title}*\n📝 ${task.description}\n💰 ʀᴇ́ᴄᴏᴍᴘᴇɴsᴇ : *${task.reward} ᴄᴏɪɴs*\n`;
      if (completed) {
        message += `✅ ᴄᴏᴍᴘʟᴇ́ᴛᴇ́ᴇ ʟᴇ ${new Date(completed.completed_at).toLocaleDateString('fr-FR')}\n`;
      }
      message += '\n';

      if (!completed) {
        buttons.push([Markup.button.callback(
          `🔗 ${task.title} — ${task.reward}💰`,
          `do_task_${task.id}`
        )]);
      }
    }

    if (buttons.length > 0) {
      ctx.reply(message, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons)
      });
    } else {
      message += '✅ *ᴠᴏᴜs ᴀᴠᴇᴢ ᴄᴏᴍᴘʟᴇ́ᴛᴇ́ ᴛᴏᴜᴛᴇs ʟᴇs ᴛᴀ̂ᴄʜᴇs ᴅɪsᴘᴏɴɪʙʟᴇs !*';
      ctx.reply(message, { parse_mode: 'Markdown' });
    }
  });

  // ========== EXÉCUTER UNE TÂCHE ==========
  bot.action(/do_task_(\d+)/, async (ctx) => {
    const taskId = parseInt(ctx.match[1]);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND is_active = 1').get(taskId);

    if (!task) {
      return ctx.answerCbQuery('❌ ᴛᴀ̂ᴄʜᴇ ɪɴᴅɪsᴘᴏɴɪʙʟᴇ.', { show_alert: true });
    }

    // Vérifier si déjà complétée
    const alreadyDone = db.prepare('SELECT * FROM task_completions WHERE user_id = ? AND task_id = ?')
      .get(ctx.from.id, taskId);

    if (alreadyDone) {
      return ctx.answerCbQuery('✅ ᴅᴇ́ᴊᴀ̀ ᴄᴏᴍᴘʟᴇ́ᴛᴇ́ᴇ !', { show_alert: true });
    }

    await ctx.answerCbQuery();

    switch (task.type) {
      case 'join_channel':
        handleJoinChannel(ctx, task);
        break;
      case 'join_group':
        handleJoinGroup(ctx, task);
        break;
      case 'invite':
        handleInvite(ctx, task);
        break;
      case 'message':
        handleMessage(ctx, task);
        break;
      case 'custom':
        handleCustom(ctx, task);
        break;
      default:
        ctx.reply('❌ ᴛʏᴘᴇ ᴅᴇ ᴛᴀᴄʜᴇ ɪɴᴄᴏɴɴᴜ.');
    }
  });

  // ========== TÂCHE : REJOINDRE UN CANAL ==========
  async function handleJoinChannel(ctx, task) {
    const channelUsername = task.target; // ex: @moncanal

    try {
      // Vérifier si l'utilisateur est membre
      const member = await ctx.telegram.getChatMember(channelUsername, ctx.from.id);

      if (['member', 'administrator', 'creator'].includes(member.status)) {
        completeTask(ctx, task);
      } else {
        const keyboard = Markup.inlineKeyboard([
          [Markup.button.url('📢 ʀᴇᴊᴏɪɴᴅʀᴇ ʟᴇ ᴄᴀɴᴀʟ', `https://t.me/${channelUsername.replace('@', '')}`)],
          [Markup.button.callback('✅ ᴠᴇ́ʀɪғɪᴇʀ', `check_task_${task.id}`)]
        ]);

        await ctx.reply(
          `📢 *${task.title}*\n\n` +
          `ʀᴇᴊᴏɪɢɴᴇᴢ ${channelUsername} ᴘᴜɪs ᴄʟɪǫᴜᴇᴢ sᴜʀ "Vérifier".`,
          { parse_mode: 'Markdown', ...keyboard }
        );
      }
    } catch (error) {
      await ctx.reply('❌ ᴇʀʀᴇᴜʀ : ᴄᴀɴᴀʟ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ. ᴄᴏɴᴛᴀᴄᴛᴇᴢ ᴜɴ ᴀᴅᴍɪɴ.');
    }
  }

  // ========== TÂCHE : REJOINDRE UN GROUPE ==========
  async function handleJoinGroup(ctx, task) {
    // Même logique que join_channel
    handleJoinChannel(ctx, task);
  }

  // ========== VÉRIFIER L'ADHÉSION ==========
  bot.action(/check_task_(\d+)/, async (ctx) => {
    const taskId = parseInt(ctx.match[1]);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

    if (!task) return ctx.answerCbQuery('❌ ᴛᴀ̂ᴄʜᴇ ᴇxᴘɪʀᴇ́ᴇ.', { show_alert: true });

    try {
      const member = await ctx.telegram.getChatMember(task.target, ctx.from.id);

      if (['member', 'administrator', 'creator'].includes(member.status)) {
        completeTask(ctx, task);
        await ctx.deleteMessage();
      } else {
        await ctx.answerCbQuery('❌ ᴠᴏᴜs ɴ\'ᴀᴠᴇᴢ ᴘᴀs ᴇɴᴄᴏʀᴇ ʀᴇᴊᴏɪɴᴛ.', { show_alert: true });
      }
    } catch (error) {
      await ctx.answerCbQuery('❌ ᴇʀʀᴇᴜʀ ᴅᴇ ᴠᴇ́ʀɪғɪᴄᴀᴛɪᴏɴ.', { show_alert: true });
    }
  });

  // ========== TÂCHE : INVITER DES AMIS ==========
  async function handleInvite(ctx, task) {
    const requiredInvites = parseInt(task.target); // ex: "3"
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(ctx.from.id);

    const inviteCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE referred_by = ?')
      .get(ctx.from.id).count;

    if (inviteCount >= requiredInvites) {
      completeTask(ctx, task);
    } else {
      ctx.reply(
        `━━━━━━━━━━━━━━━━━━━━\n👥 *${task.title}*\n\nᴠᴏᴜs ᴀᴠᴇᴢ ɪɴᴠɪᴛᴇ́ : *${inviteCount}/${requiredInvites}* ᴘᴇʀsᴏɴɴᴇs\n\nᴠᴏᴛʀᴇ ʟɪᴇɴ : /ʀᴇғᴇʀʀᴀʟ\n━━━━━━━━━━━━━━━━━━━━`,
        { parse_mode: 'Markdown' }
      );
    }
  }

  // ========== TÂCHE : ENVOYER UN MESSAGE ==========
  async function handleMessage(ctx, task) {
    await ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n💬 *${task.title}*\n\n` +
      `ᴇɴᴠᴏʏᴇᴢ ᴇxᴀᴄᴛᴇᴍᴇɴᴛ ʟᴇ ᴍᴇssᴀɢᴇ :\n` +
      `\`${task.target}\`\n\n` +
      `ᴘᴜɪs ᴛᴀᴘᴇᴢ /tasks ᴘᴏᴜʀ ᴠᴀʟɪᴅᴇʀ.\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );

    // Écouter le prochain message
    bot.once('text', (msgCtx) => {
      if (msgCtx.message.text.trim() === task.target.trim()) {
        completeTask(msgCtx, task);
      }
    });
  }

  // ========== TÂCHE CUSTOM ==========
  async function handleCustom(ctx, task) {
    await ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n📌 *${task.title}*\n\n` +
      `${task.description}\n\n` +
      `🪙 ʀᴇ́ᴄᴏᴍᴘᴇɴsᴇ : *${task.reward} ᴄᴏɪɴs*\n\n` +
      `⚠️ ᴜɴ ᴀᴅᴍɪɴ ᴠᴇ́ʀɪғɪᴇʀᴀ ᴍᴀɴᴜᴇʟʟᴇᴍᴇɴᴛ ᴄᴇᴛᴛᴇ ᴛᴀ̂ᴄʜᴇ.\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );

    // Notifier l'admin
    ctx.telegram.sendMessage(
      process.env.ADMIN_ID,
      `━━━━━━━━━━━━━━━━━━━━\n🔔 *𝚃𝙰̂𝙲𝙷𝙴 𝙲𝚄𝚂𝚃𝙾𝙼𝙸𝚂𝙴́ 𝙳𝙴𝙼𝙰𝙽𝙳𝙴́*\n\n👤 ᴜᴛɪʟɪsᴀᴛᴇᴜʀ : ${ctx.from.first_name} (ɪᴅ: ${ctx.from.id})\n📌 ᴛᴀ̂ᴄʜᴇ : ${task.title}\n📝 ᴅᴇsᴄʀɪᴘᴛɪᴏɴ : ${task.description}\n\nᴛᴀᴘ \`/completetask ${ctx.from.id} ${task.id}\` ᴘᴏᴜʀ ᴠᴀʟɪᴅᴇʀ \n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  }

  // ========== COMPLÉTER UNE TÂCHE ==========
  function completeTask(ctx, task) {
    try {
      db.prepare('INSERT INTO task_completions (user_id, task_id) VALUES (?, ?)')
        .run(ctx.from.id, task.id);

      addCoins(ctx.from.id, task.reward, 'earn', `Tâche : ${task.title}`);

      const user = db.prepare('SELECT coins FROM users WHERE user_id = ?').get(ctx.from.id);

      ctx.reply(
        `━━━━━━━━━━━━━━━━━━━━\n✅ *𝚃𝙰̂𝙲𝙷𝙴 𝙲𝙾𝙼𝙿𝙻𝙴́𝚃𝙴́ !*\n\n📌 ${task.title}\n🪙 +${task.reward} ᴄᴏɪɴs\n💰 ɴᴏᴜᴠᴇᴀᴜ sᴏʟᴅᴇ : *${user.coins} ᴄᴏɪɴs*\n━━━━━━━━━━━━━━━━━━━━`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      if (error.message.includes('UNIQUE')) {
        ctx.reply('✅ ᴠᴏᴜs ᴀᴠᴇᴢ ᴅᴇ́ᴊᴀ̀ ᴄᴏᴍᴘʟᴇ́ᴛᴇ́ ᴄᴇᴛᴛᴇ ᴛᴀ̂ᴄʜᴇ.');
      } else {
        console.error('Erreur completeTask:', error);
        ctx.reply('❌ ᴇʀʀᴇᴜʀ ʟᴏʀs ᴅᴇ ʟᴀ ᴠᴀʟɪᴅᴀᴛɪᴏɴ.');
      }
    }
  }
};