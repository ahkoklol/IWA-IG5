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
import { Screen } from "../../components/Screen";

interface AboutSettingsScreenProps {
  onBack: () => void;
}

export function AboutSettingsScreen({ onBack }: AboutSettingsScreenProps) {
  return (
    <Screen>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>À propos</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Bonne Graine est née de l'initiative de trois étudiantes passionnées
          de jardinage, qui rêvaient de rendre le troc de graines plus simple,
          plus accessible et surtout plus humain.
        </Text>

        <Text style={styles.paragraph}>
          Face aux difficultés pour échanger des semences de manière fiable,
          conviviale et organisée, nous avons imaginé une application qui
          rassemble une communauté autour du partage, de la découverte et de la
          biodiversité.
        </Text>

        <Text style={styles.paragraph}>
          Notre vision est de créer un espace où chacun peut trouver, échanger
          et transmettre des variétés nouvelles sans coût excessif, sans
          contraintes, et toujours dans un esprit d'entraide.
        </Text>

        <Text style={styles.paragraph}>
          Jour après jour, nous cherchons à améliorer l'expérience, à proposer
          de nouvelles fonctionnalités et à encourager une utilisation
          responsable et durable des ressources.
        </Text>

        <Text style={styles.paragraph}>
          Si vous souhaitez en savoir plus ou nous contacter, vous pouvez nous
          écrire à :
        </Text>

        <View style={styles.emailBox}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("mailto:nouscontacter@bonnegraine.com")
            }
          >
            <Text style={styles.emailText}>
              nouscontacter@bonnegraine.com
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.quote}>
          Merci d'utiliser Bonne Graine et de participer avec nous à la
          diffusion de petites graines… qui font naître de grandes idées.
        </Text>
      </ScrollView>
    </View>
    </Screen>
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

  quote: {
    fontSize: 16,
    lineHeight: 22,
    color: "#4B5563",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
});
