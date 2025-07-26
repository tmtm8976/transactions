import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { globalStyles as s } from '../../styles/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const Register = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const handleLogIn = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.safeArea}>
         <View style={s.container}>
           <Text style={s.header}>sign up</Text>
           {/* welcome msg based on time */}
           <Text style={s.lable}>Email</Text>
           <TextInput
             style={s.input}
             placeholderTextColor={'#808080'}
             placeholder="Email"
           />
           <Text style={s.lable}>Password</Text>
           <TextInput
             placeholder="Password"
             style={s.input}
             placeholderTextColor={'#808080'}
             secureTextEntry
           />
           <Text style={s.lable}>Confirm Password</Text>
           <TextInput
             placeholder="Re-Enter password"
             style={s.input}
             placeholderTextColor={'#808080'}
             secureTextEntry
           />
           <Pressable style={s.button}>
             <Text style={s.buttonText}>Login</Text>
           </Pressable>
           <View style={s.line}></View>
           <View style={[s.flexRow, s.gap10]}>
             <Text style={s.smallText}> already have an account?</Text>
             <Pressable onPress={handleLogIn}>
               <Text style={s.link}>Log in</Text>
             </Pressable>
           </View>
         </View>
       </SafeAreaView>
  );
};
