import React, { useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { globalStyles as s } from '../../styles/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Lucide from '@react-native-vector-icons/lucide';
import { colors } from '../../styles/colors';
import {
  requestCameraPermission,
  requestStoragePermission,
} from '../../utils/permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import config from '../../../config';
import * as Keychain from 'react-native-keychain';
import { useAuth } from '../../context/AuthContext';
import messaging from '@react-native-firebase/messaging';

export const Register = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const { login } = useAuth();
  const handleLogIn = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (step === 1 && !formData.username.trim()) {
      Alert.alert('Validation Error', 'Please enter a username.');
      return;
    }

    if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        Alert.alert(
          'Validation Error',
          'Please enter and confirm your password.',
        );
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Validation Error', 'Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        Alert.alert(
          'Validation Error',
          'Password must be at least 6 characters.',
        );
        return;
      }
    }

    setStep(step + 1);
  };
  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCameraLaunch = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      console.log('camera');

      const res = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (res.didCancel) {
        console.log('User cancelled camera');
        return;
      }

      if (res.errorMessage) {
        console.error('Camera error:', res.errorMessage);
        Alert.alert('Error', 'Failed to open camera');
        return;
      }

      console.log(res);
      // Handle the captured image
      if (res.assets && res.assets[0]) {
        const imageUri = res.assets[0].uri;
        console.log('Image captured:', imageUri);
        // Process your image here
        setSelectedImage(res.assets[0].uri || null);
      }
    } catch (err: unknown) {
      console.error('Camera launch error:', err);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const handleImageLibrary = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) return;

      console.log('image library');

      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (res.didCancel) {
        console.log('User cancelled image selection');
        return;
      }

      if (res.errorMessage) {
        console.error('Image library error:', res.errorMessage);
        Alert.alert('Error', 'Failed to open image library');
        return;
      }

      console.log(res);
      // Handle the selected image
      if (res.assets && res.assets[0]) {
        const imageUri = res.assets[0].uri;
        console.log('Image selected:', imageUri);
        // Process your image here
        setSelectedImage(res.assets[0].uri || null);
      }
    } catch (err: unknown) {
      console.error('Image library error:', err);
      Alert.alert('Error', 'Failed to open image library');
    }
  };

  const handleImageSelection = async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        async buttonIndex => {
          if (buttonIndex === 1) {
            await handleCameraLaunch();
          } else if (buttonIndex === 2) {
            await handleImageLibrary();
          }
        },
      );
    } else {
      Alert.alert('Upload Photo', 'Choose an option', [
        { text: 'Take Photo', onPress: handleCameraLaunch },
        { text: 'Choose from Gallery', onPress: handleImageLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleRegister = async () => {
  if (!selectedImage) {
    Alert.alert('Validation Error', 'Please upload your ID photo.');
    return;
  }

  setLoading(true);

  try {
    const formDataToSend = new FormData();

    formDataToSend.append('username', formData.username);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirmPassword', formData.confirmPassword);

    const fileName = selectedImage.split('/').pop();
    const fileType = fileName?.split('.').pop();

    formDataToSend.append('IDImage', {
      uri: selectedImage,
      name: fileName || `photo.${fileType || 'jpg'}`,
      type: `image/${fileType || 'jpeg'}`,
    });

    const device_token = await messaging().getToken();
    formDataToSend.append('device_token', device_token);

    const response = await fetch(`${config.API_URL}/register`, {
      method: 'POST',
      body: formDataToSend,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    await Keychain.setGenericPassword(formData.username, result.token, {
      service: 'service_key',
      accessControl:
        Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    });

    await Keychain.setGenericPassword(formData.username, result.token, {
      service: 'background_token',
    });

    login({
      username: formData.username,
      token: result.token,
    });

  } catch (error: any) {
    console.error('Register error:', { error });
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false); // ✅ now runs after everything finishes
  }
};

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <View style={[s.flexRow, s.gap10, s.alignCenter]}>
          {step > 1 && (
            <Pressable
              style={[s.flexRow, s.mb10, s.absolute]}
              onPress={handleBack}
            >
              <Lucide name="arrow-left" size={30} color={colors.text.primary} />
            </Pressable>
          )}
          <View
            style={[
              s.flexRow,
              s.gap10,
              s.alignCenter,
              s.justifyCenter,
              s.flex1,
            ]}
          >
            <Text style={s.header}>sign up</Text>
          </View>
        </View>
        {/* welcome msg based on time */}
        {step === 1 && (
          <View style={s.my20}>
            <Text style={s.lable}>username</Text>
            <TextInput
              style={s.input}
              placeholderTextColor={'#808080'}
              placeholder="username"
              onChangeText={text => handleInputChange('username', text)}
              value={formData.username}
            />
          </View>
        )}
        {step === 2 && (
          <View style={s.my20}>
            <Text style={s.lable}>Password</Text>
            <TextInput
              placeholder="Password"
              style={s.input}
              placeholderTextColor={'#808080'}
              secureTextEntry
              onChangeText={text => handleInputChange('password', text)}
              value={formData.password}
            />
            <Text style={s.lable}>Confirm Password</Text>
            <TextInput
              placeholder="Re-Enter password"
              style={s.input}
              placeholderTextColor={'#808080'}
              secureTextEntry
              onChangeText={text => handleInputChange('confirmPassword', text)}
              value={formData.confirmPassword}
            />
          </View>
        )}

        {step === 3 && (
          <View style={s.my20}>
            <Text style={[s.header, s.my20]}>Verify Your Identity</Text>
            <Text style={s.smallText}>
              To activate your account, please upload a clear photo of your
              government-issued ID.
              {'\n\n'}Make sure:
              {'\n'}- Your full name and photo are visible
              {'\n'}- No glare or blur
            </Text>

            <Pressable onPress={handleImageSelection} style={styles.pickImage}>
              {selectedImage ? (
                <View style={styles.imageContainer}>
                  <Pressable
                    onPress={() => setSelectedImage(null)}
                    style={styles.closeButton}
                  >
                    <Lucide name="x" size={20} color={colors.text.tertiary} />
                  </Pressable>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.image}
                    resizeMode="cover"
                    width={100}
                    height={100}
                  />
                </View>
              ) : (
                <FontAwesome6
                  name="id-card"
                  size={35}
                  color={colors.text.hint}
                />
              )}
              <Text style={styles.pickImageText}>
                {selectedImage ? 'Change Photo' : 'Upload ID Photo'}
              </Text>
            </Pressable>
          </View>
        )}

        {step < 3 && (
          <Pressable
            onPress={handleNext}
            style={[s.button, , s.flexRow, s.justifyCenter, s.gap10]}
          >
            <Text style={[s.buttonText]}>Next</Text>
            <Lucide
              name="arrow-right"
              size={30}
              style={[s.absolute, { right: 10 }]}
              color={colors.text.primary}
            />
          </Pressable>
        )}
        {step === 3 && (
          <Pressable
            disabled={loading}
            onPress={handleRegister}
            style={s.button}
          >
            {loading ? (
              <ActivityIndicator color={colors.text.primary} />
            ) : (
              <Text style={s.buttonText}>Sign Up</Text>
            )}
          </Pressable>
        )}
        <View style={s.line}></View>

        <View style={[s.flexRow, s.gap10]}>
          <Text style={s.smallText}> already have an account?</Text>
          {
            <Pressable onPress={handleLogIn}>
              <Text style={s.link}>Log in</Text>
            </Pressable>
          }
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pickImage: {
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: colors.text.tertiary,
    justifyContent: 'center',
    height: 150,
    marginTop: 20,
    gap: 10,
  },
  pickImageText: {
    marginLeft: 10,
    color: colors.text.tertiary,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
  },
});
