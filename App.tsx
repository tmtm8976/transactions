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
import Icon from '@react-native-vector-icons/fontawesome6';

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
  screenOptions: {
    headerShown: false,
  },
});

const Tabs = createBottomTabNavigator({
  screens: {
    Dashboard: Dashboard,
    SendMoney: SendMoney,
    Transactions: TransactionHistoryStack,
    Account: ProfileStack,
  },
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = focused
          ? 'ios-information-circle'
          : 'ios-information-circle-outline';
      } else if (route.name === 'Settings') {
        iconName = focused ? 'ios-list' : 'ios-list-outline';
      }

      // You can return any component that you like here!
      return <Icon name="user" />;
    },
    tabBarActiveTintColor: '#00D4AA',
    tabBarInactiveTintColor: 'gray',
    headerShown: false,
    tabBarStyle: {
      backgroundColor: '#2A2A2A',
      height: 80,
      borderWidth: 0,
      borderTopWidth: 0,
      alignItems: "center",
      justifyContent:  "center"
    },
  }),
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
    Home: Tabs,
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
