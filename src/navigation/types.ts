type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
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
type AuthStackNavigationScreens = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type HomeStackNavigationScreens = {
  Auth: undefined;
  Dashboard: undefined;
  SendMoney: undefined;
  History: undefined;
};


type Transaction = {
  id: number;
  recipient: string;
  amount: number;
  status: string;
};
