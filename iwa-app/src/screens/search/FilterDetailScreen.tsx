// iwa-app/src/screens/search/FilterDetailScreen.tsx

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "FilterDetailScreen">;

export function FilterDetailScreen({ route, navigation }: Props) {
  const { filterType, selectedValues } = route.params;
  const { t } = useTranslation();

  const isMultiSelect =
    filterType === "plantingPeriod" || filterType === "floweringPeriod";

  const [localSelected, setLocalSelected] = useState<
    string | string[] | null
  >(selectedValues);

  const getTitle = useMemo(() => {
    switch (filterType) {
      case "sortBy":
        return t("filter_sort_by");
      case "category":
        return t("ad_category");
      case "plantingPeriod":
        return t("ad_planting_period");
      case "floweringPeriod":
        return t("ad_fruiting_period");
      case "edible":
        return t("ad_edible");
      default:
        return "";
    }
  }, [filterType, t]);

  const getOptions = useMemo(() => {
    switch (filterType) {
      case "sortBy":
        return [
          t("filter_sort_relevance"),
          t("filter_sort_price_asc"),
          t("filter_sort_price_desc"),
          t("filter_sort_most_recent"),
        ];
      case "category":
        return [
          t("search_cat_vegetables"),
          t("search_cat_fruits"),
          t("search_cat_herbs"),
          t("search_cat_medicinal"),
          t("search_cat_flowers"),
          t("search_cat_exotic"),
        ];
      case "plantingPeriod":
      case "floweringPeriod":
        return [
          t("filter_january"),
          t("filter_february"),
          t("filter_march"),
          t("filter_april"),
          t("filter_may"),
          t("filter_june"),
          t("filter_july"),
          t("filter_august"),
          t("filter_september"),
          t("filter_october"),
          t("filter_november"),
          t("filter_december"),
        ];
      case "edible":
        return [
          t("filter_yes"),
          t("filter_no"),
          t("filter_any"),
        ];
      default:
        return [];
    }
  }, [filterType, t]);

  const isSelected = (option: string) => {
    if (Array.isArray(localSelected)) {
      return localSelected.includes(option);
    }
    return localSelected === option;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    setLocalSelected(null);
  };

  const handleSelect = (value: string) => {
    if (isMultiSelect) {
      if (!Array.isArray(localSelected) || localSelected === null) {
        setLocalSelected([value]);
      } else if (localSelected.includes(value)) {
        setLocalSelected(localSelected.filter((v) => v !== value));
      } else {
        setLocalSelected([...localSelected, value]);
      }
    } else {
      setLocalSelected(value);
    }
  };

  const handleApply = () => {
    // TODO : remonter localSelected via un store ou un contexte si besoin
    navigation.goBack();
  };

  const options = getOptions;

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#1F2937" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{getTitle}</Text>

          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.headerClearText}>{t("filter_clear")}</Text>
          </TouchableOpacity>
        </View>

        {/* Options */}
        <ScrollView
          style={styles.optionsContainer}
          contentContainerStyle={styles.optionsContent}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleSelect(option)}
              style={styles.optionRow}
            >
              <Text style={styles.optionLabel}>{option}</Text>
              <View
                style={[
                  styles.radioOuter,
                  isSelected(option)
                    ? styles.radioOuterSelected
                    : styles.radioOuterUnselected,
                ]}
              >
                {isSelected(option) && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Apply button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleApply}
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
  backButton: {
    width: 40,
    height: 40,
    marginLeft: -8,
    alignItems: "center",
    justifyContent: "center",
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
  optionLabel: {
    fontSize: 15,
    color: "#111827",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#22C6E9",
  },
  radioOuterUnselected: {
    borderColor: "#D1D5DB",
  },
  radioInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#7BCCEB",
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
