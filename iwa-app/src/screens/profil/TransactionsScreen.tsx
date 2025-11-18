// src/screens/profil/TransactionsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import type { Transaction } from "../../shared/types";
import { demoTransactions } from "../../mocks/products";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Screen } from "../../components/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Transactions">;

export function TransactionsScreen({ navigation, route }: Props) {
  const [transactions, setTransactions] =
    useState<Transaction[]>(demoTransactions);

  useFocusEffect(
    useCallback(() => {
      // On se resynchronise avec les mocks mis à jour
      setTransactions([...demoTransactions]);
    }, [])
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTransactionClick = (transaction: Transaction) => {
    navigation.navigate("ProductDetail", {
      productId: String(transaction.product.id),
    });
  };

  const handleReviewClick = (transaction: Transaction) => {
    if (transaction.reviewed) return;
    navigation.navigate("SellerReview", { transactionId: transaction.id });
  };

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
          <Text style={styles.headerTitle}>Mes transactions</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </View>

      {/* Transactions list */}
      <View style={styles.content}>
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune transaction</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {transactions.map((transaction) => {
              const firstImage = transaction.product.images?.[0];

              const isInProgress = transaction.status === "in_progress";
              const isCompleted = transaction.status === "completed";

              return (
                <View key={transaction.id} style={styles.card}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleTransactionClick(transaction)}
                    style={styles.cardPressable}
                  >
                    {firstImage ? (
                      <Image
                        source={{ uri: firstImage }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[styles.productImage, styles.imagePlaceholder]}
                      >
                        <Text style={styles.imagePlaceholderText}>Image</Text>
                      </View>
                    )}

                    <View style={styles.cardTextBlock}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {transaction.product.name}
                      </Text>
                      <Text style={styles.dateText}>{transaction.date}</Text>
                      <Text style={styles.priceText}>{transaction.price}</Text>

                      <View
                        style={[
                          styles.statusBadge,
                          isInProgress
                            ? styles.statusBadgeInProgress
                            : styles.statusBadgeCompleted,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            isInProgress
                              ? styles.statusTextInProgress
                              : styles.statusTextCompleted,
                          ]}
                        >
                          {isInProgress
                            ? "En cours de livraison"
                            : "Clôturée"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {isCompleted && (
                    <View style={styles.reviewButtonContainer}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={transaction.reviewed}
                        onPress={() => handleReviewClick(transaction)}
                        style={[
                          styles.reviewButton,
                          transaction.reviewed && styles.reviewButtonDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.reviewButtonText,
                            transaction.reviewed &&
                              styles.reviewButtonTextDisabled,
                          ]}
                        >
                          {transaction.reviewed
                            ? "Client déjà évalué"
                            : "Évaluer le vendeur"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  contentContainer: { paddingBottom: 32 },

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
  headerTitle: { fontSize: 16, color: "#111827" },
  headerRightPlaceholder: { width: 40 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  emptyState: { alignItems: "center", paddingVertical: 48 },
  emptyText: { fontSize: 14, color: "#6B7280" },
  list: { rowGap: 16 },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  cardPressable: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#F3F4F6",
  },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  imagePlaceholderText: { fontSize: 12, color: "#9CA3AF" },
  cardTextBlock: { flex: 1 },
  productName: { fontSize: 14, color: "#111827", marginBottom: 4 },
  dateText: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  priceText: { fontSize: 14, color: "#111827", marginBottom: 8 },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeInProgress: { backgroundColor: "#FEF3C7" },
  statusBadgeCompleted: { backgroundColor: "#D1FAE5" },
  statusText: { fontSize: 12 },
  statusTextInProgress: { color: "#92400E" },
  statusTextCompleted: { color: "#065F46" },
  reviewButtonContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  reviewButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#7BCCEB",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewButtonDisabled: { backgroundColor: "#D1D5DB" },
  reviewButtonText: { fontSize: 14, color: "#FFFFFF" },
  reviewButtonTextDisabled: { color: "#6B7280" },
});
