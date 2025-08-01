import React, { useEffect } from 'react';
import AuthGate from './src/navigation/AuthGate';
import BackgroundFetch from 'react-native-background-fetch';
import { processQueue } from './src/services/syncQueue';
import { setupBackgroundSync } from './src/services/background';
import { initQueueTable, resetQueueTable } from './src/db/queue';
import JailMonkey from 'jail-monkey';
import { Alert, BackHandler } from 'react-native';
import { useSyncOnAppStart } from './src/hooks/useSyncOnAppStart';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { initCachedTransactionsTable } from './src/db/cache';

export default function App() {
  if (JailMonkey.isJailBroken()) {
    BackHandler.exitApp();
  }
  setupBackgroundSync();
  initQueueTable();
  initCachedTransactionsTable();
  useSyncOnAppStart();

  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage?.notification?.title || '',
        remoteMessage?.notification?.body || '',
      );
    });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  return <AuthGate />;
}
