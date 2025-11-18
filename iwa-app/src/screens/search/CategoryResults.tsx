// iwa-app/src/screens/search/CategoryResults.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import ProductCard from "../../components/product/ProductCard";
import { demoProducts } from "../../mocks/products";
import type { Product, Category, Filters } from "../../shared/types";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "CategoryResults">;

export function CategoryResults({ route, navigation }: Props) {
  const { category, searchQuery } = route.params;

  const [searchValue, setSearchValue] = useState(searchQuery ?? "");
  const [filters] = useState<Filters>({
    sortBy: null,
    category: (category as Category | null) ?? null,
    plantingPeriod: [],
    floweringPeriod: [],
    edible: null,
  });

  let products: Product[] = demoProducts;

  if (category) {
    products = products.filter((p) => p.category === category);
  }

  if (searchQuery) {
    const queryLower = searchQuery.toLowerCase();
    products = products.filter((p) =>
      p.name.toLowerCase().includes(queryLower) // 🔹 ICI : name et pas title
    );
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleProductClick = (product: Product) => {
    // 🔹 Aligne avec ton HomeRootScreen : on passe productId
    navigation.navigate("ProductDetail", { productId: String(product.id) });
  };

  const handleToggleFavorite = (productId: number) => {
    // À brancher plus tard sur ton state / backend
    console.log("Toggle favorite product", productId);
  };

  const handleFilterClick = () => {
    navigation.navigate("FilterScreen", {
      filters,
    });
  };

  const handleSearchSubmit = () => {
    if (!searchValue.trim()) return;
    navigation.setParams({
      category: null,
      searchQuery: searchValue.trim(),
    });
  };

  return (
    <Screen>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header with back and filter buttons */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
            <ArrowLeft size={20} color="#1f2937" />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Search size={18} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder="Rechercher un article ou un membre"
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={handleSearchSubmit}
            />
          </View>

          <TouchableOpacity
            onPress={handleFilterClick}
            style={styles.filterButton}
          >
            <SlidersHorizontal size={20} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <Text style={styles.categoryLabel}>
          {category ? String(category) : searchQuery ?? "Résultats"}
        </Text>
      </View>

      {/* Products grid */}
      <View style={styles.productsWrapper}>
        <View style={styles.productsGrid}>
          {products.map((product) => (
            <View key={product.id} style={styles.cardWrapper}>
              <ProductCard
                product={product}
                onClick={() => handleProductClick(product)}
                onToggleFavorite={() => handleToggleFavorite(product.id)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    paddingBottom: 32,
  },

  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#ffffff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  searchInput: {
    borderWidth: 2,
    borderColor: "#7BCCEB",
    borderRadius: 12,
    paddingVertical: 8,
    paddingLeft: 36,
    paddingRight: 12,
    fontSize: 14,
    backgroundColor: "#ffffff",
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#7BCCEB",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  productsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 16,
  },
});
