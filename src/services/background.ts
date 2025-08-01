import BackgroundFetch from 'react-native-background-fetch';
import { processQueue } from './syncQueue';
import NetInfo from '@react-native-community/netinfo';

export const setupBackgroundSync = async () => {
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // minutes
      enableHeadless: true,
      stopOnTerminate: false,
      startOnBoot: true,
    },
    async () => {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        await processQueue();
      }
     BackgroundFetch.finish("new-data");
    },
    error => {
      console.error('[BackgroundFetch] failed', error);
    },
  );

  BackgroundFetch.start();
};
