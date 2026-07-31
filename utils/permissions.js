const PERMISSIONS = {
  superadmin: [
    'addcoins', 'removecoins', 'ban', 'unban', 'userinfo',
    'gift', 'gifts', 'delgift', 'broadcast',
    'addtask', 'removetask', 'toggletask', 'completetask', 'listtasks',
    'addchannel', 'delchannel', 'togglechannel', 'channels',
    'addadmin', 'removeadmin', 'admins', 'admin', 'adminmenu', 'premiuminfo', 'addpremium', 'removepremium', 'togglepremium', 'statistics', 'super'
  ],
  admin: [
    'addcoins', 'userinfo',
    'gift', 'gifts',
    'addtask', 'removetask', 'toggletask', 'completetask', 'listtasks', 'channels', 'adminmenu', 'admin', 'broadcast', 'removecoins', 'premiuminfo'
  ]
};

/**
 * Vérifie si un utilisateur a la permission pour une action
 */
function hasPermission(userId, action) {
  const db = require('./database/db.js');
  const admin = db.prepare('SELECT level FROM admins WHERE user_id = ?').get(userId);
  if (!admin) return false;
  return PERMISSIONS[admin.level]?.includes(action) || false;
}

/**
 * Vérifie si l'utilisateur est admin (n'importe quel niveau)
 */
function isAdmin(userId) {
  const db = require('./database/db.js');
  return !!db.prepare('SELECT user_id FROM admins WHERE user_id = ?').get(userId);
}

/**
 * Vérifie si l'utilisateur est superadmin
 */
function isSuperAdmin(userId) {
  const db = require('./database/db.js');
  const admin = db.prepare('SELECT level FROM admins WHERE user_id = ?').get(userId);
  return admin?.level === 'superadmin';
}

/**
 * Vérifie si un utilisateur a un abonnement premium actif
 * @param {number} userId 
 * @returns {boolean}
 */
function isPremium(userId) {
  const premium = db.prepare('SELECT premium_until FROM premium_users WHERE user_id = ?').get(userId);
  if (!premium) return false;
  if (premium.premium_until === null) return true; // permanent
  return new Date(premium.premium_until) > new Date();
}

module.exports = { hasPermission, isAdmin, isSuperAdmin };