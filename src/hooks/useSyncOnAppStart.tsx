import { addEventListener } from '@react-native-community/netinfo';
import { useEffect, useRef } from 'react';
import { processQueue } from '../services/syncQueue';

export const useSyncOnAppStart = () => {
  let isSyncing = false;

  useEffect(() => {
    const sync = async () => {
      if (isSyncing) return;
      isSyncing = true;
      try {
        await processQueue();
      } catch (error) {
        console.log(error);
      } finally {
        isSyncing = false;
      }
    };
    const unsubscribe = addEventListener(state => {
      if (state.isConnected) sync();
    });

    return () => unsubscribe();
  }, []);
};
