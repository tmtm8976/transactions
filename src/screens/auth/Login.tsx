import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { globalStyles as s } from '../../styles/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Keychain from 'react-native-keychain';
import { colors } from '../../styles/colors';
import config from '../../../config';
import { useAuth } from '../../context/AuthContext';
import messaging from '@react-native-firebase/messaging';

type AuthNavProp = NativeStackNavigationProp<
  AuthStackNavigationScreens,
  'Login'
>;

export const Login = () => {
  const [fromData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [validator, setValidator] = useState<{
    username?: string;
    password?: string;
  }>({});
  const { login } = useAuth();
  const navigation = useNavigation<AuthNavProp>();
  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  const valid = () => {
    if (fromData.username && fromData.password) {
      setValidator({});
      return true;
    }
    setValidator({
      ...(!fromData.username && { username: "Username can't be empty" }),
      ...(!fromData.password && { password: "Password can't be empty" }),
    });
    return false;
  };

  const handleLogin = async () => {
    if (!valid()) return;
    try {
      messaging()
        .getToken()
        .then(async device_token => {
          const response = await fetch(`${config.API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...fromData, device_token }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || 'Login failed');
          }

          console.log(result, 'result');

          // Save token with biometrics
          await Keychain.setGenericPassword(fromData.username, result.token, {
            service: 'service_key',
            accessControl:
              Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
            authenticationPrompt: {
              title: 'Biometric Authentication',
            },
          });
          await Keychain.setGenericPassword(fromData.username, result.token, {
            service: 'background_token',
          });

          login({
            id: result?.user.id ?? '',
            name: result?.user.name ?? '',
            username: result?.user.username ?? '',
            token: result.token ?? '',
          });
        });
    } catch (error: any) {
      console.error('Login error:', error.message, { error });
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <Text style={s.header}>welcom back</Text>
        {/* welcome msg based on time */}
        <Text style={s.lable}>username</Text>
        <View style={{ position: 'relative', marginBottom: 10 }}>
          <TextInput
            style={[
              s.input,
              {
                borderColor: validator?.username
                  ? colors.status.error
                  : '#808080',
              },
            ]}
            placeholderTextColor={'#808080'}
            placeholder="Enter your username"
            onChangeText={value => handleInputChange('username', value)}
            value={fromData.username}
          />
          {validator?.username && (
            <Text style={[s.smallText, s.error]}>{validator.username}</Text>
          )}
        </View>
        <Text style={s.lable}>Password</Text>
        <View style={{ position: 'relative', marginBottom: 20 }}>
          <TextInput
            placeholder="Password"
            style={[
              s.input,
              {
                borderColor: validator?.password
                  ? colors.status.error
                  : '#808080',
              },
            ]}
            placeholderTextColor={'#808080'}
            secureTextEntry
            onChange={value =>
              handleInputChange('password', value.nativeEvent.text)
            }
            value={fromData.password}
          />
          {validator?.password && (
            <Text style={[s.smallText, s.error]}>{validator.password}</Text>
          )}
        </View>
        <Pressable onPress={handleLogin} style={s.button}>
          <Text style={s.buttonText}>Login</Text>
        </Pressable>
        <View style={s.line}></View>
        <View style={[s.flexRow, s.gap10]}>
          <Text style={s.smallText}> don't have an account?</Text>
          <Pressable onPress={handleSignUp}>
            <Text style={s.link}>sign up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
