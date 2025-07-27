type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  BiometricSetup: undefined;
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
