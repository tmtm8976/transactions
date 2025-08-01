import SQLite from 'react-native-sqlite-storage';

const getDB = async () =>
  await SQLite.openDatabase({ name: 'queue.db', location: 'default' });

export const initQueueTable = async () => {
  const db = await getDB();
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO transactions (recipient, amount, status, created_at) 
         VALUES (?, ?, 'pending', datetime('now'));`,
        [recipient, amount],
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
          return false;
        },
      );
    });
  });
};

export const markAsSynced = async (id: number) => {
  const db = await getDB();
  db.transaction(tx => {
    tx.executeSql('UPDATE transactions SET status = "synced" WHERE id = ?;', [
      id,
    ]);
  });
};

export const clearPendingTransactions = async () => {
  const db = await getDB();
  db.transaction(tx => {
    tx.executeSql('DELETE FROM transactions WHERE status = "pending";');
  });
};
