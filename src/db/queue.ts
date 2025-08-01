import SQLite from 'react-native-sqlite-storage';
import { v4 as uuidv4 } from 'uuid';

const getDB = async () =>
  await SQLite.openDatabase({ name: 'queue.db', location: 'default' });

export const initQueueTable = async () => {
  const db = await getDB();
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        recipient TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT DEFAULT (datetime('now')),
        completed_at TEXT
      );`,
    );
  });
};

export const resetQueueTable = async () => {
  const db = await getDB();
  db.transaction(tx => {
    tx.executeSql(`DROP TABLE IF EXISTS transactions;`);
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        recipient TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        completed_at TEXT
      );
    `);
  });
};

export const addToQueue = async (recipient: string, amount: number) => {
  const db = await getDB();
  const id = uuidv4();

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO transactions (id, recipient, amount, status, created_at) 
         VALUES (?, ?, ?, 'pending', datetime('now'));`,
        [id, recipient, amount],
        () => resolve(),
        err => {
          reject(err);
          return false;
        },
      );
    });
  });
};

export const getPendingTransactions = async (): Promise<Transaction[]> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT id, recipient, amount, status, created_at, completed_at
         FROM transactions
         WHERE status = 'pending';`,
        [],
        (_, { rows }) => {
          const results: Transaction[] = [];
          for (let i = 0; i < rows.length; i++) {
            results.push(rows.item(i) as Transaction);
          }
          resolve(results);
        },
        err => {
          reject(err);
        },
      );
    });
  });
};

export const markAsSynced = async (id: string) => {
  const db = await getDB();
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE transactions 
       SET status = 'synced', completed_at = datetime('now') 
       WHERE id = ?;`,
      [id],
    );
  });
};

export const clearPendingTransactions = async () => {
  const db = await getDB();
  db.transaction(tx => {
    tx.executeSql('DELETE FROM transactions WHERE status = "pending";');
  });
};
