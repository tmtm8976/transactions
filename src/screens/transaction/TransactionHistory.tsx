import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, Alert } from 'react-native';
import { getDB } from '../../db/database';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles as s } from '../../styles/globalStyles';
import { useAuth } from '../../context/AuthContext';
import config from '../../../config';
import { colors } from '../../styles/colors';
import { getPendingTransactions } from '../../db/queue';

type StatusKey = keyof typeof colors.status;

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { authUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      getPendingTransactions()
        .then(pending => {
          console.log('pending', pending);
          setTransactions(prev => [...prev, ...pending]);
        })
        .catch(err => {
          console.log('err', { err });
        });
    };

    fetchPending();
  }, []);

  const loadTransactions = async () => {
    try {
      if (!authUser?.token) {
        Alert.alert('Please login first');
        logout();
        return;
      }

      setLoading(true);

      const token = authUser.token;

      const response = await fetch(`${config.API_URL}/transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
      });

      const result = await response.json();
      setLoading(false);

      console.log('result', result);

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }
      setTransactions(prev => [...prev, ...result?.data]);
    } catch (error: any) {
      console.error('Login error:', error.message, { error });
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // console.log('pending', pending());

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <Text style={s.header}>Transaction History</Text>
        <FlatList
          data={transactions}
          keyExtractor={(_, i) => i.toString()}
          refreshing={loading}
          onRefresh={loadTransactions}
          renderItem={({ item }) => {
            const status = item.status.toLowerCase() as StatusKey;
            return (
              <View style={[s.card]}>
                <View style={[s.flexRow, s.between]}>
                  <Text style={s.lable}>{item.recipient}</Text>
                  <Text style={s.text}>{item.amount.toFixed(2)}</Text>
                </View>
                <View style={[s.flexRow, s.between]}>
                  <View>
                    <Text style={s.smallerText}>
                      created at: {item.created_at}
                    </Text>
                    <Text style={s.smallerText}>
                      completed at: {item.completed_at}
                    </Text>
                  </View>
                  <Text
                    style={[
                      s.smallText,
                      {
                        color: colors.status?.[status] ?? colors.text.primary,
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            );
          }}
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
