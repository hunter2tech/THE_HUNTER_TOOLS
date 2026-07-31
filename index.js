require('dotenv').config();
const bot = require('./bot.js');

// Middleware session (obligatoire pour les scènes)
bot.use(session());

// Enregistrer la scène
const stage = new Scenes.Stage([shopScene]);
bot.use(stage.middleware());

// Initialiser la base de données
require('./database/db.js');
require('./database/seed_coins.js');    
require('./database/ban_check.js')(bot);
require('./database/force_sub.js')(bot);

// Charger les commandes
require('./commands/start.js')(bot);
require('./commands/profile.js')(bot);
require('./commands/daily.js')(bot);
require('./commands/shop.js')(bot);
require('./commands/referral.js')(bot);
require('./commands/buycoins.js')(bot); 
require('./commands/tasks.js')(bot); 
require('./commands/claim.js')(bot); 
require('./commands/feedback.js')(bot);         
require('./commands/transfer.js')(bot);     
require('./commands/ping.js')(bot);     
require('./commands/help.js')(bot);

// Commandes admin
require('./commands/admin/admin_channels.js')(bot);
require('./commands/admin/admin.js')(bot);
require('./commands/admin/admin_tasks.js')(bot);
require('./commands/admin/addcoins.js')(bot);
require('./commands/admin/removecoins.js')(bot);
require('./commands/admin/ban.js')(bot);
require('./commands/admin/unban.js')(bot);
require('./commands/admin/userinfo.js')(bot);
require('./commands/admin/gift.js')(bot);
require('./commands/admin/gifts.js')(bot);
require('./commands/admin/delgift.js')(bot);
require('./commands/admin/broadcast.js')(bot);
require('./commands/admin/addadmin.js')(bot);
require('./commands/admin/removeadmin.js')(bot);
require('./commands/admin/admins.js')(bot);
require('./commands/admin/admin_menu.js')(bot);
require('./commands/admin/addpremium.js')(bot);
require('./commands/admin/removepremium.js')(bot);
require('./commands/admin/premiuminfo.js')(bot);
require('./commands/admin/togglepremium.js')(bot);
require('./commands/admin/statistics.js')(bot);
require('./commands/admin/super.js')(bot);

// Ajouter articles boutique (une fois)
const db = require('./database/db.js');
const seedShop = require('./database/seed.js');
  const count = db.prepare('SELECT COUNT(*) as count FROM shop_items').get().count;
  if (count === 0) {
    db.prepare(`INSERT INTO shop_items (name, description, price, category) VALUES
      ('Boost de profil', 'Votre profil mis en avant 24h', 200, 'boost'),
      ('Badge VIP', 'Badge exclusif sur votre profil', 500, 'cosmetic'),
      ('Accès Premium', 'Accès à des fonctionnalités exclusives 7 jours', 1000, 'premium')
    `).run();
    console.log('✅ Boutique initialisée');
  }
  
  // Initialiser admin_stats si vide
  const statsCount = db.prepare('SELECT COUNT(*) as count FROM admin_stats').get().count;
  if (statsCount === 0) {
    db.prepare('INSERT INTO admin_stats (id) VALUES (1)').run();
  }

seedShop();

const ensureFiles = require('./utils/downloadFiles');

(async () => {
  await ensureFiles();   // <-- télécharge les fichiers si absents
  bot.launch(() => console.log('🤖 ʟᴇ ʙᴏᴛ ʟᴇ ᴘʟᴜs ᴄᴏᴏʟ ᴅᴜ ᴍᴏɴᴅᴇ ᴇsᴛ ʟᴀɴᴄᴇ́ ᴇᴛ ᴇɴ ʟɪɢɴᴇ ᴘʀᴇ̂ᴛ ᴀ ʀᴇᴄᴇᴠᴏɪʀ ᴠᴏs ᴄᴏᴍᴍᴀɴᴅᴇs !'));
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));