// src/screens/home/HomeRootScreen.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import SearchScreen from "../search/SearchScreen";
import {
  demoProducts,
  currentUser as mockCurrentUser,
} from "../../mocks/products";
import type { Category } from "../../shared/types";
import { BottomNavbar, BottomTabId } from "../../components/BottomNavbar";
import { RootStackParamList } from "../../navigation/RootNavigator";
import NotificationsScreen from "../notifications/NotificationsScreen";
import { ProfileMenuScreen } from "../profil/ProfileMenuScreen";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeRootScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [products, setProducts] = useState(demoProducts);
  const [activeTab, setActiveTab] = useState<BottomTabId>("home");

  // SÉLECTION D’UNE CATÉGORIE
  const handleCategorySelect = (category: Category) => {
    console.log("Catégorie sélectionnée :", category);

    // Exemple simple (plus tard tu pourras filtrer ou naviguer)
    alert("Tu as sélectionné : " + category);
  };

  // NAVIGATION VERS PRODUIT
  const handleProductClick = (p: any) => {
    navigation.navigate("ProductDetail", { productId: String(p.id) });
  };

  // FAVORIS
  const handleToggleFavorite = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };


  const handleProfileMenuSelect = (menuId: string) => {
    if (menuId === "myProfile") {
      navigation.navigate("MyProfileScreen", {
        user: mockCurrentUser,
      });
      return;
    }

    if (menuId === "favorites") {
      navigation.navigate("Favorites");
      return;
    }

    if (menuId === "myProducts") {
      navigation.navigate("MyProducts");
      return;
    }

    if (menuId === "transactions") {
      navigation.navigate("Transactions", {}); // param vide mais typé
      return;
    }

    console.log("Menu profil sélectionné :", menuId);
  };


  // RENDU DES ONGLET (home / search / notif / profil)
  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchScreen onCategorySelect={handleCategorySelect} />;

      case "notifications":
        return <NotificationsScreen />;

      case "profile":
        return (
          <ProfileMenuScreen
            currentUser={mockCurrentUser}
            onMenuSelect={handleProfileMenuSelect}
            onLogout={() => {
              console.log("Logout");
              // Plus tard : navigation vers login, reset state, etc.
            }}
            onDeleteAccount={() => {
              console.log("Delete account");
              // Plus tard : modal + appel API
            }}
          />
        );

      case "home":
      default:
        return (
          <HomeScreen
            products={products}
            onProductClick={handleProductClick}
            onToggleFavorite={handleToggleFavorite}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <BottomNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddProduct={(product) => {
          console.log("Nouveau produit ajouté :", product);
          // Plus tard : setProducts([...products, { ...product, id: ... }]);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 70,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
