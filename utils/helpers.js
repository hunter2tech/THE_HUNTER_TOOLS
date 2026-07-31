const db = require('./database/db.js');

/**
 * Vérifie si un utilisateur existe, le crée si non
 * @param {number} userId
 * @param {object} userData - { username, first_name }
 * @returns {object} user
 */
function getOrCreateUser(userId, userData = {}) {
  let user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);

  if (!user) {
    const refCode = 'REF' + userId + Math.random().toString(36).substring(2, 6).toUpperCase();
    db.prepare(`
      INSERT INTO users (user_id, username, first_name, coins, ref_code)
      VALUES (?, ?, ?, 100, ?)
    `).run(userId, userData.username || null, userData.first_name || 'Unknown', refCode);

    user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
  }

  return user;
}

/**
 * Ajoute des coins à un utilisateur
 * @param {number} userId
 * @param {number} amount
 * @param {string} type - 'earn', 'daily', 'referral', 'admin'
 * @param {string} description
 */
function addCoins(userId, amount, type = 'earn', description = '') {
  db.prepare('UPDATE users SET coins = coins + ?, total_earned = total_earned + ? WHERE user_id = ?')
    .run(amount, amount, userId);

  db.prepare('INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)')
    .run(userId, type, amount, description);

  return db.prepare('SELECT coins FROM users WHERE user_id = ?').get(userId).coins;
}

/**
 * Retire des coins à un utilisateur
 * @param {number} userId
 * @param {number} amount
 * @param {string} description
 * @returns {boolean} - false si solde insuffisant
 */
function removeCoins(userId, amount, description = '') {
  const user = db.prepare('SELECT coins FROM users WHERE user_id = ?').get(userId);

  if (!user || user.coins < amount) {
    return false;
  }

  db.prepare('UPDATE users SET coins = coins - ?, total_spent = total_spent + ? WHERE user_id = ?')
    .run(amount, amount, userId);

  db.prepare('INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)')
    .run(userId, 'spend', amount, description);

  // Commission admin
  const commission = Math.floor(amount * (parseInt(process.env.COMMISSION_RATE || 100) / 100));
  db.prepare('UPDATE admin_stats SET total_stars_earned = total_stars_earned + ?, total_transactions_value = total_transactions_value + ? WHERE id = 1')
    .run(commission, amount);

  return db.prepare('SELECT coins FROM users WHERE user_id = ?').get(userId).coins;
}

/**
 * Formate un nombre avec séparateur de milliers
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || '0';
}

/**
 * Formate une durée en français
 * @param {number} ms - millisecondes
 * @returns {string}
 */
function formatDuration(ms) {
  if (ms <= 0) return '0 secondes';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}ᴊ ${hours % 24}ʜ`;
  if (hours > 0) return `${hours}ʜ ${minutes % 60}ᴍɪɴs`;
  if (minutes > 0) return `${minutes}ᴍɪɴs ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Calcule le temps restant avant minuit prochain
 * @returns {number} millisecondes
 */
function timeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}

/**
 * Génère un identifiant unique court
 * @param {number} length
 * @returns {string}
 */
function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Calcule le niveau d'un utilisateur basé sur son total de coins gagnés
 * @param {number} totalEarned
 * @returns {object} { level, title, nextLevelCoins }
 */
function calculateLevel(totalEarned) {
  const levels = [
    { level: 1, title: '🟢 ᴢᴇ́ʀᴏ', min: 0 },
    { level: 2, title: '🔵 ᴅᴇ́ʙᴜᴛᴀɴᴛ', min: 500 },
    { level: 3, title: '🟣 ᴀᴍᴀᴛᴇᴜʀ', min: 2000 },
    { level: 4, title: '🟡 ᴇxᴘᴇʀᴛ', min: 10000 },
    { level: 5, title: '🔴 ᴍᴀɪ̂ᴛʀᴇ', min: 50000 },
    { level: 6, title: '👑 ʟᴇ́ɢᴇɴᴅᴇ', min: 150000 }
  ];

  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalEarned >= levels[i].min) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || null;
      break;
    }
  }

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    nextLevelCoins: nextLevel ? nextLevel.min - totalEarned : 0,
    nextTitle: nextLevel ? nextLevel.title : null
  };
}

/**
 * Vérifie si une action est un spam (anti-spam basique)
 * @param {Map} cooldowns - Map stockant les timestamps par userId
 * @param {number} userId
 * @param {number} cooldownMs - délai en ms
 * @returns {boolean} true si spam détecté
 */
function isSpam(cooldowns, userId, cooldownMs = 2000) {
  const now = Date.now();
  const lastAction = cooldowns.get(userId) || 0;

  if (now - lastAction < cooldownMs) {
    return true;
  }

  cooldowns.set(userId, now);
  return false;
}

/**
 * Enregistre une erreur dans un fichier log
 * @param {Error} error
 * @param {string} context
 */
function logError(error, context = '') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${context}: ${error.message}\n${error.stack}\n\n`;
  
  console.error(logMessage);
  // Optionnel : écrire dans un fichier
  // const fs = require('fs');
  // fs.appendFileSync('error.log', logMessage);
}

module.exports = {
  getOrCreateUser,
  addCoins,
  removeCoins,
  formatNumber,
  formatDuration,
  timeUntilMidnight,
  generateId,
  calculateLevel,
  isSpam,
  logError
};