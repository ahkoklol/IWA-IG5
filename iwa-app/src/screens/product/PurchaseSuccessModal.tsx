//iwa-app/src/screens/product/PurchaseSuccessModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Check } from "lucide-react-native";

interface PurchaseSuccessModalProps {
  onClose: () => void;
}

export default function PurchaseSuccessModal({ onClose }: PurchaseSuccessModalProps) {
  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Check icon */}
            <View style={styles.iconWrapper}>
              <Check size={40} color="#059669" />
            </View>

            <Text style={styles.title}>Achat validé !</Text>

            <Text style={styles.subtitle}>
              Votre commande a été confirmée avec succès. Vous recevrez bientôt
              une notification avec les détails de livraison.
            </Text>

            <TouchableOpacity
              onPress={onClose}
              style={styles.button}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>
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
    maxWidth: 360,
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 36,
    alignItems: "center",
    textAlign: "center",
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#7BCCEB",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
