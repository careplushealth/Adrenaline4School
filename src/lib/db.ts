import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data folder exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'adrenaline.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for high performance & reliability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;
