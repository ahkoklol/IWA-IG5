// src/screens/profil/SellerReviewScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { ArrowLeft, Star } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { demoTransactions } from "../../mocks/products";
import type { Transaction } from "../../shared/types";
import { Screen } from "../../components/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "SellerReview">;

export function SellerReviewScreen({ navigation, route }: Props) {
  const { transactionId } = route.params;

  const transaction: Transaction | undefined = demoTransactions.find(
    (t) => t.id === transactionId
  );

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  if (!transaction) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Transaction introuvable</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#7BCCEB", marginTop: 8 }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    // Plus tard : appel API pour enregistrer l'avis

    // Met à jour directement le statut "reviewed" dans les mocks
    const index = demoTransactions.findIndex((t) => t.id === transaction.id);
    if (index !== -1) {
      demoTransactions[index] = {
        ...demoTransactions[index],
        reviewed: true,
      };
    }

    // Puis on revient simplement aux transactions (animation retour)
    navigation.goBack();
  };



  const product = transaction.product;
  const firstImage = product.images?.[0];

  return (
    <Screen>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Évaluer le vendeur</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      {/* Récap produit / vendeur */}
      <View style={styles.card}>
        <View style={styles.productRow}>
          {firstImage ? (
            <Image
              source={{ uri: firstImage }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Text style={styles.imagePlaceholderText}>Image</Text>
            </View>
          )}

          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.productPrice}>{transaction.price}</Text>
            <Text style={styles.sellerName}>
              Vendeur : {product.seller.fullName}
            </Text>
            <Text style={styles.dateText}>{transaction.date}</Text>
          </View>
        </View>
      </View>

      {/* Note en étoiles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Note du vendeur</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((value) => {
            const isActive = value <= rating;
            return (
              <TouchableOpacity
                key={value}
                onPress={() => setRating(value)}
                activeOpacity={0.7}
                style={styles.starButton}
              >
                <Star
                  size={32}
                  color={isActive ? "#FBBF24" : "#D1D5DB"}
                  fill={isActive ? "#FBBF24" : "none"}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Commentaire */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Commentaire</Text>
        <TextInput
          multiline
          value={comment}
          onChangeText={setComment}
          placeholder="Décris ton expérience avec ce vendeur (optionnel)"
          style={styles.textArea}
          textAlignVertical="top"
        />
      </View>

      {/* Bouton valider */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSubmit}
          disabled={rating === 0}
          style={[
            styles.submitButton,
            rating === 0 && styles.submitButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.submitButtonText,
              rating === 0 && styles.submitButtonTextDisabled,
            ]}
          >
            Envoyer l’évaluation
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  contentContainer: { paddingBottom: 32 },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  headerWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    color: "#111827",
  },
  headerRightPlaceholder: {
    width: 40,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  productRow: { flexDirection: "row", alignItems: "center" },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    marginRight: 12,
  },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  imagePlaceholderText: { fontSize: 12, color: "#9CA3AF" },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, color: "#111827", marginBottom: 4 },
  productPrice: { fontSize: 14, color: "#111827", marginBottom: 2 },
  sellerName: { fontSize: 12, color: "#4B5563", marginBottom: 2 },
  dateText: { fontSize: 12, color: "#6B7280" },

  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  footer: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#7BCCEB",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  submitButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
  submitButtonTextDisabled: {
    color: "#6B7280",
  },
});
