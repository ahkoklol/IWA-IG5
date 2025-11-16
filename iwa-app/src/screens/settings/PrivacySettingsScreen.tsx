import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";

interface PrivacySettingsScreenProps {
  onBack: () => void;
}

export function PrivacySettingsScreen({ onBack }: PrivacySettingsScreenProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confidentialité</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Nous accordons une importance particulière à la protection de vos
          données personnelles. Les informations que vous partagez au sein de
          l'application sont utilisées uniquement pour assurer le bon
          fonctionnement des services et améliorer votre expérience.
        </Text>

        <Text style={styles.paragraph}>
          Nous ne vendons, ne louons ni ne partageons vos données avec des tiers
          sans votre consentement explicite.
        </Text>

        <Text style={styles.paragraph}>
          Vous pouvez à tout moment consulter, modifier ou supprimer vos
          informations depuis les paramètres de votre compte.
        </Text>

        <Text style={styles.paragraph}>
          Pour toute question concernant la confidentialité ou le traitement de
          vos données, vous pouvez nous contacter via le support utilisateur.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "500",
  },

  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: "#4B5563",
    marginBottom: 14,
  },
});
