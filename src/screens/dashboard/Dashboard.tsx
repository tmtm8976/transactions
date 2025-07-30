import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles as s } from '../../styles/globalStyles';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Lucide from '@react-native-vector-icons/lucide';
import { colors } from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Keychain from 'react-native-keychain';
import { useAuth } from '../../context/AuthContext';

type NavProp = NativeStackNavigationProp<
  HomeStackNavigationScreens,
  'Dashboard'
>;

export const Dashboard = () => {
  const navigation = useNavigation<NavProp>();
  const { logout } = useAuth();

  const handleBtnNavigate = (screen: HomeStackScreens) => {
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    const success = await Keychain.resetGenericPassword({
      service: 'service_key',
    });
    console.log('Password reset successful:', success);
    logout();
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <Pressable
          onPress={handleLogout}
          style={[
            s.absolute,
            {
              top: 10,
              right: 10,
              padding: 10,
            },
          ]}
        >
          {/* <Text style={[s.text, { color: 'white' }]}>Logout</Text> */}
          <FontAwesome6
            name="arrow-right-from-bracket"
            size={20}
            color={colors.status.error}
            iconStyle="solid"
          />
        </Pressable>
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

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={[s.flexRow, s.gap10, s.flex1]}>
              <Text
                style={[
                  s.header,
                  { color: colors.text.secondary, marginBottom: 0 },
                ]}
              >
                8
              </Text>
              <FontAwesome6
                name="arrows-rotate"
                size={20}
                color={colors.status.success}
                iconStyle="solid"
              />
            </View>
            <Text style={[s.smallerText, { color: colors.text.secondary }]}>
              Total Transactions
            </Text>
          </View>
          <View style={styles.card}>
            <View style={[s.flexRow, s.gap10, s.flex1]}>
              <Text
                style={[
                  s.header,
                  { color: colors.text.secondary, marginBottom: 0 },
                ]}
              >
                0
              </Text>
              <FontAwesome6
                name="clock"
                size={20}
                color={colors.status.pending}
                iconStyle="solid"
              />
            </View>
            <Text style={[s.smallerText, { color: colors.text.secondary }]}>
              Pending Transactions
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => handleBtnNavigate('SendMoney')}
          style={[s.card, s.flexRow, s.between]}
        >
          <Text style={[s.text, { color: colors.text.secondary }]}>
            Send money
          </Text>
          <FontAwesome6
            name="paper-plane"
            size={20}
            color={colors.accent.secondary}
            iconStyle="solid"
          />
        </Pressable>
        <Pressable
          onPress={() => handleBtnNavigate('History')}
          style={[s.card, s.flexRow, s.between]}
        >
          <Text style={[s.text, { color: colors.text.secondary }]}>
            Transactions History
          </Text>
          <FontAwesome6
            name="money-bill-transfer"
            size={20}
            color={colors.accent.secondary}
            iconStyle="solid"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 100,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    padding: 10,
  },
  cardContainer: {
    gap: 10,
    flexDirection: 'row',
    marginBottom: 10,
  },
});
