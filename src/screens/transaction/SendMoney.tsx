import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles as s } from '../../styles/globalStyles';
import Lucide from '@react-native-vector-icons/lucide';
import { colors } from '../../styles/colors';
import Clipboard from '@react-native-clipboard/clipboard';

export const SendMoney = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [converted, setConverted] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePaste = async () => {
    const text = await Clipboard.getString();
    setRecipient(text);
  };

  // Mock "fetch"
  const fetchMockRate = async () => {
    setLoading(true);
    return new Promise<{ rate: number }>(resolve => {
      setTimeout(() => {
        setLoading(false);
        resolve({ rate: 21.3 }); // fake rate: 1 USD = 21.3 local currency
      }, 500);
    });
  };

  const handleSend = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Enter a valid amount');
      return;
    }

    const { rate } = await fetchMockRate();
    setConverted(Number(amount) * rate);
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <Text style={s.header}>Send Money</Text>

        {/* Recipient */}
        <Text style={[s.lable, { color: colors.text.primary }]}>Recipient</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[s.input, { flex: 1, paddingEnd: 38 }]}
            placeholder="Recipient"
            value={recipient}
            onChangeText={setRecipient}
          />
          <Pressable
            onPress={handlePaste}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 25,
            }}
          >
            <Lucide
              name="clipboard-list"
              size={24}
              color={colors.text.tertiary}
            />
          </Pressable>
        </View>

        {/* Amount */}
        <Text style={[s.lable, { color: colors.text.primary }]}>Amount (USD)</Text>
        <TextInput
          style={s.input}
          placeholderTextColor="#808080"
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Converted */}
        {converted !== null && (
          <Text style={{ marginTop: 10, color: colors.text.primary }}>
            Recipient will receive: <Text style={{ fontWeight: 'bold' }}>{converted.toFixed(2)}</Text> local currency
          </Text>
        )}

        <Pressable
          onPress={handleSend}
          style={[
            s.button,
            { marginTop: 20, backgroundColor: colors.accent.secondary },
          ]}
        >
          <Text style={[s.buttonText, { color: colors.text.primary }]}>
            {loading ? 'Calculating...' : 'Send'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
