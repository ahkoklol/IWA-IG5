// src/screens/product/ReportModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { X, Flag } from "lucide-react-native";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  productName?: string;
}

export default function ReportModal({
  visible,
  onClose,
  productName,
}: ReportModalProps) {
  const [reason, setReason] = useState("");

  const handleSend = () => {
    // Later: call backend to send the report
    // For now we just close the modal
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Flag size={22} color="#B91C1C" />
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color="#374151" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Signaler cette annonce</Text>

          {productName ? (
            <Text style={styles.subtitle}>
              Vous êtes sur le point de signaler{" "}
              <Text style={styles.subtitleBold}>{productName}</Text>. Merci de
              nous indiquer ce qui ne va pas.
            </Text>
          ) : (
            <Text style={styles.subtitle}>
              Merci de nous indiquer ce qui ne va pas avec cette annonce.
            </Text>
          )}

          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Expliquez brièvement le problème (contenu inapproprié, arnaque, spam...)"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                !reason.trim() && styles.confirmBtnDisabled,
              ]}
              onPress={handleSend}
              activeOpacity={0.8}
              disabled={!reason.trim()}
            >
              <Text style={styles.confirmText}>Envoyer le signalement</Text>
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
    backgroundColor: "rgba(15,23,42,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  container: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  title: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B5563",
  },
  subtitleBold: {
    fontWeight: "600",
  },
  textArea: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
    minHeight: 100,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  cancelText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  confirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#B91C1C",
  },
  confirmBtnDisabled: {
    backgroundColor: "#FCA5A5",
  },
  confirmText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
