const db = require('./database/db.js');
const fs = require('fs');
const path = require('path');

// Créer les dossiers files s'ils n'existent pas
const dirs = ['apps', 'ban_pics', 'ban_sc', 'checks', 'md_bots', 'unban_sc', 'telexwa_bots', 'ebooks', 'tutos', 'premium'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, './files', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    // Créer un fichier placeholder
    fs.writeFileSync(path.join(dirPath, '.gitkeep'), '');
  }
});

// Vider et repeupler la boutique
db.exec(`DELETE FROM shop_items`);

const items = [
    // ARTICLES PREMIUM
  {
  name: 'ᴛᴇʟᴇɢʀᴀᴍ2',
  description: 'Fichiers réservé aux premium',
  price: 500,                   
  file_path: 'premium/Telegram2.apk',
  file_type: 'app',
  file_name: 'Telegram2.apk',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ʜᴜɴᴛᴇʀ ʙᴜɢ',
  description: 'Fichiers réservé aux premium',
  price: 500,                   
  file_path: 'premium/ᴛʜᴇ_ʜᴜɴᴛᴇʀ_ʙᴜɢ.apk',
  file_type: 'app',
  file_name: 'ᴛʜᴇ_ʜᴜɴᴛᴇʀ_ʙᴜɢ.apk',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴘʀɪᴍᴇ ᴘᴜʀɢᴇ ʙᴜɢ',
  description: 'Fichiers réservé aux premium',
  price: 500,                   
  file_path: 'premium/𝙿𝚁𝙸𝙼𝙴_𝙿𝚄𝚁𝙶𝙴_𝙱𝚄𝙶.apk',
  file_type: 'app',
  file_name: '𝙿𝚁𝙸𝙼𝙴_𝙿𝚄𝚁𝙶𝙴_𝙱𝚄𝙶.apk',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴘʀɪᴍɪs ʙᴜɢ ʙᴏᴛ',
  description: 'Fichiers réservé aux premium',
  price: 1000,                   
  file_path: 'premium/!!𝙿𝚁𝙸𝙼𝙸𝚂_𝙽𝙴𝚆_𝚅𝙴𝚁𝚂𝙸𝙾𝙽.zip',
  file_type: 'archive',
  file_name: '!!𝙿𝚁𝙸𝙼𝙸𝚂_𝙽𝙴𝚆_𝚅𝙴𝚁𝚂𝙸𝙾𝙽.zip',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴅᴀʀᴋ ᴀɴɢᴇʟ ʙᴜɢ ʙᴏᴛ ᴠ2',
  description: 'Fichiers réservé aux premium',
  price: 500,                   
  file_path: 'premium/𝙳𝙰𝚁𝙺_𝙰𝙽𝙶𝙴𝙻_𝚅𝟸.𝟶_𝙿𝚁𝙾+!!!.zip',
  file_type: 'archive',
  file_name: '𝙳𝙰𝚁𝙺_𝙰𝙽𝙶𝙴𝙻_𝚅𝟸.𝟶_𝙿𝚁𝙾+!!!.zip',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴅᴀʀᴋ ᴀɴɢᴇʟ ʙᴜɢ ʙᴏᴛ ᴠ3',
  description: 'Fichiers réservé aux premium',
  price: 500,                   
  file_path: 'premium/𝙳𝙰𝚁𝙺_𝙰𝙽𝙶𝙴𝙻_𝚅𝟹.𝟶_𝙿𝚁𝙾!!!.zip',
  file_type: 'archive',
  file_name: '𝙳𝙰𝚁𝙺_𝙰𝙽𝙶𝙴𝙻_𝚅𝟹.𝟶_𝙿𝚁𝙾!!!.zip',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴅᴇɴᴛsᴜ ᴄʀᴀsʜ ᴠ2',
  description: 'Fichiers réservé aux premium',
  price: 500,                   
  file_path: 'premium/𝙳𝙴𝙽𝚃𝚂𝚄_𝙲𝚁𝙰𝚂𝙷_𝚅𝟸.zip',
  file_type: 'archive',
  file_name: '𝙳𝙴𝙽𝚃𝚂𝚄_𝙲𝚁𝙰𝚂𝙷_𝚅𝟸.zip',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴛʀᴀsʜᴇᴅɴᴜʟʟ ʙᴜɢ ʙᴏᴛ',
  description: 'Fichiers réservé aux premium',
  price: 500,                   
  file_path: 'premium/𝚃𝚁𝙰𝚂𝙷𝙴𝙳𝙽𝚄𝙻𝙻_𝙱𝚄𝙶.zip',
  file_type: 'archive',
  file_name: '𝚃𝚁𝙰𝚂𝙷𝙴𝙳𝙽𝚄𝙻𝙻_𝙱𝚄𝙶.zip',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴜᴄʜɪʜᴀ ʙᴜɢ ʙᴏᴛ ᴠ8',
  description: 'Fichiers réservé aux premium',
  price: 500,                   
  file_path: 'premium/𝚄𝙲𝙷𝙸𝙷𝙰_𝚅𝟾.zip',
  file_type: 'archive',
  file_name: '𝚄𝙲𝙷𝙸𝙷𝙰_𝚅𝟾.zip',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴅᴇɴᴛsᴜ ᴍᴅ ᴠ8',
  description: 'Fichiers réservé aux premium',
  price: 750,                   
  file_path: 'premium/𝙳𝙴𝙽𝚃𝚂𝚄_𝙼𝙳_𝚅𝟾.zip',
  file_type: 'archive',
  file_name: '𝙳𝙴𝙽𝚃𝚂𝚄_𝙼𝙳_𝚅𝟾.zip',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴄᴏᴍᴍᴀɴᴅᴇ ᴀᴜᴛᴏᴘʀᴏᴍᴏᴛᴇ',
  description: 'Fichiers réservé aux premium',
  price: 1000,                   
  file_path: 'premium/autopromote.js',
  file_type: 'document',
  file_name: 'autopromote.js',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ʙᴜᴅᴅʜᴀ ᴘʀɪᴍᴇ ᴍᴅ',
  description: 'Fichiers réservé aux premium',
  price: 500,                   
  file_path: 'premium/𝙱𝚄𝙳𝙳𝙷𝙰_𝙿𝚁𝙸𝙼𝙴.zip',
  file_type: 'archive',
  file_name: '𝙱𝚄𝙳𝙳𝙷𝙰_𝙿𝚁𝙸𝙼𝙴.zip',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ǫᴜᴇᴇɴ ʙᴜɢ ᴍᴅ',
  description: 'Fichiers réservé aux premium',
  price: 500,                   
  file_path: 'premium/𝚀𝚄𝙴𝙴𝙽_𝙱𝚄𝙶_𝚅𝟷.zip',
  file_type: 'archive',
  file_name: '𝚀𝚄𝙴𝙴𝙽_𝙱𝚄𝙶_𝚅𝟷.zip',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴄᴏᴍᴍᴀɴᴅᴇ ʙᴜɢ ʙʟᴀɴᴋɴᴇᴡ',
  description: 'Fichiers réservé aux premium',
  price: 1000,                   
  file_path: 'premium/blankNew.js',
  file_type: 'document',
  file_name: 'blankNew.js',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴄᴏᴍᴍᴀɴᴅᴇ ʙᴜɢ ᴄʀᴀsʜᴘᴜsʜ',
  description: 'Fichiers réservé aux premium',
  price: 1000,                   
  file_path: 'premium/crashpush.js',
  file_type: 'document',
  file_name: 'crashpush.js',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴄᴏᴍᴍᴀɴᴅᴇ ʙᴜɢ ᴅᴇʟᴀʏ-ɪɴᴠɪs',
  description: 'Fichiers réservé aux premium',
  price: 1000,                   
  file_path: 'premium/delayinvis.js',
  file_type: 'document',
  file_name: 'delayinvis.js',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
  name: 'ᴄᴏᴍᴍᴀɴᴅᴇ ʙᴜɢ ғʀᴇᴇᴢᴇᴜɪ',
  description: 'Fichiers réservé aux premium',
  price: 1000,                   
  file_path: 'premium/frezeui.js',
  file_type: 'document',
  file_name: 'frezeui.js',
  category: 'premium ',
  premium_only: 1              
  }, 
  {
    name: 'ᴄᴏᴍᴍᴀɴᴅᴇ ᴀᴜᴛᴏʙʟᴏᴄᴋ',
    description: 'Commande speciale de bot md',
    price: 1000,
    file_path: 'premium/autoblock.js',
    file_type: 'document',
    file_name: 'autoblock.js',
    category: 'premium'
    premium_only: 1
  },
    // ARTICLES LAMBDAS
  {
    name: 'ʜᴜɴᴛᴇʀ ᴀᴘᴋ ᴇᴅɪᴛᴏʀ',
    description: 'Appli gratuite pour modifier d\'autres applications',
    price: 800,
    file_path: 'apps/ʜᴜɴᴛᴇʀ_ᴀᴘᴋ_ᴇᴅɪᴛᴏʀ.apk',
    file_type: 'app',
    file_name: 'ʜᴜɴᴛᴇʀ_ᴀᴘᴋ_ᴇᴅɪᴛᴏʀ.apk',
    category: 'apps'
  },
  {
    name: 'ᴛʜᴇ ʜᴜɴᴛᴇʀ ʙᴀɴ',
    description: 'Appli de fournissage de scripts ban et unban',
    price: 750,
    file_path: 'apps/ᴛʜᴇ_ʜᴜɴᴛᴇʀ_ʙᴀɴ.apk',
    file_type: 'app',
    file_name: 'ᴛʜᴇ_ʜᴜɴᴛᴇʀ_ʙᴀɴ.apk',
    category: 'apps'
  },
  {
    name: 'ʟᴜsᴛ ᴀᴘᴋ ᴇᴅɪᴛᴏʀ',
    description: 'Apk gratuite de modification avancé de fichiers internes.',
    price: 800,
    file_path: 'apps/𝙻𝚄𝚂𝚃_𝙰𝙿𝙺_𝙴𝙳𝙸𝚃𝙾𝚁.apk',
    file_type: 'app',
    file_name: '𝙻𝚄𝚂𝚃_𝙰𝙿𝙺_𝙴𝙳𝙸𝚃𝙾𝚁.apk',
    category: 'apps'
  },
  {
    name: 'sᴀʏᴀɴ ʙᴀɴ ᴀᴘᴘ',
    description: 'App avancé en fournissage de fichiers puissants',
    price: 900,
    file_path: 'apps/𝚂𝙰𝚈𝙰𝙽_𝙱𝙰𝙽.apk',
    file_type: 'app',
    file_name: '𝚂𝙰𝚈𝙰𝙽_𝙱𝙰𝙽.apk',
    category: 'apps'
  },
  {
    name: 'ɪᴍɢ ʙᴀɴ ᴀ',
    description: 'Image de bannissement de comptes WhatsApp',
    price: 300,
    file_path: 'ban_pics/ban1.webp',
    file_type: 'photo',
    file_name: 'ban1.webp',
    category: 'ban_pics'
  },
  {
    name: 'ɪᴍɢ ʙᴀɴ ʙ',
    description: 'Image de bannissement de comptes WhatsApp',
    price: 300,
    file_path: 'ban_pics/ban2.jpg',
    file_type: 'photo',
    file_name: 'ban2.jpg',
    category: 'ban_pics'
  },
  {
    name: 'ɪᴍɢ ʙᴀɴ ᴄ',
    description: 'Image de bannissement de comptes WhatsApp',
    price: 300,
    file_path: 'ban_pics/ban3.jpg',
    file_type: 'photo',
    file_name: 'ban3.jpg',
    category: 'ban_pics '
  }, 
  {
    name: 'ɪᴍɢ ʙᴀɴ ᴅ',
    description: 'Image de bannissement de comptes WhatsApp',
    price: 300,
    file_path: 'ban_pics/ban4.jpg',
    file_type: 'photo',
    file_name: 'ban4.jpg',
    category: 'ban_pics'
  },
  {
    name: 'ɪᴍɢ ʙᴀɴ ᴇ',
    description: 'image de bannissement de comptes WhatsApp',
    price: 300,
    file_path: 'ban_pics/ban5.jpg',
    file_type: 'photo',
    file_name: 'ban5.jpg',
    category: 'ban_pics'
  },
  {
    name: 'ᴛʜᴇ ʜᴜɴᴛᴇʀ ᴄʜᴇᴄᴋ',
    description: 'Whatsapp free checker ban',
    price: 750,
    file_path: 'checks/ᴛʜᴇ_ʜᴜɴᴛᴇʀ_ᴢᴏɴᴇ.apk',
    file_type: 'app',
    file_name: 'ᴛʜᴇ_ʜᴜɴᴛᴇʀ_ᴢᴏɴᴇ.apk',
    category: 'checks'
  },
  {
    name: 'ᴡᴀ ʙᴀɴ ᴄʜᴇᴄᴋᴇʀ',
    description: 'Whatsapp free ban checker',
    price: 800,
    file_path: 'checks/𝐂𝐇𝐄𝐂𝐊_𝐁𝐀𝐍_2.21.13.28.apk',
    file_type: 'app',
    file_name: '𝐂𝐇𝐄𝐂𝐊_𝐁𝐀𝐍_2.21.13.28.apk',
    category: 'checks'
  },
  {
    name: 'ɢʙ ᴡʜᴀᴛsᴀᴘᴘ',
    description: 'Application Android modifiée',
    price: 1500,
    file_path: 'apps/GBWhatsapp_2.26.17.73.apk',
    file_type: 'app',
    file_name: 'GBWhatsapp_2.26.17.73.apk',
    category: 'apps'
  },
  {
    name: 'ᴡʜᴀᴛsᴀᴘᴘ ʙᴜsɪɴᴇss 2',
    description: 'Version modifié de WhatsApp business',
    price: 1500,
    file_path: 'apps/Whatsapp_Business3_2.26.3.79.apk',
    file_type: 'app',
    file_name: 'Whatsapp_Business3_2.26.3.79.apk',
    category: 'apps'
  },
  {
    name: 'ᴡʜᴀᴛsᴀᴘᴘ ʙᴜsɪɴᴇss 3',
    description: 'Application play store modifié',
    price: 1500,
    file_path: 'apps/Wa_Business_2.26.3.79.apk',
    file_type: 'app',
    file_name: 'Wa_Business_2.26.3.79.apk',
    category: 'apps '
  }, 
  {
    name: 'ʙʟᴀᴄᴋ ᴍᴅ ʙᴏᴛ',
    description: 'Fichier source bot telexwa opérationnel',
    price: 500,
    file_path: 'telexwa_bots/𝙱𝙻𝙰𝙲𝙺_𝙼𝙳_𝚅𝟸.zip',
    file_type: 'archive',
    file_name: '𝙱𝙻𝙰𝙲𝙺_𝙼𝙳_𝚅𝟸.zip',
    category: 'telexwa_bots'
  },
  {
    name: 'ᴅʀᴀᴄᴜʟᴀ ᴍᴅ ʙᴏᴛ',
    description: 'Fichier source bot telexwa opérationnel',
    price: 700,
    file_path: 'telexwa_bots/𝙳𝚁𝙰𝙲𝚄𝙻𝙰.zip',
    file_type: 'archive',
    file_name: '𝙳𝚁𝙰𝙲𝚄𝙻𝙰.zip',
    category: 'telexwa_bots'
  },
  {
    name: 'ғʀᴇᴇ ᴍᴅ ʙᴏᴛ',
    description: 'Fichier source bot telexwa opérationnel',
    price: 500,
    file_path: 'telexwa_bots/𝙵𝚁𝙴𝙴_𝙼𝙳_𝙱𝙾𝚃.zip',
    file_type: 'archive',
    file_name: '𝙵𝚁𝙴𝙴_𝙼𝙳_𝙱𝙾𝚃.zip',
    category: 'telexwa_bots'
  },
  {
    name: 'ᴋɪʀᴀ ᴍᴅ ʙᴏᴛ',
    description: 'Fichier source bot telexwa opérationnel',
    price: 500,
    file_path: 'telexwa_bots/𝙺𝙸𝚁𝙰_𝙼𝙳.zip',
    file_type: 'archive',
    file_name: '𝙺𝙸𝚁𝙰_𝙼𝙳.zip',
    category: 'telexwa_bots'
  },
  {
    name: 'ʟᴜsᴛ ᴍᴅ ʙᴏᴛ',
    description: 'Fichier source bot telexwa opérationnel',
    price: 900,
    file_path: 'telexwa_bots/𝙻𝚄𝚂𝚃_𝙼𝙳_𝚅𝟷.zip',
    file_type: 'archive',
    file_name: '𝙻𝚄𝚂𝚃_𝙼𝙳_𝚅𝟷.zip',
    category: 'telexwa_bots'
  },
  {
    name: 'ᴍᴄᴋɪɴɢᴇʀ ᴠᴏɪᴅ ᴍᴅ',
    description: 'Fichier source bot telexwa opérationnel',
    price: 500,
    file_path: 'telexwa_bots/𝙼𝙲𝙺𝙸𝙽𝙶𝙴𝚁_𝚇_𝚅𝙾𝙸𝙳𝟷.zip',
    file_type: 'archive',
    file_name: '𝙼𝙲𝙺𝙸𝙽𝙶𝙴𝚁_𝚇_𝚅𝙾𝙸𝙳𝟷.zip',
    category: 'telexwa_bots'
  },
  {
    name: 'ᴛᴇᴄʜ ᴍᴏɴᴅɪᴀʟ ᴍᴅ',
    description: 'Fichier source bot telexwa opérationnel',
    price: 750,
    file_path: 'telexwa_bots/𝚃𝙴𝙲𝙷_𝙼𝙾𝙽𝙳𝙸𝙰𝙻.zip',
    file_type: 'archive',
    file_name: '𝚃𝙴𝙲𝙷_𝙼𝙾𝙽𝙳𝙸𝙰𝙻.zip',
    category: 'telexwa_bots'
  }, 
  {
    name: 'ᴛᴇʟᴇᴡᴀ ғʀᴇᴇ ʙᴏᴛ',
    description: 'Fichier source bot telexwa opérationnel',
    price: 500,
    file_path: 'telexwa_bots/𝚃𝙴𝙻𝙴𝚆𝙰_𝙱𝙾𝚃_𝟹.zip',
    file_type: 'archive',
    file_name: '𝚃𝙴𝙻𝙴𝚆𝙰_𝙱𝙾𝚃_𝟹.zip',
    category: 'telexwa_bots'
  },
  {
    name: 'ᴀɴɢᴋᴀsᴀ ʙᴀsᴇ ᴍᴅ',
    description: 'Bot multifonction prêt à déployer',
    price: 500,
    file_path: 'md_bots/𝙰𝙽𝙶𝙺𝙰𝚂𝙰_𝙱𝙰𝚂𝙴_𝙼𝙳_𝚅𝟸.𝟶_𝙵𝚁𝙴𝙴.zip',
    file_type: 'archive',
    file_name: '𝙰𝙽𝙶𝙺𝙰𝚂𝙰_𝙱𝙰𝚂𝙴_𝙼𝙳_𝚅𝟸.𝟶_𝙵𝚁𝙴𝙴.zip',
    category: 'md_bots'
  },
  {
    name: 'ᴄʀᴇᴇᴘʏ ᴍᴅ ʙᴏᴛ',
    description: 'Bot multifonction prêt à déployer',
    price: 500,
    file_path: 'md_bots/𝙲𝚁𝙴𝙴𝙿𝚈_𝙼𝙳_𝚅𝟷_𝙼𝙰𝙸𝙽.zip',
    file_type: 'archive',
    file_name: '𝙲𝚁𝙴𝙴𝙿𝚈_𝙼𝙳_𝚅𝟷_𝙼𝙰𝙸𝙽.zip',
    category: 'md_bots'
  },
  {
    name: 'ʜɪɴᴀᴛᴀ ᴍᴅ ʙᴏᴛ ',
    description: 'Bot multifonction prêt à déployer',
    price: 500,
    file_path: 'md_bots/𝙷𝙸𝙽𝙰𝚃𝙰_𝙼𝙳.zip',
    file_type: 'archive',
    file_name: '𝙷𝙸𝙽𝙰𝚃𝙰_𝙼𝙳.zip',
    category: 'md_bots'
  },
  {
    name: 'ᴊᴜɴᴇ ᴍᴅ ʙᴏᴛ',
    description: 'Bot multifonction prêt à déployer',
    price: 500,
    file_path: 'md_bots/𝙹𝚄𝙽𝙴_𝙼𝙳_𝙼𝙰𝙸𝙽.zip',
    file_type: 'archive',
    file_name: '𝙹𝚄𝙽𝙴_𝙼𝙳_𝙼𝙰𝙸𝙽.zip',
    category: 'md_bots'
  },
  {
    name: 'ʟᴀᴅʏ ʙᴇʟʟᴀ ᴍᴅ ʙᴏᴛ',
    description: 'Bot multifonction prêt à déployer',
    price: 500,
    file_path: 'md_bots/𝙻𝙰𝙳𝚈_𝙱𝙴𝙻𝙻𝙰_𝚅𝟹_𝙼𝙰𝙸𝙽.zip',
    file_type: 'archive',
    file_name: '𝙻𝙰𝙳𝚈_𝙱𝙴𝙻𝙻𝙰_𝚅𝟹_𝙼𝙰𝙸𝙽.zip',
    category: 'md_bots'
  }, 
  {
    name: 'ɴᴇxᴜs ᴀssɪsᴛᴀɴᴛ ʙᴏᴛ',
    description: 'Bot multifonction prêt à déployer',
    price: 500,
    file_path: 'md_bots/𝙽𝙴𝚇𝚄𝚂_𝙰𝚂𝚂𝙸𝚂𝚃𝙰𝙽𝚃.zip',
    file_type: 'archive',
    file_name: '𝙽𝙴𝚇𝚄𝚂_𝙰𝚂𝚂𝙸𝚂𝚃𝙰𝙽𝚃.zip',
    category: 'md_bots'
  },
  {
    name: 'sʟᴀʏ ᴍᴅ ʙᴏᴛ',
    description: 'Bot multifonction prêt à déployer',
    price: 500,
    file_path: 'md_bots/𝚂𝙻𝙰𝚈_𝙼𝙳_𝙽𝙾_𝙴𝙽𝙲.zip',
    file_type: 'archive',
    file_name: '𝚂𝙻𝙰𝚈_𝙼𝙳_𝙽𝙾_𝙴𝙽𝙲.zip',
    category: 'md_bots'
  },
  {
    name: 'ᴡʜᴀᴛsᴀᴘᴘ ʙᴀsᴇ ʙᴏᴛ',
    description: 'Bot multifonction prêt à déployer',
    price: 500,
    file_path: 'md_bots/𝚆𝙰_𝙱𝙰𝚂𝙴_𝙱𝙾𝚃_𝙼𝙰𝙸𝙽.zip',
    file_type: 'archive',
    file_name: '𝚆𝙰_𝙱𝙰𝚂𝙴_𝙱𝙾𝚃_𝙼𝙰𝙸𝙽.zip',
    category: 'md_bots'
  },
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊',
    description: 'Script pour une demande de debannissement de compte WhatsApp',
    price: 20,
    file_path: 'unban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊.txt',
    category: 'unban_sc'
  },
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋',
    description: 'Script pour une demande de debannissement de compte WhatsApp',
    price: 20,
    file_path: 'unban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋.txt',
    category: 'unban_sc'
  },
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌',
    description: 'Script pour une demande de debannissement de compte WhatsApp',
    price: 20,
    file_path: 'unban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌.txt',
    category: 'unban_sc'
  },
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍',
    description: 'Script pour une demande de debannissement de compte WhatsApp',
    price: 20,
    file_path: 'unban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍.txt',
    category: 'unban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➎',
    description: 'Script pour une demande de debannissement de compte WhatsApp',
    price: 20,
    file_path: 'unban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➎.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➎.txt',
    category: 'unban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➊',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➊.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➊.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➋',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➋.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➋.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➌',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➌.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➌.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➍',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➍.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➍.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➎',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➎.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➎.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➏',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➏.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➏.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➐',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➐.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➐.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➑',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➑.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➑.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➒',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➒.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ⓿➒.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊⓿',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊⓿.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊⓿.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➊',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➊.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➊.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➋',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➋.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➋.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➌',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➌.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➌.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➍',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➍.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➍.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➎',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➎.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➎.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➏',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➏.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➏.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➐',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➐.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➐.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➑',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➑.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➑.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➒',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➒.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➊➒.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋⓿',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋⓿.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋⓿.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➊',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➊.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➊.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➋',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➋.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➋.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➌',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➌.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➌.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➍',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➍.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➍.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➎',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➎.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➎.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➏',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➏.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➏.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➐',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➐.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➐.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➑',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➑.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➑.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➒',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➒.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➋➒.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌⓿',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌⓿.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌⓿.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➊',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➊.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➊.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➋',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➋.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➋.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➌',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➌.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➌.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➍',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➍.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➍.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➎',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➎.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➎.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➏',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➏.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➏.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➐',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➐.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➐.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➑',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➑.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➑.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➒',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➒.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➌➒.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍⓿',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍⓿.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍⓿.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➊',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➊.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➊.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➋',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➋.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➋.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➌',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➌.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➌.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➍',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➍.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➍.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➎',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➎.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➎.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➏',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➏.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➏.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➐',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➐.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➐.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➑',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➑.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➑.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➒',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➒.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➍➒.txt',
    category: 'ban_sc'
  }, 
  {
    name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➎⓿',
    description: 'Script de bannissement de compte WhatsApp',
    price: 50,
    file_path: 'ban_sc/⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➎⓿.txt',
    file_type: 'document',
    file_name: '⏤͟͞͞⃟⃟ ⃟⃟📦ʜᴜɴᴛᴇʀ ➎⓿.txt',
    category: 'ban_sc'
  }
];

const insert = db.prepare(`
  INSERT INTO shop_items (name, description, price, file_path, file_type, file_name, category)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const item of items) {
  insert.run(item.name, item.description, item.price, item.file_path, item.file_type, item.file_name, item.category);
}

console.log('✅ Boutique initialisée avec', items.length, 'articles');