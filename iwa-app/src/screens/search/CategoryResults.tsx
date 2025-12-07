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
import { useTranslation } from "react-i18next";

import ProductCard from "../../components/product/ProductCard";
import { demoProducts } from "../../mocks/products";
import type { Product, Category, Filters } from "../../shared/types";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "CategoryResults">;

export function CategoryResults({ route, navigation }: Props) {
  const { category, searchQuery } = route.params;
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState(searchQuery ?? "");
  const [filters] = useState<Filters>({
    sortBy: null,
    category: (category as Category | null) ?? null,
    plantingPeriod: [],
    floweringPeriod: [],
    edible: null,
  });

  // ✅ Base : uniquement produits NON vendus et NON supprimés par l'IA
  let products: Product[] = demoProducts.filter(
    (p) => !p.sold && !p.removedByAI
  );

  if (category) {
    products = products.filter((p) => p.category === category);
  }

  if (searchQuery) {
    const queryLower = searchQuery.toLowerCase();
    products = products.filter((p) =>
      p.name.toLowerCase().includes(queryLower)
    );
  }

  const handleBack = () => navigation.goBack();

  const handleProductClick = (product: Product) => {
    navigation.navigate("ProductDetail", { productId: String(product.id) });
  };

  const handleToggleFavorite = (id: number) => {
    console.log("Toggle favorite product", id);
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
        {/* Header */}
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
                placeholder={t("search_placeholder")}
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
            {category
              ? t(`search_cat_${categoryKey(category)}`)
              : searchQuery || t("search_results")}
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

/**
 * Convert category label to translation key suffix
 */
function categoryKey(cat: string): string {
  switch (cat) {
    case "Légumes":
      return "vegetables";
    case "Fruits":
      return "fruits";
    case "Herbes aromatiques / épices":
      return "herbs";
    case "Plantes médicinales":
      return "medicinal";
    case "Fleurs décoratives":
      return "flowers";
    case "Plantes exotiques / rares":
      return "exotic";
    default:
      return "unknown";
  }
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
