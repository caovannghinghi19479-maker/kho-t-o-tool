import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), 'data', 'app.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('synchronous = NORMAL');
sqlite.close();

process.env.DATABASE_URL = `file:${dbPath}`;

export const prisma = new PrismaClient();
