// src/screens/profil/MyProductsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { ArrowLeft, MoreHorizontal } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import type { Product } from "../../shared/types";
import ProductCard from "../../components/product/ProductCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { demoProducts, currentUser } from "../../mocks/products";
import { Screen } from "../../components/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "MyProducts">;

export function MyProductsScreen({ navigation }: Props) {
  const { t } = useTranslation();

  const [products, setProducts] = useState<Product[]>(
    demoProducts.filter((p) => p.seller.id === currentUser.id)
  );
  const [showMenu, setShowMenu] = useState<number | null>(null);

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

  const handleEditProduct = (product: Product) => {
    console.log("Edit product", product.id);
    // Later: navigate to an edit screen
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleMenuToggle = (productId: number) => {
    setShowMenu((prev) => (prev === productId ? null : productId));
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
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
            <Text style={styles.headerTitle}>{t("profile_my_seeds")}</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>
        </View>

        {/* Products grid */}
        <View style={styles.content}>
          {products.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t("my_products_empty")}</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {products.map((product) => (
                <View key={product.id} style={styles.productWrapper}>
                  <ProductCard
                    product={product}
                    onClick={() => handleProductClick(product)}
                    onToggleFavorite={() => handleToggleFavorite(product.id)}
                  />

                  {/* Context menu button (3 dots) */}
                  <Pressable
                    onPress={(e) => {
                      // @ts-ignore
                      e.stopPropagation?.();
                      handleMenuToggle(product.id);
                    }}
                    style={styles.menuButton}
                  >
                    <MoreHorizontal size={16} color="#1F2937" />
                  </Pressable>

                  {/* Context menu */}
                  {showMenu === product.id && (
                    <View style={styles.menuContainer}>
                      {!product.removedByAI && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={(e) => {
                            // @ts-ignore
                            e.stopPropagation?.();
                            handleEditProduct(product);
                            setShowMenu(null);
                          }}
                          style={styles.menuItem}
                        >
                          <Text style={styles.menuItemText}>
                            {t("common_edit")}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={(e) => {
                          // @ts-ignore
                          e.stopPropagation?.();
                          handleDeleteProduct(product.id);
                          setShowMenu(null);
                        }}
                        style={styles.menuItem}
                      >
                        <Text style={styles.menuItemTextDelete}>
                          {t("common_delete")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
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
  productWrapper: {
    width: "48%",
    marginBottom: 16,
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  menuContainer: {
    position: "absolute",
    top: 44,
    right: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    minWidth: 150,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: "#111827",
  },
  menuItemTextDelete: {
    fontSize: 14,
    color: "#EF4444",
  },
});
