import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Trash2 } from "lucide-react-native";

interface DeleteAccountConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteAccountConfirmationModal({
  visible,
  onCancel,
  onConfirm,
}: DeleteAccountConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Icon wrapper */}
            <View style={styles.iconWrapper}>
              <Trash2 size={36} color="#DC2626" />
            </View>

            <Text style={styles.title}>Supprimer mon compte ?</Text>

            <Text style={styles.subtitle}>
              Cette action est définitive. La suppression de votre compte
              entraînera :
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • La suppression de toutes vos informations personnelles
                (profil, coordonnées, etc.).
              </Text>
              <Text style={styles.bulletItem}>
                • La suppression de toutes vos annonces publiées.
              </Text>
              <Text style={styles.bulletItem}>
                • La suppression de vos favoris, messages et évaluations
                associées à votre compte.
              </Text>
            </View>

            <Text style={styles.warningText}>
              Cette opération est irréversible. Êtes-vous sûre de vouloir
              continuer ?
            </Text>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={onCancel}
                style={styles.secondaryButton}
                activeOpacity={0.9}
              >
                <Text style={styles.secondaryButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onConfirm}
                style={styles.dangerButton}
                activeOpacity={0.9}
              >
                <Text style={styles.dangerButtonText}>
                  Supprimer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "left",
    marginBottom: 8,
    lineHeight: 20,
  },
  bulletList: {
    marginBottom: 12,
  },
  bulletItem: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: "#B91C1C",
    marginTop: 4,
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  dangerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
  },
});
