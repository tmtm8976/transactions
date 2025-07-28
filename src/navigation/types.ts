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

type ProfileStackScreens =
  | 'Profile'
  | 'Settings'
  | 'DocumentUpload'
  | 'PersonalInfo'
  | 'KycStatus';


type HomeStackScreens =
| 'Dashboard'
| 'SendMoney'
| 'History'

