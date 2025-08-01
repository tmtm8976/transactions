import React from 'react';
import AuthGate from './src/navigation/AuthGate';
import BackgroundFetch from 'react-native-background-fetch';
import { processQueue } from './src/services/syncQueue';
import { setupBackgroundSync } from './src/services/background';
import { initQueueTable, resetQueueTable } from './src/db/queue';
import JailMonkey from 'jail-monkey';
import { BackHandler } from 'react-native';
import { useSyncOnAppStart } from './src/hooks/useSyncOnAppStart';

export default function App() {
  if (JailMonkey.isJailBroken()) {
    BackHandler.exitApp();
  }
  setupBackgroundSync();
  initQueueTable();
  useSyncOnAppStart();


  return <AuthGate />;
}
