//iwa-app/src/screens/product/PurchaseConfirmationModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { X, Star } from "lucide-react-native";
import type { Product } from "../../shared/types";
import { useTranslation } from "react-i18next";

interface PurchaseConfirmationModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (total: number) => void;
}

export default function PurchaseConfirmationModal({
  product,
  onClose,
  onConfirm,
}: PurchaseConfirmationModalProps) {
  const { t } = useTranslation();
  if (!product) {
    return null;
  }

  // --- Image principale : supporte string (URL) ou require() ---
  const rawImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : undefined;

  const mainImageSource =
    typeof rawImage === "string"
      ? { uri: rawImage }
      : rawImage
      ? rawImage
      : null;

  // --- Parsing prix robuste ---
  const rawPrice =
    typeof product.price === "string"
      ? product.price
      : String(product.price ?? "0");
  const numericPrice = parseFloat(
    rawPrice
      .replace(/\s/g, "") // retire espaces
      .replace("€", "")
      .replace(",", ".")
  );
  const priceValue = isNaN(numericPrice) ? 0 : numericPrice;
  const commission = priceValue * 0.1;
  const total = priceValue + commission;

  const formatPrice = (value: number) => {
    return value.toFixed(2).replace(".", ",") + " €";
  };

  const renderStars = (rating: number | undefined) => {
    const r = Math.round(rating || 0);
    return (
      <View style={styles.starsRow}>
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < r;
          return (
            <Star
              key={index}
              size={12}
              color={filled ? "#FBBF24" : "#D1D5DB"}
              fill={filled ? "#FBBF24" : "transparent"}
              style={{ marginRight: 2 }}
            />
          );
        })}
      </View>
    );
  };

  const seller = product.seller || ({} as Product["seller"]);

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t("purchase_confirmation")}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <X size={18} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Product info */}
            <View style={styles.block}>
              <Text style={styles.blockTitle}>{t("purchase_item")}</Text>
              <View style={styles.productRow}>
                {mainImageSource ? (
                  <Image source={mainImageSource} style={styles.productImage} />
                ) : (
                  <View style={[styles.productImage, styles.imageFallback]}>
                    <Text style={styles.imageFallbackText}>Image</Text>
                  </View>
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name ?? "—"}</Text>
                  {!!product.quantity && (
                    <Text style={styles.productQuantity}>
                      {product.quantity}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Seller info */}
            <View style={styles.block}>
              <Text style={styles.blockTitle}>{t("review_seller")}</Text>
              <View style={styles.sellerRow}>
                {seller?.avatar ? (
                  <Image
                    source={{ uri: seller.avatar }}
                    style={styles.sellerAvatar}
                  />
                ) : (
                  <View style={[styles.sellerAvatar, styles.avatarFallback]}>
                    <Text style={styles.avatarFallbackText}>
                      {seller?.username?.[0]?.toUpperCase() ?? "?"}
                    </Text>
                  </View>
                )}
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>
                    {seller?.username ?? "—"}
                  </Text>
                  <View style={styles.sellerRatingRow}>
                    {renderStars(seller?.rating)}
                    {!!seller?.reviewCount && (
                      <Text style={styles.sellerReviewCount}>
                        ({seller.reviewCount})
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Price breakdown */}
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>{t("purchase_price")}</Text>
                <Text style={styles.priceValue}>{formatPrice(priceValue)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>{t("purchase_commission")}</Text>
                <Text style={styles.priceValue}>
                  {formatPrice(commission)}
                </Text>
              </View>
              <View style={styles.priceTotalRow}>
                <Text style={styles.priceTotalLabel}>{t("purchase_total")}</Text>
                <Text style={styles.priceTotalValue}>
                  {formatPrice(total)}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Confirm button */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => onConfirm(total)}
              activeOpacity={0.9}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>{t("purchase_validate")}</Text>
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
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  block: {
    marginBottom: 16,
  },
  blockTitle: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  imageFallback: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  imageFallbackText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: "#6B7280",
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarFallback: {
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    color: "#4B5563",
    fontWeight: "600",
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 2,
  },
  sellerRatingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerReviewCount: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  priceCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 13,
    color: "#111827",
  },
  priceTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceTotalLabel: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
  priceTotalValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  confirmButton: {
    backgroundColor: "#7BCCEB",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
