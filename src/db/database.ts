import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDB = async () => {
  return SQLite.openDatabase({ name: 'transactions.db', location: 'default' });
};

export const initDB = async () => {
  const db = await getDB();
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipient TEXT,
      amount REAL,
      status TEXT
    );`
  );
};
