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
  TextInput,         
} from "react-native";
import {
  ArrowLeft,
  ChevronRight,
  Star,
  MoreVertical,
  X,
  Image as ImageIcon,
  Heart,
} from "lucide-react-native";
import type { Product, User, Category } from "../../shared/types"; 
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import { demoProducts } from "../../mocks/products";

import PurchaseConfirmationModal from "./PurchaseConfirmationModal";
import ReportModal from "./ReportModal";
import { Screen } from "../../components/Screen";
import { useTranslation } from "react-i18next";
import RepostRequestModal from "./RepostRequestModal";
import RepostRequestSuccessModal from "./RepostRequestSuccessModal";
import * as ImagePicker from "expo-image-picker";


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

  const [showRepostModal, setShowRepostModal] = useState(false);
  const [showRepostSuccessModal, setShowRepostSuccessModal] = useState(false);
  const [hasSentRepostRequest, setHasSentRepostRequest] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);


  // Fullscreen gallery state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryScrollRef = useRef<ScrollView | null>(null);

  const { t } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);



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
  const isDisabled = product.removedByAI || product.sold;

  const onBuy = () => {
    if (isDisabled) {
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

    const timeAgoLabel = useMemo(() => {
    if (!product?.createdAt) return null;

    const createdDate = new Date(product.createdAt);
    if (Number.isNaN(createdDate.getTime())) return null;

    const now = new Date();
    let diffMs = now.getTime() - createdDate.getTime();

    // In case createdAt is in the future, avoid negative values
    if (diffMs < 0) diffMs = 0;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    const minutes = Math.floor(diffMs / minute);
    if (minutes < 60) {
      return t("ad_time_minutes", { count: minutes });
    }

    const hours = Math.floor(diffMs / hour);
    if (hours < 24) {
      return t("ad_time_hours", { count: hours });
    }

    const days = Math.floor(diffMs / day);
    if (days < 7) {
      return t("ad_time_days", { count: days });
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return t("ad_time_weeks", { count: weeks });
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return t("ad_time_months", { count: months });
    }

    const years = Math.floor(days / 365) || 1;
    return t("ad_time_years", { count: years });
  }, [product?.createdAt, t]);


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

        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => setShowActions(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreVertical size={18} color="#111827" />
        </TouchableOpacity>
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
              {(product.removedByAI || product.sold) && (
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
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bouton favoris sous les photos */}
        <View style={styles.favoriteWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.favoriteButton}
            onPress={() => setIsFavorite((prev) => !prev)}
          >
            <Heart
              size={18}
              color={isFavorite ? "#DC2626" : "#6B7280"}
              fill={isFavorite ? "#DC2626" : "transparent"}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.favoriteText}>
              {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            </Text>
          </TouchableOpacity>
        </View>

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
        {product.removedByAI && (
          <TouchableOpacity
            onPress={() => {
              if (hasSentRepostRequest) return;
              setShowRepostModal(true);
            }}
            disabled={hasSentRepostRequest}
            style={[
              styles.repostBtn,
              hasSentRepostRequest && styles.repostBtnDisabled,
            ]}
            activeOpacity={hasSentRepostRequest ? 1 : 0.9}
          >
            <Text
              style={[
                styles.repostBtnText,
                hasSentRepostRequest && styles.repostBtnTextDisabled,
              ]}
            >
              {hasSentRepostRequest
                ? t("repost_request_already_sent")
                : t("repost_request_cta")}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.body}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.quantity}>{product.quantity}</Text>
          <Text style={styles.price}>{product.price}</Text>

          {timeAgoLabel && (
            <Text style={styles.timeAgo}>{timeAgoLabel}</Text>
          )}

          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>{t("ad_description")}</Text>
            <Text style={styles.description}>
              {product.description}
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <Row label={t("ad_quantity")} value={product.quantity} />
            <Row label={t("ad_category")} value={product.category} />
            <Row label={t("ad_planting_period")} value={planting} />
            <Row label={t("ad_fruiting_period")} value={flowering} />
            <Row
              label={t("ad_edible")}
              value={product.edible ? t("filter_yes") : t("filter_no")}
            />
            <Row
              label={t("ad_harvest_in")}
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

          <TouchableOpacity
            onPress={isDisabled ? undefined : onBuy}
            disabled={isDisabled}
            style={[
              styles.buyBtn,
              isDisabled && styles.buyBtnDisabled,
            ]}
            activeOpacity={isDisabled ? 1 : 0.9}
          >
            <Text
              style={[
                styles.buyText,
                isDisabled && styles.buyTextDisabled,
              ]}
            >
              {t("ad_buy")}
            </Text>
          </TouchableOpacity>

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

            {/* Menu d'actions ... */}
      <Modal
        visible={showActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActions(false)}
      >
        <TouchableOpacity
          style={styles.actionsBackdrop}
          activeOpacity={1}
          onPress={() => setShowActions(false)}
        >
          <View style={styles.actionsCard}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                setShowActions(false);
                setShowEditModal(true); // 👈 on ouvre le modal d’édition
              }}
            >
              <Text style={styles.actionTextPrimary}>
                {t("common_edit")}
              </Text>
            </TouchableOpacity>

            {!product.removedByAI && (
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => {
                  setShowActions(false);
                  setShowReportModal(true);
                }}
              >
                <Text style={styles.actionTextDanger}>
                  {t("report_this_ad")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

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
      <RepostRequestModal
        visible={showRepostModal}
        onClose={() => setShowRepostModal(false)}
        onSubmit={(message) => {
          // Plus tard: appel API pour envoyer la requête
          console.log("Repost request justification:", message);
          setShowRepostModal(false);
          setHasSentRepostRequest(true);
          setShowRepostSuccessModal(true); 
        }}
      />

      <RepostRequestSuccessModal
        visible={showRepostSuccessModal}
        onClose={() => setShowRepostSuccessModal(false)}
      />

      {showEditModal && (
        <EditProductModal
          product={product}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => {
            // Plus tard : appel API + mise à jour locale du produit
            console.log("Updated product payload:", updated);
            setShowEditModal(false);
          }}
        />
      )}


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

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (updated: Partial<Product>) => void;
}

const categoryOptions: { value: Category; labelKey: string }[] = [
  { value: "Légumes", labelKey: "search_cat_vegetables" },
  { value: "Fruits", labelKey: "search_cat_fruits" },
  { value: "Herbes aromatiques / épices", labelKey: "search_cat_herbs" },
  { value: "Plantes médicinales", labelKey: "search_cat_medicinal" },
  { value: "Fleurs décoratives", labelKey: "search_cat_flowers" },
  { value: "Plantes exotiques / rares", labelKey: "search_cat_exotic" },
];

function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const { t } = useTranslation();

  const [title, setTitle] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [priceInput, setPriceInput] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [category, setCategory] = useState<Category | string>(
    product.category || ""
  );
  const [images, setImages] = useState<string[]>(product.images ?? []); 

  const parsePrice = (value: string): string | null => {
    const cleaned = value.replace("€", "").trim();
    if (!cleaned) return null;
    return cleaned.endsWith("€") ? cleaned : `${cleaned} €`;
  };

  const handleSubmit = () => {
    const parsedPrice = parsePrice(priceInput);

    if (!title || !parsedPrice || !category) {
      // TODO: show error / toast
      return;
    }

    onSave({
      name: title,
      description,
      price: parsedPrice,
      quantity,
      category: category as Category,
      images,
    });

    onClose();
  };


    const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("edit_profile_change_photo_permission_title"),
        t("edit_profile_change_photo_permission_message")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev: string[]) => [...prev, ...uris]);

    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("edit_profile_change_photo_permission_title"),
        t("edit_profile_change_photo_permission_message")
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev: string[]) => [...prev, ...uris]);

    }
  };

  const handleAddPhoto = () => {
    // Sur web : l’Alert avec boutons ne marche pas bien, on ouvre direct la galerie
    if (Platform.OS === "web") {
      pickFromLibrary();
      return;
    }

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

  const handleRemovePhoto = (uriToRemove: string) => {
    setImages((prev: string[]) => prev.filter((uri) => uri !== uriToRemove));
  };


  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.editBackdrop}>
        <View style={styles.editSheet}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.editCloseButton}
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
            <Text style={styles.headerTitle}>
              {t("edit_listing_title")} {/* ex: "Modifier l'annonce" */}
            </Text>

            {/* Photos */}
            <View style={styles.block}>
              <Text style={styles.label}>{t("sell_photos")}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((uri) => (
                  <View key={uri} style={styles.photoItem}>
                    <Image source={{ uri }} style={styles.photoImage} />
                    <TouchableOpacity
                      style={styles.photoRemoveButton}
                      onPress={() => handleRemovePhoto(uri)}
                      activeOpacity={0.8}
                    >
                      <X size={14} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
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

          {/* Save button */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>
                {t("edit_listing_submit")} {/* ex: "Enregistrer les modifications" */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
    marginTop: 28,
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
  buyText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

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

  // ✅ nouvelle bannière statut image
  statusBanner: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 15,
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
    fontSize: 14,
    fontWeight: "600",
  },
  buyBtnDisabled: {
    backgroundColor: "#D1D5DB", // gris clair
  },
  buyTextDisabled: {
    color: "#9CA3AF", // texte gris
  },
    moreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  repostBtn: {
    marginTop: 12,
    marginHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bb0000ff",
    backgroundColor: "#fedbdbff",
    alignItems: "center",
    justifyContent: "center",
  },
  repostBtnDisabled: {
    backgroundColor: "#E5E7EB",
    borderColor: "#D1D5DB",
  },
  repostBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#bb0000ff",
  },
  repostBtnTextDisabled: {
    color: "#9CA3AF",
  },
    timeAgo: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
  },

  actionsBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: HEADER_TOP + 48,
    paddingRight: 16,
  },
  actionsCard: {
    width: 180,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  actionRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  actionTextPrimary: {
    fontSize: 14,
    color: "#111827",
  },
  actionTextDanger: {
    fontSize: 14,
    color: "#B91C1C",
    fontWeight: "500",
  },

editBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  editSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    flex: 1,
    overflow: "hidden",
  },

  // ces styles sont déjà utilisés dans AddProductModal, mais si tu ne les as
  // pas encore dans ce fichier, il faut les copier ici :
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
  
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 20,
    marginBottom: 10,
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
    editCloseButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
    photoItem: {
    width: 96,
    height: 96,
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoRemoveButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
    favoriteWrapper: {
    marginTop: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
  },
  favoriteText: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
  },


});
