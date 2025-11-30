// iwa-app/src/screens/search/CategoryResults.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import ProductCard from "../../components/product/ProductCard";
import type { Product } from "../../shared/types/product";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";
import {
  getAllProducts,
  getProductsByCategory,
  favouriteProduct,
  unfavouriteProduct,
} from "../../api/productApi";
import type { Filters } from "../../shared/types";

// TODO: à remplacer plus tard par les infos de l'utilisateur connecté (Keycloak)
const MOCK_CLIENT_ID = "REPLACE_WITH_CONNECTED_CLIENT_ID";

type Props = NativeStackScreenProps<RootStackParamList, "CategoryResults">;

// UiProduct basé sur LE Product du backend (product.ts)
type UiProduct = Product & { isFavorite?: boolean };

export function CategoryResults({ route, navigation }: Props) {
  const { category, searchQuery } = route.params;
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState(searchQuery ?? "");
  const [filters] = useState<Filters>({
    sortBy: null,
    category: null, // on laisse null pour être compatible avec le type global
    plantingPeriod: [],
    floweringPeriod: [],
    edible: null,
  });

  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const activeQuery = (searchValue || searchQuery || "").trim().toLowerCase();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let base: Product[];

      if (category) {
        // produits d’une catégorie donnée (category est un ID de catégorie string)
        base = await getProductsByCategory(category as string);
      } else {
        // tous les produits
        base = await getAllProducts();
      }

      // On initialise isFavorite à false (le back ne le gère pas encore)
      const uiProducts: UiProduct[] = base.map((p) => ({
        ...p,
        isFavorite: false,
      }));

      setProducts(uiProducts);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // masque les produits vendus / bannis / cachés
      if (p.status === "sold" || p.status === "banned" || p.status === "hidden") {
        return false;
      }

      // si on a une catégorie dans l’URL, on filtre dessus
      if (category && p.category !== category) {
        return false;
      }

      if (!activeQuery) return true;

      return p.description.toLowerCase().includes(activeQuery);
    });
  }, [products, category, activeQuery]);

  const handleBack = () => navigation.goBack();

  const handleProductClick = (product: UiProduct) => {
    navigation.navigate("ProductDetail", { productId: String(product.postId) });
  };

  const handleToggleFavorite = async (postId: string) => {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) =>
        p.postId === postId ? { ...p, isFavorite: !p.isFavorite } : p,
      ),
    );

    const target = products.find((p) => p.postId === postId);
    const currentlyFavorite = target?.isFavorite ?? false;

    try {
      if (!currentlyFavorite) {
        await favouriteProduct(postId, MOCK_CLIENT_ID);
      } else {
        await unfavouriteProduct(postId, MOCK_CLIENT_ID);
      }
    } catch (e) {
      // rollback en cas d’erreur
      setProducts((prev) =>
        prev.map((p) =>
          p.postId === postId ? { ...p, isFavorite: currentlyFavorite } : p,
        ),
      );
      console.error("Failed to toggle favorite", e);
    }
  };

  const handleFilterClick = () => {
    navigation.navigate("FilterScreen", {
      filters,
    });
  };

  const handleSearchSubmit = () => {
    const trimmed = searchValue.trim();
    if (!trimmed) return;

    navigation.setParams({
      category: null,
      searchQuery: trimmed,
    });
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text>{t("error_generic")}</Text>
          <Text style={styles.errorDetails}>{error}</Text>
        </View>
      </Screen>
    );
  }

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
              ? t(`search_cat_${categoryKey(category as string)}`)
              : searchQuery || t("search_results")}
          </Text>
        </View>

        {/* Products grid */}
        <View style={styles.productsWrapper}>
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <View key={product.postId} style={styles.cardWrapper}>
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                  onToggleFavorite={() => handleToggleFavorite(product.postId)}
                />
              </View>
            ))}
          </View>

          {filteredProducts.length === 0 && (
            <View style={styles.center}>
              <Text>{t("search_no_results")}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

/**
 * Convert category ID -> suffix de clé i18n
 * (cohérent avec les IDs utilisés dans SearchScreen)
 */
function categoryKey(cat: string): string {
  switch (cat) {
    case "VEGETABLES":
      return "vegetables";
    case "FRUITS":
      return "fruits";
    case "HERBS_SPICES":
      return "herbs";
    case "MEDICINAL":
      return "medicinal";
    case "FLOWERS":
      return "flowers";
    case "EXOTIC":
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
  center: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorDetails: {
    marginTop: 4,
    fontSize: 12,
    color: "#EF4444",
  },
});

export default CategoryResults;
