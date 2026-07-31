const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const FILES_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'files')
  : path.join(__dirname, '../../files');

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur ${res.status} pour ${url}`);
  const fileStream = fs.createWriteStream(dest);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}

async function ensureFiles() {
  if (!fs.existsSync(FILES_JSON_PATH)) {
    console.log('ℹ️ Pas de files.json, téléchargement ignoré.');
    return;
  }

  const fileList = JSON.parse(fs.readFileSync(FILES_JSON_PATH, 'utf-8'));

  if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR, { recursive: true });
  }

  for (const [relativePath, url] of Object.entries(fileList)) {
    const dest = path.join(FILES_DIR, relativePath);
    const destDir = path.dirname(dest);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (!fs.existsSync(dest)) {
      console.log(`⬇️ Téléchargement ${relativePath}...`);
      try {
        await downloadFile(url, dest);
        console.log(`✅ ${relativePath} téléchargé.`);
      } catch (err) {
        console.error(`❌ Échec du téléchargement de ${relativePath}: ${err.message}`);
      }
    } else {
      console.log(`✔️ ${relativePath} existe déjà.`);
    }
  }
}

module.exports = ensureFiles;