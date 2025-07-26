import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { globalStyles as s } from '../../styles/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Keychain from 'react-native-keychain';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const Login = () => {
  const navigation = useNavigation<AuthNavProp>();
  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const setCredentials = async (username: string, password: string) =>
    await Keychain.setGenericPassword(username, password, {
      service: 'service_key',
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    });

  setCredentials('username', 'password').then(res =>
    console.log('Credentials set, ', res),
  );

  const getCredentials = async () => {
    const credentials = await Keychain.getGenericPassword({
      service: 'service_key',
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    });
    return credentials;
  };

  console.log(
    'keychain',
    getCredentials().then(res => console.log(res)),
  );

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <Text style={s.header}>welcom back</Text>
        {/* welcome msg based on time */}
        <Text style={s.lable}>Email</Text>
        <TextInput
          style={s.input}
          placeholderTextColor={'#808080'}
          placeholder="Email"
        />
        <Text style={s.lable}>Password</Text>
        <TextInput
          placeholder="Password"
          style={s.input}
          placeholderTextColor={'#808080'}
          secureTextEntry
        />
        <Pressable style={s.button}>
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
