import { User } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles as s } from '../../styles/globalStyles';

export const Profile = () => {
  return (
    <SafeAreaView style={s.safeArea}>
      <View>
        <User />
        <Text>Profile</Text>
      </View>
    </SafeAreaView>
  );
};
