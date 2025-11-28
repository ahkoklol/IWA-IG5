import React, { useContext } from "react";
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
import { SearchScreen } from "../screens/search/SearchScreen";
import { CategoryResults } from "../screens/search/CategoryResults";
import { FilterScreen } from "../screens/search/FilterScreen";
import { FilterDetailScreen } from "../screens/search/FilterDetailScreen";
import AuthPrompt from "../screens/(auth)/authPrompt";

import { AuthContext } from "../context/authContext";

import type { User, Category, Filters } from "../shared/types";

export type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  Register1: undefined;
  Register2: { step1: SignupData1 };
  Register3: { step1: SignupData1; step2: SignupData2 };
  Home: undefined;

  AuthPrompt: undefined;

  ProductDetail: { productId: string };

  SearchScreen: undefined;
  CategoryResults: {
    category?: Category | null;
    searchQuery?: string;
  };
  FilterScreen: {
    filters: Filters;
  };
  FilterDetailScreen: {
    filterType: string;
    selectedValues: string | string[] | null;
  };

  MyProfileScreen: {
    user: User;
    initialTab?: "profile" | "reviews";
  };

  Favorites: undefined;
  MyProducts: undefined;

  Transactions: { reviewedTransactionId?: number } | undefined;

  SellerReview: { transactionId: number };

  Settings: { onDeleteAccount: () => void };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { state } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {state.isSignedIn ? (
        // App stack when signed in
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeRootScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} />
          <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="CategoryResults" component={CategoryResults} />
          <Stack.Screen name="FilterScreen" component={FilterScreen} />
          <Stack.Screen name="FilterDetailScreen" component={FilterDetailScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="MyProducts" component={MyProductsScreen} />
          <Stack.Screen name="Transactions" component={TransactionsScreen} />
          <Stack.Screen name="SellerReview" component={SellerReviewScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      ) : (
        // Auth stack when not signed in
        <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="AuthPrompt" component={AuthPrompt} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register1" component={RegisterScreen1} />
          <Stack.Screen name="Register2" component={RegisterScreen2} />
          <Stack.Screen name="Register3" component={RegisterScreen3} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}