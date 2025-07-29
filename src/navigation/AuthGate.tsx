import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Login } from '../screens/auth/Login';
import { Register } from '../screens/auth/Register';
import BiometricSetup from '../screens/auth/BiometricSetup';
import { Dashboard } from '../screens/dashboard/Dashboard';
import { SendMoney } from '../screens/transaction/SendMoney';
import { TransactionHistory } from '../screens/transaction/TransactionHistory';
import { AuthProvider, useAuth } from '../context/AuthContext';

const AuthStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const AuthScreens = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="Register" component={Register} />
    <AuthStack.Screen name="BiometricSetup" component={BiometricSetup} />
  </AuthStack.Navigator>
);

const HomeScreens = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Dashboard" component={Dashboard} />
    <HomeStack.Screen name="SendMoney" component={SendMoney} />
    <HomeStack.Screen name="History" component={TransactionHistory} />
  </HomeStack.Navigator>
);

const NavigatorContainer = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { authenticated, login } = useAuth();

  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const hasPassword = await Keychain.hasGenericPassword({
          service: 'service_key',
        });

        if (!hasPassword) {
          console.log('No token found');
          setCheckingAuth(false);
          return;
        }
        const creds = await Keychain.getGenericPassword({
          service: 'service_key',
          accessControl:
            Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
        });

        console.log('creds', creds);

        if (creds && creds.password) {
          login();
        }
      } catch (error) {
        console.log('No token found or biometric failed:', error);
      }
      setCheckingAuth(false);
    };

    checkStoredToken();
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {authenticated ? <HomeScreens /> : <AuthScreens />}
    </NavigationContainer>
  );
};

const AuthGate = () => {
  return (
    <AuthProvider>
      <NavigatorContainer />
    </AuthProvider>
  );
};

export default AuthGate;
