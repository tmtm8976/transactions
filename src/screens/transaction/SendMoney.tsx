import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles as s } from '../../styles/globalStyles';
import Lucide from '@react-native-vector-icons/lucide';
import { colors } from '../../styles/colors';
import Clipboard from '@react-native-clipboard/clipboard';
import config from '../../../config';
import { useAuth } from '../../context/AuthContext';
import * as Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { addToQueue } from '../../db/queue';
// import { addToQueue } from '../../db/queue';

export const SendMoney = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [converted, setConverted] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { logout } = useAuth();

  const navigation = useNavigation();

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

  const convert = async () => {
    if (!amount || isNaN(Number(amount))) {
      // Alert.alert('Enter a valid amount');
      return;
    }

    const { rate } = await fetchMockRate();
    setConverted(Number(amount) * rate);
  };

  const handleAmountChange = (text: string) => {
    setAmount(text);
    text && convert();
  };

  const handleSend = async () => {
    const hasToken = await Keychain.getGenericPassword({
      service: 'service_key',
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    });

    if (!hasToken) {
      Alert.alert('Please login first');
      logout();
      return;
    }

    if (!recipient || !amount) {
      Alert.alert('Please enter recipient and amount');
      return;
    }

    const amountNum = parseFloat(amount);
    const netInfo = await NetInfo.fetch();

    console.log(netInfo);

    if (!netInfo.isConnected) {
      await addToQueue(recipient, amountNum);
      console.log();

      Alert.alert('Offline', 'Transaction saved. It will be sent when online.');
      navigation.goBack();
      return;
    }

    try {
      setSubmitting(true);

      const token = hasToken.password;

      const response = await fetch(`${config.API_URL}/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          recipient,
        }),
      });

      const result = await response.json();
      setSubmitting(false);

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      Platform.OS === 'android' &&
        ToastAndroid.show('Money sent successfully', ToastAndroid.SHORT);
      Platform.OS === 'ios' &&
        Alert.alert('Success', 'Money sent successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('Login error:', error.message, { error });
      Alert.alert('Error', error.message);
      setSubmitting(false);
    }
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
        <Text style={[s.lable, { color: colors.text.primary }]}>
          Amount (USD)
        </Text>
        <TextInput
          style={s.input}
          placeholderTextColor="#808080"
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={handleAmountChange}
        />

        {/* Converted */}
        {amount !== null && (
          <Text style={{ marginTop: 10, color: colors.text.primary }}>
            {loading
              ? 'Calculating...'
              : converted !== null && (
                  <>
                    <Text style={s.smallerText}>Recipient will receive: </Text>
                    <Text style={[s.smallText, s.mx20]}>
                      {converted.toFixed(2)}
                    </Text>
                    <Text style={s.smallerText}>   local currency</Text>{' '}
                  </>
                )}
          </Text>
        )}

        <Pressable
          onPress={handleSend}
          style={[
            s.button,
            { marginTop: 20, backgroundColor: colors.accent.secondary },
          ]}
        >
          {submitting ? (
            <ActivityIndicator />
          ) : (
            <Text style={[s.buttonText, { color: colors.text.primary }]}>
              Send
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
