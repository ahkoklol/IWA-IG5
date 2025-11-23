// iwa-app/src/screens/product/RepostRequestModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { HelpCircle } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface RepostRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

const MAX_LENGTH = 250;

export default function RepostRequestModal({
  visible,
  onClose,
  onSubmit,
}: RepostRequestModalProps) {
  const { t } = useTranslation();
  const [justification, setJustification] = useState("");

  const handleSubmit = () => {
    if (!justification.trim()) {
      return;
    }
    onSubmit(justification.trim());
    setJustification("");
    Keyboard.dismiss();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* Clic en dehors de la carte => ferme juste le clavier */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>

        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconWrapper}>
              <HelpCircle size={36} color="#2563EB" />
            </View>

            <Text style={styles.title}>{t("repost_request_title")}</Text>

            <Text style={styles.subtitle}>
              {t("repost_request_explanation")}
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder={t("repost_request_placeholder")}
              placeholderTextColor="#9CA3AF"
              value={justification}
              onChangeText={(text) =>
                text.length <= MAX_LENGTH && setJustification(text)
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              returnKeyType="done"
            />

            <Text style={styles.counterText}>
              {justification.length}/{MAX_LENGTH}
            </Text>

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  onClose();
                }}
                style={styles.secondaryButton}
                activeOpacity={0.9}
              >
                <Text style={styles.secondaryButtonText}>
                  {t("common_cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  styles.primaryButton,
                  !justification.trim() && styles.primaryButtonDisabled,
                ]}
                disabled={!justification.trim()}
                activeOpacity={0.9}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    !justification.trim() && styles.primaryButtonTextDisabled,
                  ]}
                >
                  {t("repost_request_submit")}
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
    backgroundColor: "#DBEAFE",
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
    marginBottom: 12,
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    minHeight: 90,
  },
  counterText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 4,
    marginBottom: 16,
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
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#BFDBFE",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
  },
  primaryButtonTextDisabled: {
    color: "#E5E7EB",
  },
});
