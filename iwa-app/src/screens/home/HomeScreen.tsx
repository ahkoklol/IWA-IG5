// iwa-app/src/screens/home/HomeScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ProductCard from "../../components/product/ProductCard";
import type { Product } from "../../shared/types/product";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";
import { useTranslation } from "react-i18next";
import {
  getCategories,
  getProductsByCategory,
  favouriteProduct,
  unfavouriteProduct,
} from "../../api/productApi";

type UiProduct = Product & { isFavorite?: boolean };

type Props = {
  products?: Product[];
};

export default function HomeScreen({ products }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const [data, setData] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: replace with real logged-in client id from your auth state
  const currentClientId = "REPLACE_WITH_CLIENT_ID";

  useEffect(() => {
    if (products && products.length > 0) {
      setData(products.map((p) => ({ ...p })));
      return;
    }

    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const categories = await getCategories();
        const lists = await Promise.all(
          categories.map((c) =>
            getProductsByCategory(c.name).catch(() => [] as Product[]),
          ),
        );
        const merged = lists.flat();

        if (!cancelled) {
          setData(merged.map((p) => ({ ...p, isFavorite: false })));
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load products");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [products]);

  const handleClick = (p: UiProduct) => {
    navigation.navigate("ProductDetail", { productId: String(p.postId) });
  };

  const handleToggleFavorite = async (product: UiProduct) => {
    if (!currentClientId || currentClientId === "REPLACE_WITH_CLIENT_ID") {
      return;
    }

    const wasFavorite = !!product.isFavorite;

    setData((prev) =>
      prev.map((p) =>
        p.postId === product.postId ? { ...p, isFavorite: !wasFavorite } : p,
      ),
    );

    try {
      if (!wasFavorite) {
        await favouriteProduct(product.postId, currentClientId);
      } else {
        await unfavouriteProduct(product.postId, currentClientId);
      }
    } catch {
      setData((prev) =>
        prev.map((p) =>
          p.postId === product.postId ? { ...p, isFavorite: wasFavorite } : p,
        ),
      );
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return data.filter((p) => {
      if (p.status !== "visible") return false;

      if (!q) return true;

      return (
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
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
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        )}

        {error && !loading && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <View style={styles.content}>
            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{t("my_products_empty")}</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {filtered.map((product) => (
                  <View key={product.postId} style={styles.productWrapper}>
                    <ProductCard
                      product={product}
                      onClick={() => handleClick(product)}
                      onToggleFavorite={() => handleToggleFavorite(product)}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
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
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: { color: "#6B7280", fontSize: 14 },
  loader: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
