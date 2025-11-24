// src/screens/profil/MyProductsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Modal,
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

  // Etat pour la suppression
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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
    // Plus tard : navigation vers un écran d'édition
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalVisible(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    }
    setProductToDelete(null);
    setDeleteModalVisible(false);
  };

  const cancelDeleteProduct = () => {
    setProductToDelete(null);
    setDeleteModalVisible(false);
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
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={(e) => {
                        // @ts-ignore
                        e.stopPropagation?.();
                        handleDeleteProduct(product);
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

      {/* Modal de confirmation de suppression */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelDeleteProduct}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {t("common_delete")} ?
            </Text>
            <Text style={styles.modalSubtitle}>
              Es-tu sûre de vouloir supprimer cette annonce ?
            </Text>

            {productToDelete && (
              <Text style={styles.modalProductName}>
                {productToDelete.name}
              </Text>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                onPress={cancelDeleteProduct}
                style={styles.modalSecondaryButton}
                activeOpacity={0.9}
              >
                <Text style={styles.modalSecondaryButtonText}>
                  {t("common_cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDeleteProduct}
                style={styles.modalDangerButton}
                activeOpacity={0.9}
              >
                <Text style={styles.modalDangerButtonText}>
                  {t("common_delete")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // Styles du modal de confirmation
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "white",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 12,
  },
  modalProductName: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  modalSecondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSecondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  modalDangerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  modalDangerButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
  },
});

