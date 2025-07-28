type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  BiometricSetup: undefined;
};

type HomeStackParamList = {
  Dashboard: undefined;
  SendMoney: undefined;
  History: undefined;
};

type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  DocumentUpload: undefined;
  PersonalInfo: undefined;
  KycStatus: undefined;
};

type HomeStackScreens = 'Dashboard' | 'SendMoney' | 'History';

type Transaction = {
  id: number;
  recipient: string;
  amount: number;
  status: string;
};
