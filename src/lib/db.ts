import { Pool, neonConfig } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Check if DATABASE_URL is in environment
let databaseUrl = process.env.DATABASE_URL;

// If not present in process.env, attempt to load from .env.local
if (!databaseUrl) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/DATABASE_URL="([^"]+)"/) || content.match(/DATABASE_URL=([^\r\n]+)/);
      if (match) databaseUrl = match[1].trim();
    }
  } catch (e) {
    // Ignore error
  }
}

// Convert SQLite query syntax to PostgreSQL query syntax
export function normalizeSqlForPostgres(sql: string): string {
  let pgSql = sql;

  // Replace SQLite julianday difference with Postgres date subtraction
  pgSql = pgSql.replace(
    /CAST\(\s*\(\s*julianday\(([^)]+)\)\s*-\s*julianday\(['"]now['"]\)\s*\)\s*AS\s+INTEGER\s*\)/gi,
    '(CAST($1 AS DATE) - CURRENT_DATE)'
  );
  pgSql = pgSql.replace(
    /\(?\s*julianday\(([^)]+)\)\s*-\s*julianday\(['"]now['"]\)\s*\)?/gi,
    '(CAST($1 AS DATE) - CURRENT_DATE)'
  );

  // Replace INSERT OR REPLACE for cms_content
  if (/INSERT\s+OR\s+REPLACE\s+INTO\s+cms_content/i.test(pgSql)) {
    pgSql = `
      INSERT INTO cms_content (key, title, section, content_json, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE SET
        title = EXCLUDED.title,
        section = EXCLUDED.section,
        content_json = EXCLUDED.content_json,
        updated_at = CURRENT_TIMESTAMP
    `;
    return pgSql;
  }

  // Convert '?' parameter placeholders to '$1', '$2', '$3'...
  let paramIndex = 1;
  pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);

  return pgSql;
}

interface DbStatement {
  all(...params: any[]): Promise<any[]>;
  get(...params: any[]): Promise<any | undefined>;
  run(...params: any[]): Promise<{ changes: number; lastInsertRowid?: any }>;
}

interface DbInterface {
  prepare(sql: string): DbStatement;
  transaction<T>(fn: () => Promise<T> | T): Promise<T>;
  query(sql: string, params?: any[]): Promise<any[]>;
  isPostgres: boolean;
}

let dbInstance: DbInterface;

if (databaseUrl) {
  // --------------------------------------------------------
  // NEON POSTGRESQL (Lakebase Postgres Serverless Driver)
  // --------------------------------------------------------
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  dbInstance = {
    isPostgres: true,
    prepare(sql: string): DbStatement {
      const normalizedSql = normalizeSqlForPostgres(sql);

      return {
        async all(...params: any[]) {
          // Flatten if params array was passed as a single array
          const flattened = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const res = await pool.query(normalizedSql, flattened);
          return res.rows;
        },
        async get(...params: any[]) {
          const flattened = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const res = await pool.query(normalizedSql, flattened);
          return res.rows[0];
        },
        async run(...params: any[]) {
          const flattened = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const res = await pool.query(normalizedSql, flattened);
          return { changes: res.rowCount || 0 };
        },
      };
    },
    async transaction<T>(fn: () => Promise<T> | T): Promise<T> {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await fn();
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    },
    async query(sql: string, params: any[] = []) {
      const normalized = normalizeSqlForPostgres(sql);
      const res = await pool.query(normalized, params);
      return res.rows;
    },
  };
} else {
  // --------------------------------------------------------
  // SQLITE FALLBACK (Offline Development)
  // --------------------------------------------------------
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'adrenaline.db');
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  dbInstance = {
    isPostgres: false,
    prepare(sql: string): DbStatement {
      const stmt = sqlite.prepare(sql);
      return {
        async all(...params: any[]) {
          const flattened = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          return stmt.all(...flattened);
        },
        async get(...params: any[]) {
          const flattened = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          return stmt.get(...flattened);
        },
        async run(...params: any[]) {
          const flattened = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const res = stmt.run(...flattened);
          return { changes: res.changes, lastInsertRowid: res.lastInsertRowid };
        },
      };
    },
    async transaction<T>(fn: () => Promise<T> | T): Promise<T> {
      const tx = sqlite.transaction(fn);
      return tx();
    },
    async query(sql: string, params: any[] = []) {
      return sqlite.prepare(sql).all(...params);
    },
  };
}

export default dbInstance;
