import { Alert } from 'react-native';
import {
  request,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  openSettings,
} from 'react-native-permissions';
import { Platform } from 'react-native';

export const requestCameraPermission = async () => {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const result = await request(permission);

    switch (result) {
      case RESULTS.UNAVAILABLE:
        Alert.alert('Error', 'Camera is not available on this device');
        return false;
      case RESULTS.DENIED:
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to take photos',
        );
        return false;
      case RESULTS.LIMITED:
      case RESULTS.GRANTED:
        return true;
      case RESULTS.BLOCKED:
        Alert.alert(
          'Permission Blocked',
          'Camera permission is blocked. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ],
        );
        return false;
      default:
        return false;
    }
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};

export const requestStoragePermission = async () => {
  try {
    if (Platform.OS === 'android') {
      // For Android 13+ (API 33+), we need READ_MEDIA_IMAGES
      // For older versions, we need READ_EXTERNAL_STORAGE
      const permissions =
        Platform.Version >= 33
          ? [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES]
          : [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];

      const results = await requestMultiple(permissions);

      // Check if any permission is granted
      const hasPermission = Object.values(results).some(
        result => result === RESULTS.GRANTED || result === RESULTS.LIMITED,
      );

      if (!hasPermission) {
        const hasBlocked = Object.values(results).some(
          result => result === RESULTS.BLOCKED,
        );

        if (hasBlocked) {
          Alert.alert(
            'Permission Blocked',
            'Storage permission is blocked. Please enable it in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ],
          );
        } else {
          Alert.alert(
            'Permission Denied',
            'Storage permission is required to access files',
          );
        }
        return false;
      }

      return true;
    } else {
      // iOS doesn't need explicit permission for accessing photo library
      // through react-native-image-picker as it handles permissions internally
      return true;
    }
  } catch (error) {
    console.error('Storage permission error:', error);
    return false;
  }
};
