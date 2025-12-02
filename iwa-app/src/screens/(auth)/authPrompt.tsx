import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';

export default function AuthWelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('Register1')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#B9ECFF' },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, marginBottom: 16, width: 200, alignItems: 'center' },
  secondaryButton: { backgroundColor: '#34D399' },
  buttonText: { color: '#fff', fontSize: 18 },
});