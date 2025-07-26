import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './src/screens/auth/Login';
import { Register } from './src/screens/auth/Register';
import BiometricSetup from './src/screens/auth/BiometricSetup';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TransactionHistory } from './src/screens/transaction/TransactionHistory';
import { TransactionDetails } from './src/screens/transaction/TransactionDetails';
import { SendMoney } from './src/screens/transaction/SendMoney';
import { ConfirmTransaction } from './src/screens/transaction/ConfirmTransaction';
import { Profile } from './src/screens/profile/Profile';
import { Settings } from './src/screens/profile/Settings';
import { Dashboard } from './src/screens/dashboard/Dashboard';
import { DocumentUpload } from './src/screens/kyc/DocumentUpload';
import { PersonalInfo } from './src/screens/kyc/PersonalInfo';
import { KycStatus } from './src/screens/kyc/KycStatus';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const TransactionHistoryStack = createNativeStackNavigator({
  screens: {
    TransactionHistory: TransactionHistory,
    TransactionDetails: TransactionDetails,
    SendMoney: SendMoney,
    ConfirmTransaction: ConfirmTransaction,
  },
});

const ProfileStack = createNativeStackNavigator({
  screens: {
    Profile: Profile,
    Settings: Settings,
    DocumentUpload: DocumentUpload,
    PersonalInfo: PersonalInfo,
    KycStatus: KycStatus,
  },
});

const Tabs = createBottomTabNavigator({
  screens: {
    Dashboard: Dashboard,
    SendMoney: SendMoney,
    Transactions: TransactionHistoryStack,
    Account: ProfileStack,
  },
  screenOptions: {
    headerShown: false,
    tabBarStyle: { display: 'flex' },
    tabBarActiveTintColor: '#000',
    tabBarInactiveTintColor: '#888',
  },
});

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

const RootStack = createNativeStackNavigator({
  screens: {
    Login: authStack,
    // Home: Tabs,
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
