/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import { processQueue } from './src/services/syncQueue';

const HeadlessTask = async (event) => {
  console.log('[BackgroundFetch HeadlessTask] start');

  const { taskId } = event;

  await processQueue();

  BackgroundFetch.finish(taskId);
};

BackgroundFetch.registerHeadlessTask(HeadlessTask);

AppRegistry.registerComponent(appName, () => App);
