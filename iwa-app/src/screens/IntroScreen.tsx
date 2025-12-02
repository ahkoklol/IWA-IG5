import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";

export default function IntroScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
  const timer = setTimeout(() => {
    navigation.replace("AuthPrompt"); // redirect to authPrompt page
  }, 5000);

  return () => clearTimeout(timer);
}, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Bonne Graine</Text>
      <Image
        source={require("../../assets/gif/BonneGraine.gif")}
        style={styles.gif}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B9ECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#000",
    fontSize: 40,
    fontFamily: "Gaegu",
    marginBottom: 40,
  },
  gif: {
    width: 300,
    height: 300,
  },
});
