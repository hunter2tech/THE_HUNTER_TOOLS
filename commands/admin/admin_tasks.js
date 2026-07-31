const db = require('./database/db.js');
const { addCoins } = require('./utils/helpers.js');

module.exports = (bot) => {
  // ========== AJOUTER UNE TÂCHE ==========
  bot.command('addtask', (ctx) => {
    const { isAdmin } = require('./utils/permissions.js');
if (!isAdmin(ctx.from.id)) return;

    const args = ctx.message.text.split('|').map(s => s.trim());
    // Format : /addtask Titre | Description | Type | Target | Récompense
    // Exemple : /addtask Rejoindre canal | Rejoins @moncanal | join_channel | @moncanal | 100

    if (args.length < 5) {
      return ctx.reply(
        `━━━━━━━━━━━━━━━━━━━━\n📝 *❓ᴜsᴀɢᴇ : \`/addtask ᴛɪᴛʀᴇ | ᴅᴇsᴄʀɪᴘᴛɪᴏɴ | ᴛʏᴘᴇ | ᴄɪʙʟᴇ | ʀᴇ́ᴄᴏᴍᴘᴇɴsᴇ\`\n\nᴛʏᴘᴇs ᴅɪsᴘᴏɴɪʙʟᴇs :\n*• ᴊᴏɪɴ_ᴄʜᴀɴɴᴇʟ* — ʀᴇᴊᴏɪɴᴅʀᴇ ᴜɴ ᴄᴀɴᴀʟ\n*• ᴊᴏɪɴ_ɢʀᴏᴜᴘ* — ʀᴇᴊᴏɪɴᴅʀᴇ ᴜɴ ɢʀᴏᴜᴘᴇ\n*• ɪɴᴠɪᴛᴇ* — ɪɴᴠɪᴛᴇʀ # ᴀᴍɪs\n*• ᴍᴇssᴀɢᴇ* — ᴇɴᴠᴏʏᴇʀ ᴜɴ ᴍᴇssᴀɢᴇ sᴘᴇ́ᴄɪғɪǫᴜᴇ\n*• ᴄᴜsᴛᴏᴍ* — ᴛᴀ̂ᴄʜᴇ ᴍᴀɴᴜᴇʟʟᴇ\n\n*ᴇxᴇᴍᴘʟᴇ :*\n\`/addtask Rejoindre canal | Rejoins @kraveninfo | join_channel | @kraveninfo | 100\`\n━━━━━━━━━━━━━━━━━━━━`, 
        { parse_mode: 'Markdown' }
      );
    }

    const [title, description, type, target, rewardStr] = args;
    const reward = parseInt(rewardStr);

    if (isNaN(reward) || reward <= 0) {
      return ctx.reply('❌ ʀᴇ́ᴄᴏᴍᴘᴇɴsᴇ ɪɴᴠᴀʟɪᴅᴇ.');
    }

    const validTypes = ['join_channel', 'join_group', 'invite', 'message', 'custom'];
    if (!validTypes.includes(type)) {
      return ctx.reply(`❌ ᴛʏᴘᴇ ɪɴᴠᴀʟɪᴅᴇ.\nᴛʏᴘᴇs : ${validTypes.join(', ')}`);
    }

    db.prepare('INSERT INTO tasks (title, description, type, target, reward) VALUES (?, ?, ?, ?, ?)')
      .run(title, description, type, target, reward);

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n✅ *𝚃𝙰̂𝙲𝙷𝙴 𝙰𝙹𝙾𝚄𝚃𝙴́ !*\n\n📌 ᴛɪᴛʀᴇ : ${title}\n📝 ᴅᴇsᴄʀɪᴘᴛɪᴏɴ : ${description}\n🏷 ᴛʏᴘᴇ : ${type}\n🎯 ᴄɪʙʟᴇ : ${target}\n💰 ʀᴇ́ᴄᴏᴍᴘᴇɴsᴇ : ${reward} ᴄᴏɪɴs\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });

  // ========== LISTER LES TÂCHES ==========
  bot.command('listtasks', (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

    const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();

    if (tasks.length === 0) {
      return ctx.reply('📋 ᴀᴜᴄᴜɴᴇ ᴛᴀ̂ᴄʜᴇ ᴀᴊᴏᴜᴛᴇ́.');
    }

    let message = '━━━━━━━━━━━━━━━━━━━━\n📋 *𝙻𝙸𝚂𝚃𝙴 𝙳𝙴𝚂 𝚃𝙰̂𝙲𝙷𝙴𝚂*\n\n';

    for (const task of tasks) {
      const completions = db.prepare('SELECT COUNT(*) as count FROM task_completions WHERE task_id = ?')
        .get(task.id).count;

      message += `🆔 #${task.id} — ${task.is_active ? '🟢' : '🔴'} *${task.title}*\n`;
      message += `📝 ${task.description}\n`;
      message += `🏷 ${task.type} | 🎯 ${task.target}\n`;
      message += `💰 ${task.reward} ᴄᴏɪɴs | ✅ ${completions} ᴄᴏᴍᴘʟᴇ́ᴛɪᴏɴs\n`;
      message += `📅 ${task.created_at}\n━━━━━━━━━━━━━━━━━━━━`;
    }

    ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // ========== SUPPRIMER UNE TÂCHE ==========
  bot.command('removetask', (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

    const id = parseInt(ctx.message.text.split(' ')[1]);
    if (!id) return ctx.reply('❓ ᴜsᴀɢᴇ : /removetask <ɪᴅ>');

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    db.prepare('DELETE FROM task_completions WHERE task_id = ?').run(id);

    ctx.reply(`✅ ᴛᴀ̂ᴄʜᴇ #${id} sᴜᴘᴘʀɪᴍᴇ́ᴇ.`);
  });

  // ========== ACTIVER/DÉSACTIVER UNE TÂCHE ==========
  bot.command('toggletask', (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

    const id = parseInt(ctx.message.text.split(' ')[1]);
    if (!id) return ctx.reply('❓ ᴜsᴀɢᴇ : /toggletask <ɪᴅ>');

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) return ctx.reply('❌ ᴛᴀ̂ᴄʜᴇ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    const newStatus = task.is_active ? 0 : 1;
    db.prepare('UPDATE tasks SET is_active = ? WHERE id = ?').run(newStatus, id);

    ctx.reply(`✅ ᴛᴀ̂ᴄʜᴇ #${id} : ${newStatus ? '🟢 ᴀᴄᴛɪᴠᴇ́ᴇ' : '🔴 ᴅᴇ́sᴀᴄᴛɪᴠᴇ́ᴇ'}`);
  });

  // ========== VALIDER UNE TÂCHE MANUELLEMENT ==========
  bot.command('completetask', (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

    const args = ctx.message.text.split(' ');
    const userId = parseInt(args[1]);
    const taskId = parseInt(args[2]);

    if (!userId || !taskId) return ctx.reply('❓ ᴜsᴀɢᴇ : /completetask <ᴜsᴇʀ_ɪᴅ> <ᴛᴀsᴋ_ɪᴅ>');

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!task) return ctx.reply('❌ ᴛᴀ̂ᴄʜᴇ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    // Vérifier si déjà fait
    const existing = db.prepare('SELECT * FROM task_completions WHERE user_id = ? AND task_id = ?')
      .get(userId, taskId);

    if (existing) return ctx.reply('❌ ᴅᴇ́ᴊᴀ̀ ᴄᴏᴍᴘʟᴇ́ᴛᴇ́ᴇ.');

    db.prepare('INSERT INTO task_completions (user_id, task_id) VALUES (?, ?)').run(userId, taskId);
    addCoins(userId, task.reward, 'earn', `Tâche admin : ${task.title}`);

    ctx.reply(`✅ ᴛᴀ̂ᴄʜᴇ #${taskId} ᴠᴀʟɪᴅᴇ́ᴇ ᴘᴏᴜʀ ʟ'ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ${userId} (+${task.reward} ᴄᴏɪɴs)`);

    // Notifier l'utilisateur
    bot.telegram.sendMessage(userId,
      `━━━━━━━━━━━━━━━━━━━━\n✅ *ᴛᴀ̂ᴄʜᴇ ᴠᴀʟɪᴅᴇ́ᴇ ᴘᴀʀ ʟ'ᴀᴅᴍɪɴ !*\n\n📌 ${task.title}\n🪙 +${task.reward} ᴄᴏɪɴs\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    ).catch(() => {});
  });
};