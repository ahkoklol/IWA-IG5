import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    Gaegu: require("./assets/fonts/Gaegu-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#B9ECFF",
        }}
      >
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return <RootNavigator />;
}
