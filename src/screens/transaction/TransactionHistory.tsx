import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { getDB } from '../../db/database';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles as s } from '../../styles/globalStyles';

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = async () => {
    const db = await getDB();
    const results = await db.executeSql('SELECT * FROM transactions');
    const rows = results[0].rows;
    const items: Transaction[] = [];
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    setTransactions(items);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <Text style={s.header}>Transaction History</Text>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.recipient}</Text>
              <Text>{item.amount.toFixed(2)}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, marginBottom: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
});
