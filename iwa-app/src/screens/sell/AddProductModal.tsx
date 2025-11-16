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
} from "react-native";
import { X, Image as ImageIcon } from "lucide-react-native";
import type { Category } from "../../shared/types";

export interface NewListing {
  title: string;
  description: string;
  price: number;
  quantity: string;
  category: Category | "";
}

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: NewListing) => void;
}

export function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  const parsePrice = (value: string): number | null => {
    const cleaned = value.replace("€", "").trim().replace(",", ".");
    const num = Number(cleaned);
    if (Number.isNaN(num) || num < 0) return null;
    return num;
  };

  const handleSubmit = () => {
    const parsedPrice = parsePrice(priceInput);

    if (!title || !parsedPrice || !category) {
      // You can plug a toast or error message here
      return;
    }

    onAdd({
      title,
      description,
      price: parsedPrice,
      quantity,
      category,
    });

    onClose();
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
            <Text style={styles.headerTitle}>Vendre des graines</Text>
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
            <View style={styles.block}>
              <Text style={styles.label}>Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.addPhotoButton}
                >
                  <ImageIcon size={24} strokeWidth={1.8} color="#9CA3AF" />
                  <Text style={styles.addPhotoText}>Ajouter</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Title */}
            <View style={styles.block}>
              <Text style={styles.label}>Titre</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex : Graines de tomates anciennes"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description */}
            <View style={styles.block}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Décrivez vos graines (variété, conseils de culture, origine...)"
                style={[styles.input, styles.textArea]}
                placeholderTextColor="#9CA3AF"
                multiline
              />
            </View>

            {/* Category */}
            <View style={styles.block}>
              <Text style={styles.label}>Catégorie</Text>

              {/* Simple fake select, tu pourras le remplacer par un vrai picker plus tard */}
              <View style={styles.categoryList}>
                {([
                  "Légumes",
                  "Fruits",
                  "Herbes aromatiques / épices",
                  "Plantes médicinales",
                  "Fleurs décoratives",
                  "Plantes exotiques / rares",
                ] as Category[]).map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryPill,
                        isSelected && styles.categoryPillSelected,
                      ]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryPillText,
                          isSelected && styles.categoryPillTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Quantity */}
            <View style={styles.block}>
              <Text style={styles.label}>Poids ou quantité</Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Ex : 50 g ou 30 graines"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Price */}
            <View style={styles.block}>
              <Text style={styles.label}>Prix</Text>
              <TextInput
                value={priceInput}
                onChangeText={setPriceInput}
                placeholder="Ex : 5,00 €"
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
              <Text style={styles.submitText}>Ajouter l’annonce</Text>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
  },
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
});
