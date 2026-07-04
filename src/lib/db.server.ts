import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "database.json");

interface DatabaseSchema {
  profiles: unknown[];
  wallets: unknown[];
  wallet_transactions: unknown[];
  deployments: unknown[];
  deployment_logs: unknown[];
  deployment_env: unknown[];
  referral_earnings: unknown[];
  chats: unknown[];
}

const INITIAL_DB: DatabaseSchema = {
  profiles: [],
  wallets: [],
  wallet_transactions: [],
  deployments: [],
  deployment_logs: [],
  deployment_env: [],
  referral_earnings: [],
  chats: [],
};

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(INITIAL_DB, null, 2));
  }
}

export async function readDb(): Promise<DatabaseSchema> {
  await ensureDb();
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
}

export async function writeDb(data: DatabaseSchema) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getCollection<T extends keyof DatabaseSchema>(
  collection: T,
): Promise<DatabaseSchema[T]> {
  const db = await readDb();
  return db[collection];
}

export async function updateCollection<T extends keyof DatabaseSchema>(
  collection: T,
  data: DatabaseSchema[T],
) {
  const db = await readDb();
  db[collection] = data;
  await writeDb(db);
}
