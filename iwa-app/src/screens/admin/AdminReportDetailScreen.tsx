// src/screens/admin/AdminReportDetailScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { Report, Product } from "../../shared/types";
import { demoReports, demoProducts } from "../../mocks/products";
import { Screen } from "../../components/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "AdminReportDetail">;

export function AdminReportDetailScreen({ route, navigation }: Props) {
  const { reportId } = route.params;

  const report: Report | undefined = demoReports.find(
    (r) => r.id === reportId
  );
  if (!report) {
    return (
      <View style={styles.center}>
        <Text>Signalement introuvable.</Text>
      </View>
    );
  }

  const product: Product | undefined = demoProducts.find(
    (p) => p.id === report.productId
  );
  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Produit introuvable.</Text>
      </View>
    );
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images =
    (product.images && product.images.length > 0 ? product.images : []) as string[];

  const nextImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleApprove = (id: number) => {
    // Later: API call + status update
    console.log("approve report", id);
    navigation.goBack();
  };

  const handleReject = (id: number) => {
    // Later: API call + status update
    console.log("reject report", id);
    navigation.goBack();
  };

  return (

    <View style={styles.root}>
      
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={10}
          >
            <ArrowLeft size={24} color="#000000ff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détail de la requête</Text>
        </View>

                          <Text style={styles.justificationTitle}>
                            Justification de la demande du vendeur :
                          </Text>
                          <Text style={styles.justification}>
                            {report.description}
                          </Text>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => handleApprove(report.id)}
            style={styles.approveButton}
            activeOpacity={0.8}
          >
            <Text style={styles.approveText}>Republier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleReject(report.id)}
            style={styles.rejectButton}
            activeOpacity={0.8}
          >
            <Text style={styles.rejectText}>Rejeter</Text>
          </TouchableOpacity>
        </View>
      </View>
        {/* Report info banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerCount}>
            {report.reportCount} signalement
            {report.reportCount > 1 ? "s" : ""}
          </Text>
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product images */}
        <View style={styles.imageWrapper}>
          {images.length > 0 ? (
            <>
              <Image
                source={{ uri: images[currentImageIndex] }}
                style={styles.image}
                resizeMode="cover"
              />

              {images.length > 1 && (
                <>
                  <TouchableOpacity
                    style={[styles.arrowButton, styles.arrowLeft]}
                    onPress={prevImage}
                    activeOpacity={0.8}
                  >
                    <ChevronLeft size={20} color="#ffffff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.arrowButton, styles.arrowRight]}
                    onPress={nextImage}
                    activeOpacity={0.8}
                  >
                    <ChevronRight size={20} color="#ffffff" />
                  </TouchableOpacity>

                  <View style={styles.imageCounter}>
                    <Text style={styles.imageCounterText}>
                      {currentImageIndex + 1} / {images.length}
                    </Text>
                  </View>
                </>
              )}
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>
                Aucune image disponible
              </Text>
            </View>
          )}
        </View>

        {/* Product details */}
        <View style={styles.detailsContainer}>
          {/* Nom + prix */}
          <View style={styles.productHeaderRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
          </View>

          {/* Catégorie */}
          <View style={styles.categoryBox}>
            <Text style={styles.categoryLabel}>Catégorie</Text>
            <Text style={styles.categoryValue}>{product.category}</Text>
          </View>

          {/* Caractéristiques */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Caractéristiques</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Quantité</Text>
              <Text style={styles.metaValue}>{product.quantity}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Période de plantation</Text>
              <Text style={styles.metaValue}>{product.plantingPeriod}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Période de floraison</Text>
              <Text style={styles.metaValue}>{product.floweringPeriod}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Date de récolte</Text>
              <Text style={styles.metaValue}>{product.harvestDate}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Comestible</Text>
              <Text style={styles.metaValue}>{product.edible ? "Oui" : "Non"}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.sectionText}>{product.description}</Text>
          </View>

          {/* Vendeur */}
          {product.seller && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Vendeur</Text>

                <TouchableOpacity
                  style={styles.sellerCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    // On force le type `any` ici pour calmer TypeScript
                    (navigation as any).navigate("PublicProfile", {
                      userId: product.seller.id,
                    });
                  }}
                >
                <Image
                  source={{ uri: product.seller.avatar }}
                  style={styles.sellerAvatar}
                />

                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerUsername}>@{product.seller.username}</Text>
                  <Text style={styles.sellerFullName}>{product.seller.fullName}</Text>

                  <View style={styles.sellerRatingRow}>
                    <Star size={14} color="#f59e0b" />
                    <Text style={styles.sellerRatingText}>
                      {product.seller.rating.toFixed(1)} · {product.seller.reviewCount} avis
                    </Text>
                  </View>

                  <Text style={styles.sellerLocation}>{product.seller.location}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

      </ScrollView>
      </Screen>
    </View>
    
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: "#ffffffff",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: {
    color: "#000000ff",
    fontSize: 18,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#668b01",
  },
  approveText: {
    color: "#668b01",
    fontSize: 15,
    fontWeight: "600",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dc2626",
  },
  rejectText: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "600",
  },
  banner: {
    backgroundColor: "#fef2f2",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bannerCount: {
    color: "#b91c1c",
    fontSize: 14,
    marginBottom: 4,
  },
  bannerLabel: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  bannerDescription: {
    color: "#b91c1c",
    fontSize: 13,
  },
  imageWrapper: {
    backgroundColor: "#111827",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
  },
  imageCounter: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  imageCounterText: {
    color: "#ffffff",
    fontSize: 11,
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
  },
  productHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  productName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    marginRight: 8,
    color: "#111827",
  },
  productPrice: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
  categoryBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  categoryLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  categoryValue: {
    fontSize: 14,
    color: "#111827",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

    section: {
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sectionText: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  metaLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  metaValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 4,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  sellerFullName: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 2,
  },
  sellerRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  sellerRatingText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  sellerLocation: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  justificationTitle:{
    color: "#000000ff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 5,
  },
justification: {
  color: "#000000ff",
  fontSize: 15,
  fontWeight: "200",
  marginBottom: 15,
},
});
