import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles as s } from '../../styles/globalStyles';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Lucide from '@react-native-vector-icons/lucide';
import { colors } from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

export const Profile = () => {
  const navigation = useNavigation<NavProp>();

  const handleBtnNavigate = (screen: ProfileStackScreens) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <View style={[s.flexRow, s.between, s.my20]}>
          <View>
            <Text style={s.header}>John Doe</Text>
            <Text style={s.smallText}>JohnDoe@gmail.com</Text>
          </View>

          <View style={s.flexRow}>
            <View style={[s.card, s.flexRow, s.gap5]}>
              <Lucide
                name="circle-check"
                size={21}
                color={colors.status.success}
              />
              <Text style={[s.smallText, s.success]}>Verified</Text>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => handleBtnNavigate('DocumentUpload')}
          style={[s.card, s.flexRow, s.between]}
        >
          <Text style={[s.text, { color: colors.text.secondary }]}>
            Document Upload
          </Text>
          <FontAwesome6
            name="upload"
            size={20}
            color={colors.accent.secondary}
            iconStyle="solid"
          />
        </Pressable>
        <Pressable
          onPress={() => handleBtnNavigate('Settings')}
          style={[s.card, s.flexRow, s.between]}
        >
          <Text style={[s.text, { color: colors.text.secondary }]}>
            Settings
          </Text>
          <Lucide name="settings" size={30} color={colors.accent.secondary} />
        </Pressable>

        <Pressable
          onPress={() => handleBtnNavigate('PersonalInfo')}
          style={[s.card, s.flexRow, s.between]}
        >
          <Text style={[s.text, { color: colors.text.secondary }]}>info</Text>
          <FontAwesome6
            name="user-check"
            size={20}
            color={colors.accent.secondary}
            iconStyle="solid"
          />
        </Pressable>
        <Pressable
          onPress={() => handleBtnNavigate('KycStatus')}
          style={[s.card, s.flexRow, s.between]}
        >
          <Text style={[s.text, { color: colors.text.secondary }]}>
            KYC status
          </Text>
          <Lucide name="eye" size={30} color={colors.accent.secondary} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
