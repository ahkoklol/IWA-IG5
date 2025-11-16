// src/screens/profil/FavoritesScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import type { Product } from "../../shared/types";
import ProductCard from "../../components/product/ProductCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { demoProducts } from "../../mocks/products";

type Props = NativeStackScreenProps<RootStackParamList, "Favorites">;

export function FavoritesScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>(
    demoProducts.filter((p) => p.isFavorite)
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleProductClick = (product: Product) => {
    navigation.navigate("ProductDetail", { productId: String(product.id) });
  };

  const handleToggleFavorite = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Phone notch simulation */}
      <View style={styles.notch} />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favoris</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      {/* Products grid */}
      <View style={styles.content}>
        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucun article en favori</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {products.map((product) => (
              <View key={product.id} style={styles.gridItem}>
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                  onToggleFavorite={() => handleToggleFavorite(product.id)}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  notch: {
    width: 128,
    height: 32,
    backgroundColor: "#000000",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignSelf: "center",
  },
  headerWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    color: "#111827",
  },
  headerRightPlaceholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
  },
});
