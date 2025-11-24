// src/screens/sell/AddProductModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,  
  Image, 
} from "react-native";
import { X, Image as ImageIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { Category } from "../../shared/types";
import * as ImagePicker from "expo-image-picker";

export interface NewListing {
  title: string;
  description: string;
  price: number;
  quantity: string;
  category: Category | "";
  images?: string[];
}

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: NewListing) => void;
}

const categoryOptions: { value: Category; labelKey: string }[] = [
  { value: "Légumes", labelKey: "search_cat_vegetables" },
  { value: "Fruits", labelKey: "search_cat_fruits" },
  { value: "Herbes aromatiques / épices", labelKey: "search_cat_herbs" },
  { value: "Plantes médicinales", labelKey: "search_cat_medicinal" },
  { value: "Fleurs décoratives", labelKey: "search_cat_flowers" },
  { value: "Plantes exotiques / rares", labelKey: "search_cat_exotic" },
];

export function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [images, setImages] = useState<string[]>([]); 

  const parsePrice = (value: string): number | null => {
    const cleaned = value.replace("€", "").trim().replace(",", ".");
    const num = Number(cleaned);
    if (Number.isNaN(num) || num < 0) return null;
    return num;
  };

    const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "L'accès à la galerie est nécessaire.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...uris]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "L'accès à la caméra est nécessaire.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...uris]);
    }
  };

  const handleAddPhoto = () => {
    Alert.alert(
      t("sell_photos"),
      "",
      [
        { text: "Galerie", onPress: pickFromLibrary },
        { text: "Appareil photo", onPress: takePhoto },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };


  const handleSubmit = () => {
    const parsedPrice = parsePrice(priceInput);

    if (!title || !parsedPrice || !category) {
      // TODO: show error / toast
      return;
    }

    onAdd({
      title,
      description,
      price: parsedPrice,
      quantity,
      category,
      images,
    });

    setShowSuccess(true);
  };


  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t("sell_title")}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <X size={20} strokeWidth={2} color="#1F2933" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            keyboardShouldPersistTaps="handled"
          >
            {/* Photo upload (placeholder) */}
            {/* Photo upload */}
            <View style={styles.block}>
              <Text style={styles.label}>{t("sell_photos")}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((uri) => (
                  <View key={uri} style={styles.photoPreviewWrapper}>
                    <Image source={{ uri }} style={styles.photoPreview} />
                  </View>
                ))}

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                >
                  <ImageIcon size={24} strokeWidth={1.8} color="#9CA3AF" />
                  <Text style={styles.addPhotoText}>{t("sell_add")}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Title */}
            <View style={styles.block}>
              <Text style={styles.label}>{t("sell_title_label")}</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={t("sell_title_placeholder")}
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description */}
            <View style={styles.block}>
              <Text style={styles.label}>{t("sell_description")}</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t("sell_description_placeholder")}
                style={[styles.input, styles.textArea]}
                placeholderTextColor="#9CA3AF"
                multiline
              />
            </View>

            {/* Category */}
            <View style={styles.block}>
              <Text style={styles.label}>{t("sell_category")}</Text>

              <View style={styles.categoryList}>
                {categoryOptions.map((cat) => {
                  const isSelected = category === cat.value;
                  return (
                    <TouchableOpacity
                      key={cat.value}
                      style={[
                        styles.categoryPill,
                        isSelected && styles.categoryPillSelected,
                      ]}
                      onPress={() => setCategory(cat.value)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryPillText,
                          isSelected && styles.categoryPillTextSelected,
                        ]}
                      >
                        {t(cat.labelKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Quantity */}
            <View style={styles.block}>
              <Text style={styles.label}>{t("sell_quantity")}</Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                placeholder={t("sell_quantity_placeholder")}
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Price */}
            <View style={styles.block}>
              <Text style={styles.label}>{t("sell_price")}</Text>
              <TextInput
                value={priceInput}
                onChangeText={setPriceInput}
                placeholder={t("sell_price_placeholder")}
                style={styles.input}
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>
          </ScrollView>

          {/* Add button */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>{t("sell_submit")}</Text>
            </TouchableOpacity>
          </View>
        </View>

      <AddProductSuccessModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose(); // ferme le modal de vente et laisse le parent gérer la navigation vers l’onglet précédent
        }}
      />
        
      </View>
    </Modal>
  );
}

interface AddProductSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

function AddProductSuccessModal({
  visible,
  onClose,
}: AddProductSuccessModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.successBackdrop}>
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>
            {t("sell_success_title")}
          </Text>
          <Text style={styles.successMessage}>
            {t("sell_success_message")}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            style={styles.successButton}
          >
            <Text style={styles.successButtonText}>
              {t("common_continue")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    flex: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {},
  contentInner: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  block: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 6,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F3F4F6",
    fontSize: 14,
    color: "#111827",
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  addPhotoButton: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  addPhotoText: {
    marginTop: 4,
    fontSize: 11,
    color: "#9CA3AF",
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
  },
  categoryPillSelected: {
    backgroundColor: "#7BCCEB",
  },
  categoryPillText: {
    fontSize: 11,
    color: "#374151",
  },
  categoryPillTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  submitButton: {
    backgroundColor: "#7BCCEB",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

    successBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  successCard: {
    width: "80%",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
  },
  successButton: {
    marginTop: 8,
    backgroundColor: "#7BCCEB",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
  },
  successButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
    photoPreviewWrapper: {
    width: 96,
    height: 96,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#E5E7EB",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
  },


});
