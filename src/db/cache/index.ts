import SQLite from 'react-native-sqlite-storage';

const getDB = async () =>
  await SQLite.openDatabase({ name: 'cache.db', location: 'default' });

export const initCachedTransactionsTable = async () => {
  const db = await getDB();
  db.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS cached_transactions (
        id TEXT PRIMARY KEY,
        recipient TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT,
        completed_at TEXT
      );
    `);
  });
};

export const cacheTransactions = async (transactions: Transaction[]) => {
  const db = await getDB();
  db.transaction(tx => {
    transactions.forEach(txn => {
      tx.executeSql(
        `INSERT OR REPLACE INTO cached_transactions 
         (id, recipient, amount, status, created_at, completed_at)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [
          txn.id,
          txn.recipient,
          txn.amount,
          txn.status,
          txn.created_at,
          txn.completed_at,
        ],
      );
    });
  });
};

export const getCachedTransactions = async (): Promise<Transaction[]> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM cached_transactions ORDER BY created_at DESC;`,
        [],
        (_, { rows }) => {
          const transactions: Transaction[] = [];
          for (let i = 0; i < rows.length; i++) {
            transactions.push(rows.item(i) as Transaction);
          }
          resolve(transactions);
        },
        err => reject(err),
      );
    });
  });
};

export const clearCachedTransactions = async (): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM cached_transactions;`,
        [],
        () => resolve(),
        err => {
          reject(err);
          return false;
        },
      );
    });
  });
};
