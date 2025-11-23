// iwa-app/src/screens/home/HomeScreen.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  StatusBar,
  Text,
  ScrollView,
} from "react-native";
import { Search as SearchIcon } from "lucide-react-native";
import ProductCard from "../../components/product/ProductCard";
import type { Product } from "../../shared/types";
import { allProducts } from "../../mocks/products";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";
import { useTranslation } from "react-i18next";

type Props = {
  products?: Product[];
  onProductClick?: (product: Product) => void;
  onToggleFavorite?: (productId: number) => void;
};

export default function HomeScreen({
  products,
  onProductClick,
  onToggleFavorite,
}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  // Données : utilise les mocks si rien n'est passé en prop
  const data = products ?? allProducts;

  // Navigation / clic produit
  const handleClick = (p: Product) => {
    if (onProductClick) return onProductClick(p);
    navigation.navigate("ProductDetail", { productId: String(p.id) });
  };

  // Favoris : si un handler est fourni, on l'utilise, sinon no-op
  const handleFav = onToggleFavorite ?? (() => {});

  // ✅ Filtrage : uniquement produits NON vendus et NON supprimés par l'IA
  // + filtre de recherche
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return data.filter((p) => {
      // on masque les produits vendus ou supprimés par IA
      if (p.sold || p.removedByAI) return false;

      if (!q) return true;

      return (
        p.name.toLowerCase().includes(q) ||
        p.seller?.username?.toLowerCase().includes(q)
      );
    });
  }, [data, query]);

  return (
    <Screen>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Grille produits */}
        <View style={styles.content}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{t("my_products_empty")}</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filtered.map((product) => (
                <View key={product.id} style={styles.productWrapper}>
                  <ProductCard
                    product={product}
                    onClick={() => handleClick(product)}
                    onToggleFavorite={() => handleFav(product.id)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
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

  // Search bar (pas utilisée dans le JSX ici, tu peux la réutiliser si besoin)
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  searchInner: {
    position: "relative",
    borderWidth: 2,
    borderColor: "#7BCCEB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingLeft: 40,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    marginTop: -10,
  },
  searchInput: {
    height: 44,
    fontSize: 14,
    color: "#111827",
    paddingRight: 12,
  },

  // Contenu + grille alignés sur MyProductsScreen
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productWrapper: {
    width: "48%",
    marginBottom: 16,
    position: "relative",
  },

  // État vide
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: { color: "#6B7280", fontSize: 14 },
});
