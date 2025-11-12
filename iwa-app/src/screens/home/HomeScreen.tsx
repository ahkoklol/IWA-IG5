import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  StatusBar,
  FlatList,
  ListRenderItem,
  Text,
} from "react-native";
import { Search } from "lucide-react-native";
import ProductCard from "../../components/product/ProductCard";
import type { Product } from "../../shared/types";
import { allProducts } from "../../mocks/products";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";

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

  // Données : utilise les mocks si rien passé en prop
  const data = products ?? allProducts;

  // ✅ La fonction que tu demandes
  const handleClick = (p: Product) => {
    // si un handler custom est fourni, on le laisse faire,
    // sinon on navigue par défaut
    if (onProductClick) return onProductClick(p);
    navigation.navigate("ProductDetail", { productId: String(p.id) });
  };

  const handleFav = onToggleFavorite ?? (() => {});

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.seller?.username?.toLowerCase().includes(q)
    );
  }, [data, query]);

  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <ProductCard
      product={item}
      onClick={() => handleClick(item)}
      onToggleFavorite={() => handleFav(item.id)}
    />
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Notch (simu maquette) */}
      <View style={styles.notch} />

      {/* Barre de recherche (sticky) */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchInner}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un article ou un membre"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Grille produits */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun résultat</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columns}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  notch: {
    width: 128,
    height: 32,
    backgroundColor: "#000",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignSelf: "center",
    marginTop: 8,
  },
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  columns: { gap: 16 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: { color: "#6B7280" },
});
