// App.tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { StripeProvider } from "@stripe/stripe-react-native";
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

  return (
    <StripeProvider
      // Public key from Stripe (test mode for now)
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}
      // Optional but recommended on iOS (Apple Pay, etc.)
      merchantIdentifier="merchant.com.iwa.app"
    >
      <RootNavigator />
    </StripeProvider>
  );
}
