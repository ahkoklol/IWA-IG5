import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";

interface HelpSettingsScreenProps {
  onBack: () => void;
}

export function HelpSettingsScreen({ onBack }: HelpSettingsScreenProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide & Support</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Vous rencontrez un problème ou vous avez une question concernant
          l'application ?
        </Text>

        <Text style={styles.paragraph}>
          Consultez notre section d'aide pour trouver des réponses rapides sur
          l'utilisation des fonctionnalités, la gestion de votre compte, ou les
          paramètres de confidentialité.
        </Text>

        <Text style={styles.paragraph}>
          Si vous avez besoin d'une assistance personnalisée, vous pouvez nous
          écrire directement à :
        </Text>

        {/* Email box */}
        <View style={styles.emailBox}>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:support@bonnegraine.com")}
          >
            <Text style={styles.emailText}>support@bonnegraine.com</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.paragraph}>
          Nous faisons notre maximum pour vous répondre dans les meilleurs
          délais.
        </Text>
      </ScrollView>
    </View>
  );
}

/* ------------------------------- */
/*              STYLES             */
/* ------------------------------- */

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
    paddingTop: 20,
    paddingBottom: 30,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: "#4B5563",
    marginBottom: 16,
  },

  emailBox: {
    backgroundColor: "rgba(123, 204, 235, 0.12)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  emailText: {
    color: "#7BCCEB",
    fontSize: 16,
    fontWeight: "500",
  },
});
