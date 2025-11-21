// src/screens/admin/AdminSearchScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { Category, Product, User } from "../../shared/types";
import { demoProducts, users as demoUsers } from "../../mocks/products";
import { AdminLayout } from "./AdminLayout";
import { Screen } from "../../components/Screen";

// ---------- Composant présentational (UI pure) ----------

interface AdminSearchPageProps {
  products: Product[];
  users: User[];
  onCategorySelect: (category: Category) => void;
  onProductClick: (product: Product) => void;
  onUserClick: (userId: number) => void;
}

export function AdminSearchPage({
  products,
  users,
  onCategorySelect,
  onProductClick,
  onUserClick,
}: AdminSearchPageProps) {
  const [searchType, setSearchType] = useState<"article" | "member">("article");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: Category[] = [
    "Fleurs décoratives",
    "Herbes aromatiques / épices",
    "Légumes",
    "Arbres / arbustes",
    "Plantes grasses / cactus",
    "Plantes médicinales",
  ] as Category[];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Screen >
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Text style={styles.headerTitle}>Recherche</Text>

          {/* Toggle type recherche */}
          <View style={styles.toggleWrapper}>
            <TouchableOpacity
              onPress={() => setSearchType("article")}
              style={[
                styles.toggleButton,
                searchType === "article" && styles.toggleButtonActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  searchType === "article" && styles.toggleTextActive,
                ]}
              >
                Article
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSearchType("member")}
              style={[
                styles.toggleButton,
                searchType === "member" && styles.toggleButtonActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  searchType === "member" && styles.toggleTextActive,
                ]}
              >
                Membre
              </Text>
            </TouchableOpacity>
          </View>

          {/* Barre de recherche */}
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              searchType === "article"
                ? "Rechercher des graines..."
                : "Rechercher un membre..."
            }
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Catégories (uniquement articles + pas de recherche en cours) */}
        {searchType === "article" && !searchQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catégories</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => onCategorySelect(category)}
                  style={styles.categoryButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Résultats de recherche */}
        {searchQuery !== "" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Résultats (
              {searchType === "article"
                ? filteredProducts.length
                : filteredUsers.length}
              )
            </Text>

            {searchType === "article" ? (
              <View style={styles.resultsList}>
                {filteredProducts.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aucun article trouvé</Text>
                  </View>
                ) : (
                  filteredProducts.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      onPress={() => onProductClick(product)}
                      style={styles.productCard}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: product.images[0] }}
                        style={styles.productImage}
                      />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productCategory}>
                          {product.category}
                        </Text>
                        <Text style={styles.productPrice}>{product.price}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            ) : (
              <View style={styles.resultsList}>
                {filteredUsers.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aucun membre trouvé</Text>
                  </View>
                ) : (
                  filteredUsers.map((user) => (
                    <TouchableOpacity
                      key={user.id}
                      onPress={() => onUserClick(user.id)}
                      style={styles.userCard}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: user.avatar }}
                        style={styles.userAvatar}
                      />
                      <View style={styles.userInfo}>
                        <Text style={styles.userUsername}>
                          {user.username}
                        </Text>
                        <Text style={styles.userFullName}>
                          {user.fullName}
                        </Text>
                        <Text style={styles.userLocation}>
                          {user.location}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
    </Screen>
  );
}

// ---------- Screen avec navigation ----------

type NavigationProps = NativeStackScreenProps<RootStackParamList>;

export function AdminSearchScreen({ navigation }: NavigationProps) {
  const products = demoProducts;
  const users = demoUsers;

  const handleCategorySelect = (category: Category) => {
    navigation.navigate("CategoryResults", {
      category,
      searchQuery: "",
    });
  };

  const handleProductClick = (product: Product) => {
    navigation.navigate("ProductDetail", {
      productId: String(product.id),
    });
  };

  const handleUserClick = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    navigation.navigate("MyProfileScreen", {
      user,
      initialTab: "profile",
    });
  };

  return (
    <AdminLayout activeTab="search">
      <AdminSearchPage
        products={products}
        users={users}
        onCategorySelect={handleCategorySelect}
        onProductClick={handleProductClick}
        onUserClick={handleUserClick}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingBottom: 80, // pour la navbar admin
  },
  notch: {
    width: 128,
    height: 32,
    backgroundColor: "#000000",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignSelf: "center",
  },
  header: {
    backgroundColor: "#ffffffff",
  },
  headerInner: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    color: "#000000ff",
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "600",
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  toggleButtonActive: {
    backgroundColor: "#000000ff",
  },
  toggleText: {
    color: "#000000ff",
    fontSize: 14,
  },
  toggleTextActive: {
    color: "#ffffffff",
    fontWeight: "600",
  },
  searchInput: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
    borderWidth: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#000000ff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 13,
    color: "#000000ff",
    textAlign: "center",
  },
  resultsList: {
    gap: 8,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 14,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    color: "#111827",
  },
  productCategory: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: "#668b01",
    fontWeight: "600",
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userUsername: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    color: "#111827",
  },
  userFullName: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
