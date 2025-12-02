import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/authContext';

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    console.log("LoginScreen mounted, calling signIn");
    signIn();
    console.log("signIn call finished");
  }, [signIn]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logging in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 24 },
});
