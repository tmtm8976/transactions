import React from 'react';
import AuthGate from './src/navigation/AuthGate';
import BackgroundFetch from 'react-native-background-fetch';
import { processQueue } from './src/services/syncQueue';
import { setupBackgroundSync } from './src/services/background';
import { initQueueTable, resetQueueTable } from './src/db/queue';

export default function App() {
 
  setupBackgroundSync();
  initQueueTable();

  return <AuthGate />;
}
