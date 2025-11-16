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

import type {
  SortBy,
  Category,
  EdibleFilter,
} from "../../shared/types";
import type { RootStackParamList } from "../../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "FilterDetailScreen">;

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const SORT_OPTIONS: SortBy[] = [
  "Pertinence",
  "Prix croissant",
  "Prix décroissant",
  "Le plus récent",
];

const CATEGORIES: Category[] = [
  "Légumes",
  "Fruits",
  "Herbes aromatiques / épices",
  "Plantes médicinales",
  "Fleurs décoratives",
  "Plantes exotiques / rares",
];

const EDIBLE_OPTIONS: EdibleFilter[] = ["Oui", "Non", "Peu importe"];

export function FilterDetailScreen({ route, navigation }: Props) {
  const { filterType, selectedValues } = route.params;

  const isMultiSelect =
    filterType === "plantingPeriod" || filterType === "floweringPeriod";

  const [localSelected, setLocalSelected] = useState<
    string | string[] | null
  >(selectedValues);

  const getTitle = useMemo(() => {
    switch (filterType) {
      case "sortBy":
        return "Classer par";
      case "category":
        return "Catégorie";
      case "plantingPeriod":
        return "Période de plantation";
      case "floweringPeriod":
        return "Période de fructification";
      case "edible":
        return "Comestible";
      default:
        return "";
    }
  }, [filterType]);

  const getOptions = useMemo(() => {
    switch (filterType) {
      case "sortBy":
        return SORT_OPTIONS;
      case "category":
        return CATEGORIES;
      case "plantingPeriod":
        return MONTHS;
      case "floweringPeriod":
        return MONTHS;
      case "edible":
        return EDIBLE_OPTIONS;
      default:
        return [];
    }
  }, [filterType]);

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
    // Pour l'instant, on fait juste un retour.
    // Tu pourras plus tard remonter localSelected via un store global ou context.
    navigation.goBack();
  };

  const options = getOptions;

  return (
    <View style={styles.container}>
      {/* Phone notch simulation */}
      <View style={styles.notch} />

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
          <Text style={styles.headerClearText}>Effacer</Text>
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
