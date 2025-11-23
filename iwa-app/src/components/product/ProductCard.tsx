// iwa-app/src/components/product/ProductCard.tsx (chemin à adapter selon ton projet)

import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";
import type { Product } from "../../shared/types/index";
import { useTranslation } from "react-i18next";

type Props = {
  product: Product;
  onClick: () => void;
  onToggleFavorite: () => void;
};

export default function ProductCard({ product, onClick, onToggleFavorite }: Props) {
  const { t } = useTranslation();
  const cover = product.images?.[0];

  return (
    <Pressable style={styles.card} onPress={onClick}>
      <View style={styles.imageWrap}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.image} />
        ) : (
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>Image</Text>
          </View>
        )}

        {product.removedByAI || product.sold ? (
          <View
            style={[
              styles.statusBanner,
              product.removedByAI
                ? styles.statusBannerRemoved
                : styles.statusBannerSold,
            ]}
          >
            <Text style={styles.statusBannerText}>
              {product.removedByAI
                ? t("profile_ad_deleted")
                : t("profile_sold")}
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={(e) => {
              // @ts-ignore: stopPropagation existe sur RN SyntheticEvent
              e.stopPropagation?.();
              onToggleFavorite();
            }}
            style={styles.heartBtn}
          >
            <Heart
              size={16}
              color={product.isFavorite ? "#EF4444" : "#4B5563"}
              fill={product.isFavorite ? "#EF4444" : "transparent"}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.name}>
          {product.name}
        </Text>
        <Text numberOfLines={1} style={styles.quantity}>
          {product.quantity}
        </Text>
        <Text style={styles.price}>{product.price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  imageWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  image: { width: "100%", height: "100%" },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECECF0",
  },
  fallbackText: { color: "#9CA3AF" },

  // ✅ bannière status
  statusBanner: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 10,
    alignItems: "center",
  },
  statusBannerRemoved: {
    backgroundColor: "#EF4444",
  },
  statusBannerSold: {
    backgroundColor: "#10B981",
  },
  statusBannerText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  heartBtn: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  meta: { marginTop: 8 },
  name: { color: "#111827", fontSize: 14 },
  quantity: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  price: { color: "#111827", fontSize: 14, marginTop: 4, fontWeight: "600" },
});
