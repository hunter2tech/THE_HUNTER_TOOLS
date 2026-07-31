const Database = require('better-sqlite3');
const dbPath = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'data.db')
  : path.join(__dirname, './data.db');

const db = new Database(dbPath);

// Active WAL mode pour performance
db.pragma('journal_mode = WAL');

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS required_channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_username TEXT NOT NULL,
    channel_title TEXT,
    channel_type TEXT DEFAULT 'channel',  -- 'channel' ou 'group'
    is_active INTEGER DEFAULT 1,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed des chaînes obligatoires
const channelsCount = db.prepare('SELECT COUNT(*) as count FROM required_channels').get().count;
if (channelsCount === 0) {
  const insertChannel = db.prepare('INSERT INTO required_channels (channel_username, channel_title, channel_type) VALUES (?, ?, ?)');
  insertChannel.run('@kraveninfo', '📢 𝙲𝙰𝙽𝙰𝙻 𝟷', 'channel');
  insertChannel.run('@sinlust66', '📢 𝙲𝙰𝙽𝙰𝙻 𝟸', 'channel');
  insertChannel.run('@trafalgar2010dev', '📢 𝙲𝙰𝙽𝙰𝙻 𝟹', 'channel');
  insertChannel.run('https://whatsapp.com/channel/0029VbE1W3r8PgsMnterzu3U', '📢 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿', 'channel');
  insertChannel.run('@kiddiesdev', '👥 𝙶𝚁𝙾𝚄𝙿𝙴 𝟷', 'group');
  insertChannel.run('@developper666', '👥 𝙶𝚁𝙾𝚄𝙿𝙴 𝟸', 'group');
  console.log('✅ Chaînes initialisées');
}

db.exec(`
  CREATE TABLE IF NOT EXISTS banned_users (
    user_id INTEGER PRIMARY KEY,
    reason TEXT,
    banned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS premium_users (
    user_id INTEGER PRIMARY KEY,
    premium_until DATETIME,          -- NULL = permanent
    activated_by INTEGER,
    activated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(activated_by) REFERENCES users(user_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS gift_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    reward INTEGER NOT NULL,
    max_uses INTEGER DEFAULT 1,
    uses INTEGER DEFAULT 0,
    expires_at DATETIME,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS gift_claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    code_id INTEGER,
    claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, code_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(code_id) REFERENCES gift_codes(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,        -- 'join_channel', 'join_group', 'invite', 'message', 'custom'
    target TEXT,               -- @username du groupe/chaine, ou nombre d'invitations
    reward INTEGER NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS task_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    task_id INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, task_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(task_id) REFERENCES tasks(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    coins INTEGER DEFAULT 100,
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    ref_code TEXT UNIQUE,
    referred_by INTEGER,
    last_daily DATETIME,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,       -- 'earn', 'spend', 'referral', 'daily', 'admin'
    amount INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    user_id INTEGER PRIMARY KEY,
    level TEXT DEFAULT 'admin',  -- 'superadmin' ou 'admin'
    added_by INTEGER,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(added_by) REFERENCES users(user_id)
  );
`);

// Ajouter le super admin initial (vous)
const SuperAdminId = parseInt(process.env.ADMIN_ID);
if (SuperAdminId) {
  const exists = db.prepare('SELECT * FROM admins WHERE user_id = ?').get(SuperAdminId);
  if (!exists) {
    db.prepare('INSERT INTO admins (user_id, level) VALUES (?, ?)').run(SuperAdminId, 'superadmin');
    console.log('✅ Super admin initialisé');
  }
}

db.exec(`
  DROP TABLE IF EXISTS shop_items;
  CREATE TABLE shop_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    file_path TEXT,
    file_type TEXT,
    file_name TEXT,
    file_size INTEGER,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT -1,
    is_active INTEGER DEFAULT 1,
    premium_only INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS admin_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_stars_earned INTEGER DEFAULT 0,
    total_transactions_value INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS star_purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    telegram_payment_id TEXT UNIQUE,
    pack_id INTEGER,
    coins_received INTEGER,
    stars_paid INTEGER,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
  );
`);

module.exports = db;