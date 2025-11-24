// iwa-app/src/screens/search/FilterScreen.tsx

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
import { useTranslation } from "react-i18next";

import type { Filters } from "../../shared/types";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "FilterScreen">;

export function FilterScreen({ route, navigation }: Props) {
  const { filters } = route.params;
  const { t } = useTranslation();

const mapCategoryToKey = (category?: string | null) => {
  switch (category) {
    case "Légumes":
      return "search_cat_vegetables";
    case "Fruits":
      return "search_cat_fruits";
    case "Herbes aromatiques / épices":
      return "search_cat_herbs";
    case "Plantes médicinales":
      return "search_cat_medicinal";
    case "Fleurs décoratives":
      return "search_cat_flowers";
    case "Plantes exotiques / rares":
      return "search_cat_exotic";
    default:
      return null;
  }
};

const getFilterValue = (filterType: string): string | null => {
  switch (filterType) {
    case "sortBy":
      return filters.sortBy;
    case "category": {
      const key = mapCategoryToKey(filters.category);
      return key ? t(key) : null;
    }
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
    { id: "sortBy", label: t("filter_sort_by"), value: getFilterValue("sortBy") },
    { id: "category", label: t("ad_category"), value: getFilterValue("category") },
    {
      id: "plantingPeriod",
      label: t("ad_planting_period"),
      value: getFilterValue("plantingPeriod"),
    },
    {
      id: "floweringPeriod",
      label: t("ad_fruiting_period"),
      value: getFilterValue("floweringPeriod"),
    },
    { id: "edible", label: t("ad_edible"), value: getFilterValue("edible") },
  ];

  const handleClose = () => {
    navigation.goBack();
  };

  const handleClearAll = () => {
    // TODO: reset des filtres si besoin
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
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.headerButtonText}>{t("filter_close")}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("filter_title")}</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.headerClearText}>{t("filter_clear")}</Text>
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
            <Text style={styles.applyButtonText}>
              {t("filter_show_results")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
