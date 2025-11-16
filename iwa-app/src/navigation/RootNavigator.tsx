import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import IntroScreen from "../screens/IntroScreen";
import LoginScreen from "../screens/(auth)/LoginScreen";
import RegisterScreen1, { SignupData1 } from "../screens/(auth)/RegisterScreen1";
import RegisterScreen2, { SignupData2 } from "../screens/(auth)/RegisterScreen2";
import RegisterScreen3 from "../screens/(auth)/RegisterScreen3";
import HomeRootScreen from "../screens/home/HomeRootScreen";
import ProductDetail from "../screens/product/ProductDetail";
import { MyProfileScreen } from "../screens/profil/MyProfileScreen";
import { FavoritesScreen } from "../screens/profil/FavoritesScreen";
import { MyProductsScreen } from "../screens/profil/MyProductsScreen";
import { TransactionsScreen } from "../screens/profil/TransactionsScreen";
import { SellerReviewScreen } from "../screens/profil/SellerReviewScreen";

import { SettingsScreen } from "../screens/settings/SettingsScreen";

import type { User } from "../shared/types";

export type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  Register1: undefined;
  Register2: { step1: SignupData1 };
  Register3: { step1: SignupData1; step2: SignupData2 };
  Home: undefined;

  ProductDetail: { productId: string };
  MyProfileScreen: { user: User };

  Favorites: undefined;
  MyProducts: undefined;

  Transactions: { reviewedTransactionId?: number } | undefined;

  SellerReview: { transactionId: number };

  Settings: { onDeleteAccount: () => void };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register1" component={RegisterScreen1} />
        <Stack.Screen name="Register2" component={RegisterScreen2} />
        <Stack.Screen name="Register3" component={RegisterScreen3} />
        <Stack.Screen name="Home" component={HomeRootScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />

        {/* Profil */}
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="MyProducts" component={MyProductsScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="SellerReview" component={SellerReviewScreen} />

        {/* Réglages */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
