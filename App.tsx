import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './src/screens/auth/Login';
import { Register } from './src/screens/auth/Register';
import BiometricSetup from './src/screens/auth/BiometricSetup';
import { TransactionHistory } from './src/screens/transaction/TransactionHistory';
import { SendMoney } from './src/screens/transaction/SendMoney';
import { Dashboard } from './src/screens/dashboard/Dashboard';

const authStack = createNativeStackNavigator<AuthStackParamList>({
  screens: {
    Login: Login,
    Register: Register,
    BiometricSetup: BiometricSetup,
  },
  screenOptions: {
    headerShown: false,
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    presentation: 'card',
    animationMatchesGesture: true,
    animation: 'slide_from_right',
    animationDuration: 100,
    animationTypeForReplace: 'push',
  },
});

const HomeStack = createNativeStackNavigator<HomeStackParamList>({
  screens: {
    Dashboard: Dashboard,
    SendMoney: SendMoney,
    History: TransactionHistory,
  },
  screenOptions: {
    headerShown: false,
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    presentation: 'card',
    animationMatchesGesture: true,
    animation: 'slide_from_right',
    animationDuration: 100,
    animationTypeForReplace: 'push',
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Login: authStack,
    Home: HomeStack,
  },

  screenOptions: {
    headerShown: false,
    animation: 'slide_from_right',
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    cardStyle: { backgroundColor: 'transparent' },
    cardOverlayEnabled: true,
    presentation: 'card',
  },
  initialRouteName: 'Login',
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
