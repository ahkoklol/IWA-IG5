import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Search } from "lucide-react-native";
import type { Category } from "../../shared/types";

type Props = {
  onCategorySelect: (category: Category) => void;
};

export default function SearchScreen({ onCategorySelect }: Props) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categories: Category[] = [
    "Légumes",
    "Fruits",
    "Herbes aromatiques / épices",
    "Plantes médicinales",
    "Fleurs décoratives",
    "Plantes exotiques / rares",
  ];

  const handleSelect = (category: Category) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <View style={styles.root}>
      {/* Notch */}
      <View style={styles.notch} />

      {/* Barre de recherche */}
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

      {/* Catégories */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category;

          return (
            <TouchableOpacity
              key={category}
              onPress={() => handleSelect(category)}
              style={[
                styles.categoryBtn,
                index === categories.length - 1 && { borderBottomWidth: 0 },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryText}>{category}</Text>

              {/* Rond vide → rempli si sélectionné */}
              <View style={styles.outerCircle}>
                {isSelected && <View style={styles.innerCircle} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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

  scroll: { flex: 1 },

  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },

  categoryBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  categoryText: {
    fontSize: 14,
    color: "#111827",
  },

  /* ROND vide */
  outerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB", // gris clair
    alignItems: "center",
    justifyContent: "center",
  },

  /* ROND rempli */
  innerCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#7BCCEB", // couleur sélection
  },
});
