// iwa-app/src/screens/product/ProductDetail.tsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { ArrowLeft, ChevronRight, Star } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { Product, User } from "../../shared/types";
import { demoProducts } from "../../mocks/products";

import PurchaseConfirmationModal from "./PurchaseConfirmationModal";
import ReportModal from "./ReportModal";
import { Screen } from "../../components/Screen";


type DetailRoute = RouteProp<RootStackParamList, "ProductDetail">;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const DOT_SIZE = 6;
const { width } = Dimensions.get("window");
const HEADER_TOP =
  Platform.OS === "android"
    ? (StatusBar.currentHeight || 0) + 16
    : 24;

function renderStars(rating: number) {
  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          color={i < rating ? "#F59E0B" : "#D1D5DB"}
          fill={i < rating ? "#F59E0B" : "transparent"}
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
}

export default function ProductDetail() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<DetailRoute>();

  const productId = route.params?.productId;

  const product = useMemo<Product | undefined>(
    () => demoProducts.find((p) => String(p.id) === String(productId)),
    [productId]
  );

  const [current, setCurrent] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Fullscreen gallery state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryScrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (isGalleryOpen && galleryScrollRef.current) {
      galleryScrollRef.current.scrollTo({
        x: initialIndex * width,
        animated: false,
      });
      setGalleryIndex(initialIndex);
    }
  }, [isGalleryOpen, initialIndex]);

  if (!product) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.notFound}>Produit introuvable</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn2}
        >
          <ArrowLeft size={20} color="#111827" />
          <Text style={{ marginLeft: 6, color: "#111827" }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = product.images?.length ? product.images : [undefined];

  const onBuy = () => {
    if (product.removedByAI) {
      Alert.alert("Indisponible", "Cette annonce a été supprimée.");
      return;
    }
    setShowPurchaseModal(true);
  };

  const planting = Array.isArray(product.plantingPeriod)
    ? product.plantingPeriod.join(" - ")
    : product.plantingPeriod ?? "—";

  const flowering = Array.isArray(product.floweringPeriod)
    ? product.floweringPeriod.join(" - ")
    : product.floweringPeriod ?? "—";

  const sellerUser = product.seller as User;

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>
        {!product.removedByAI && (
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => setShowReportModal(true)}
          >
            <Text style={styles.reportText}>Signaler</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const page = Math.round(
              e.nativeEvent.contentOffset.x / width
            );
            setCurrent(page);
          }}
          scrollEventThrottle={16}
          style={{ width, height: width }}
        >
          {images.map((uri, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.9}
              onPress={() => {
                setInitialIndex(idx);
                setIsGalleryOpen(true);
              }}
              style={{
                width,
                height: width,
                backgroundColor: "#F3F4F6",
              }}
            >
              {uri ? (
                <Image
                  source={{ uri }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <View style={styles.fallback}>
                  <Text style={{ color: "#9CA3AF" }}>Image</Text>
                </View>
              )}
              {product.removedByAI && (
                <View>
                  <Text>Annonce supprimée</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dots}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: current === i ? 1 : 0.4,
                  width: current === i ? DOT_SIZE * 2 : DOT_SIZE,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.quantity}>{product.quantity}</Text>
          <Text style={styles.price}>{product.price}</Text>

          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {product.description}
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <Row label="Nombre de pièces" value={product.quantity} />
            <Row label="Catégorie" value={product.category} />
            <Row label="Période de plantation" value={planting} />
            <Row label="Période de fructification" value={flowering} />
            <Row
              label="Comestible"
              value={product.edible ? "Oui" : "Non"}
            />
            <Row
              label="Récolte en"
              value={product.harvestDate ?? "—"}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("MyProfileScreen", {
                user: sellerUser,
                initialTab: "profile",
              });
            }}
            style={styles.seller}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Image
                source={{ uri: product.seller.avatar }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  marginRight: 12,
                }}
              />
              <View>
                <Text style={styles.sellerName}>
                  {product.seller.username}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  {renderStars(
                    Math.round(product.seller.rating || 0)
                  )}
                  <Text style={styles.sellerCount}>
                    {" "}
                    ({product.seller.reviewCount})
                  </Text>
                </View>
              </View>
            </View>
            <ChevronRight size={18} color="#6B7280" />
          </TouchableOpacity>

          {!product.removedByAI && (
            <TouchableOpacity
              onPress={onBuy}
              style={styles.buyBtn}
              activeOpacity={0.9}
            >
              <Text style={styles.buyText}>Acheter</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {showPurchaseModal && (
        <PurchaseConfirmationModal
          product={product}
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={(total) => {
            setShowPurchaseModal(false);
            navigation.navigate("Payment", {
              product,
              total,
            });
          }}
        />
      )}

      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        productName={product.name}
      />

            {/* Fullscreen gallery modal */}
      <Modal
        visible={isGalleryOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsGalleryOpen(false)}
      >
        <Screen>
          <View style={styles.galleryOverlay}>
            <ScrollView
              ref={galleryScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const page = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );
                setGalleryIndex(page);
              }}
              scrollEventThrottle={16}
            >
              {images.map((uri, idx) => (
                <View key={idx} style={styles.gallerySlide}>
                  {uri ? (
                    <Image
                      source={{ uri }}
                      style={styles.galleryImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.galleryFallback}>
                      <Text style={styles.galleryFallbackText}>
                        Image
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.galleryCloseBtn}
              onPress={() => setIsGalleryOpen(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.galleryCounter}>
              <Text style={styles.galleryCounterText}>
                {galleryIndex + 1} / {images.length}
              </Text>
            </View>
          </View>
        </Screen>
      </Modal>


    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValueMuted}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  notFound: { color: "#111827", fontSize: 16, marginBottom: 12 },
  backBtn2: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  header: {
    position: "absolute",
    top: HEADER_TOP,
    left: 12,
    right: 12,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  reportBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
  },
  reportText: { color: "#111827", fontSize: 12 },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    height: DOT_SIZE,
    width: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#111827",
  },

  fallback: { flex: 1, alignItems: "center", justifyContent: "center" },

  body: { paddingHorizontal: 16, paddingTop: 16 },
  title: { color: "#111827", fontSize: 20, fontWeight: "700" },
  quantity: { color: "#6B7280", marginTop: 2 },
  price: { color: "#111827", fontSize: 18, fontWeight: "700", marginTop: 8 },

  sectionTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: { color: "#4B5563", lineHeight: 20 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  rowPress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  rowLabel: { color: "#111827", fontSize: 14 },
  rowValueMuted: { color: "#6B7280", fontSize: 14 },

  seller: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  sellerName: { color: "#111827", fontSize: 14 },
  sellerCount: { color: "#6B7280", fontSize: 12 },

  buyBtn: {
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: "#7BCCEB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buyText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },

  // Gallery styles
  galleryOverlay: {
    flex: 1,
    backgroundColor: "#000000",
  },
  gallerySlide: {
    width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryImage: {
    width: width,
    height: "80%",
  },
  galleryFallback: {
    width,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryFallbackText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
    galleryCloseBtn: {
    position: "absolute",
    top: 16, // était: top: HEADER_TOP
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  galleryCounter: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  galleryCounterText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },

});
