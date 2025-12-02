// src/screens/product/ReportModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { X, Flag } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { createReport } from "../../api/reportingApi";

// TODO: à remplacer par l'ID du client connecté (Keycloak)
const MOCK_CLIENT_ID = "REPLACE_WITH_CONNECTED_CLIENT_ID";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  productName?: string;
  postId: string;
}

export default function ReportModal({
  visible,
  onClose,
  productName,
  postId,
}: ReportModalProps) {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (sending) return;

    try {
      setSending(true);

      await createReport(postId, {
        description:
          productName ??
          "Reported from mobile app", // description minimale obligatoire côté backend
        clientId: MOCK_CLIENT_ID,
        postId,
      });

      onClose();
    } catch (e) {
      console.error("Failed to send report", e);
      Alert.alert(
        t("error_title") ?? "Erreur",
        t("error_generic") ?? "Une erreur est survenue lors de l’envoi du signalement.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (sending) return;
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
              disabled={sending}
            >
              <X size={18} color="#374151" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{t("report_this_ad")}</Text>

          <Text style={styles.subtitle}>{t("report_warning")}</Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleClose}
              activeOpacity={0.8}
              disabled={sending}
            >
              <Text style={styles.cancelText}>{t("report_cancel")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                sending && { opacity: 0.6 },
              ]}
              onPress={handleSend}
              activeOpacity={0.8}
              disabled={sending}
            >
              <Text style={styles.confirmText}>
                {t("report_send")}
              </Text>
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
  confirmText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
