// src/screens/home/HomeRootScreen.tsx
import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import SearchScreen from "../search/SearchScreen"; // ← import ici
import { demoProducts } from "../../mocks/products";
import { BottomNavbar, BottomTabId } from "../../components/BottomNavbar";
import { RootStackParamList } from "../../navigation/RootNavigator";
import type { Category } from "../../shared/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeRootScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [products, setProducts] = useState(demoProducts);
  const [activeTab, setActiveTab] = useState<BottomTabId>("home");

  // SÉLECTION D’UNE CATÉGORIE
  const handleCategorySelect = (category: Category) => {
    console.log("Catégorie sélectionnée :", category);

    // Ici tu pourras plus tard :
    // - naviguer vers CategoryResults
    // - ou filtrer les produits
    // - ou changer d'écran dans HomeRootScreen
    
    // Exemple simple :
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

  // RENDU DES ONGLET (home / search / notif / profil)
  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchScreen onCategorySelect={handleCategorySelect} />;

      case "notifications":
        return (
          <View style={styles.placeholder}>
            <Text>Notifications (TODO)</Text>
          </View>
        );

      case "profile":
        return (
          <View style={styles.placeholder}>
            <Text>Profil (TODO)</Text>
          </View>
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

  // CHANGE D'ONGLET
  const handleTabChange = (tab: BottomTabId) => {
    if (tab === "sell") {
      console.log("TODO: ouvrir modal d’ajout de produit");
      return;
    }
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <BottomNavbar activeTab={activeTab} onTabChange={handleTabChange} />
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
