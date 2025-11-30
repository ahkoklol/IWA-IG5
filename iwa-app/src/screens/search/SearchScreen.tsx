// src/screens/search/SearchScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Search as SearchIcon } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SearchScreen"
>;

// On manipule des IDs de catégories en string
const CATEGORIES: { value: string; labelKey: string }[] = [
  { value: "VEGETABLES", labelKey: "search_cat_vegetables" },
  { value: "FRUITS", labelKey: "search_cat_fruits" },
  { value: "HERBS_SPICES", labelKey: "search_cat_herbs" },
  { value: "MEDICINAL", labelKey: "search_cat_medicinal" },
  { value: "FLOWERS", labelKey: "search_cat_flowers" },
  { value: "EXOTIC", labelKey: "search_cat_exotic" },
];

export function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate("CategoryResults", {
      // cast pour s'aligner sur le type défini dans RootStackParamList
      category: categoryId as any,
      searchQuery: undefined,
    });
  };

  const handleSearchSubmit = () => {
    const trimmed = searchValue.trim();
    if (!trimmed) return;

    navigation.navigate("CategoryResults", {
      category: null as any,
      searchQuery: trimmed,
    });
  };

  return (
    <Screen>
      {/* Header / titre */}
      <View style={styles.header}>
        <Text style={styles.title}>{t("navbar_search")}</Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchWrapper}>
        <SearchIcon size={18} color="#9ca3af" style={styles.searchIcon} />
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

      {/* Catégories */}
      <ScrollView contentContainerStyle={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>{t("search_categories")}</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryText}>{t(category.labelKey)}</Text>
            </TouchableOpacity>
          ))}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  searchWrapper: {
    marginHorizontal: 16,
    marginTop: 8,
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
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryText: {
    fontSize: 14,
    color: "#111827",
  },
});

export default SearchScreen;
