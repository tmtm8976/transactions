import { getPendingTransactions, markAsSynced } from '../db/queue';
import config from '../../config';
import * as Keychain from 'react-native-keychain';

export const processQueue = async () => {
  const transactions = await getPendingTransactions();

  const creds = await Keychain.getGenericPassword({ service: 'service_key' });
  if (!creds) return;

  for (const tx of transactions) {
    try {
      const res = await fetch(`${config.API_URL}/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${creds.password}`,
        },
        body: JSON.stringify({
          recipient: tx.recipient,
          amount: tx.amount,
        }),
      });

      if (res.ok) {
        markAsSynced(tx.id);
      }
    } catch (err) {
      console.error('Failed to sync transaction:', tx.id, err);
    }
  }
};
