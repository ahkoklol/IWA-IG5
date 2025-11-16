import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { Filters } from "../../shared/types";
import type { RootStackParamList } from "../../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "FilterScreen">;

export function FilterScreen({ route, navigation }: Props) {
  const { filters } = route.params;

  const getFilterValue = (filterType: string): string | null => {
    switch (filterType) {
      case "sortBy":
        return filters.sortBy;
      case "category":
        return filters.category;
      case "plantingPeriod":
        return filters.plantingPeriod.length > 0
          ? filters.plantingPeriod.join(", ")
          : null;
      case "floweringPeriod":
        return filters.floweringPeriod.length > 0
          ? filters.floweringPeriod.join(", ")
          : null;
      case "edible":
        return filters.edible;
      default:
        return null;
    }
  };

  const filterOptions = [
    { id: "sortBy", label: "Classer par", value: getFilterValue("sortBy") },
    { id: "category", label: "Catégorie", value: getFilterValue("category") },
    {
      id: "plantingPeriod",
      label: "Période de plantation",
      value: getFilterValue("plantingPeriod"),
    },
    {
      id: "floweringPeriod",
      label: "Période de fructification",
      value: getFilterValue("floweringPeriod"),
    },
    { id: "edible", label: "Comestible", value: getFilterValue("edible") },
  ];

  const handleClose = () => {
    navigation.goBack();
  };

  const handleClearAll = () => {
    // Ici tu peux remettre des filtres par défaut
    // puis éventuellement navigation.goBack()
  };

  const handleFilterSelect = (filterType: string) => {
    navigation.navigate("FilterDetailScreen", {
      filterType,
      selectedValues: (() => {
        switch (filterType) {
          case "sortBy":
            return filters.sortBy;
          case "category":
            return filters.category;
          case "plantingPeriod":
            return filters.plantingPeriod;
          case "floweringPeriod":
            return filters.floweringPeriod;
          case "edible":
            return filters.edible;
          default:
            return null;
        }
      })(),
    });
  };

  const handleApplyFilters = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Phone notch simulation */}
      <View style={styles.notch} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.headerButtonText}>Fermer</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filtrer</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.headerClearText}>Effacer tout</Text>
        </TouchableOpacity>
      </View>

      {/* Filter options */}
      <ScrollView
        style={styles.optionsContainer}
        contentContainerStyle={styles.optionsContent}
      >
        {filterOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleFilterSelect(option.id)}
            style={[
              styles.optionRow,
              index === filterOptions.length - 1 && styles.optionRowLast,
            ]}
          >
            <Text style={styles.optionLabel}>{option.label}</Text>
            <View style={styles.optionRight}>
              {option.value && (
                <Text style={styles.optionValue}>{option.value}</Text>
              )}
              <ChevronRight size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Apply button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleApplyFilters}
          style={styles.applyButton}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>Afficher les résultats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  notch: {
    width: 128,
    height: 32,
    backgroundColor: "#000000",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignSelf: "center",
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerButtonText: {
    fontSize: 14,
    color: "#111827",
  },
  headerTitle: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  headerClearText: {
    fontSize: 14,
    color: "#6B7280",
  },
  optionsContainer: {
    flex: 1,
  },
  optionsContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  optionRowLast: {
    borderBottomWidth: 0,
  },
  optionLabel: {
    fontSize: 14,
    color: "#111827",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionValue: {
    fontSize: 14,
    color: "#7BCCEB",
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  applyButton: {
    width: "100%",
    backgroundColor: "#7BCCEB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
