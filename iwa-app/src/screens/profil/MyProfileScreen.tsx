// src/screens/profil/MyProfileScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import {
  ArrowLeft,
  Star,
  MapPin,
  Flag,
  Users,
  MoreHorizontal,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { Product, Review } from "../../shared/types";
import ProductCard from "../../components/product/ProductCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { demoProducts, reviewsByUser } from "../../mocks/products";
import { EditProfileModal } from "./EditProfileModal";
import { Screen } from "../../components/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "MyProfileScreen">;

export function MyProfileScreen({ route, navigation }: Props) {
  const { user, initialTab } = route.params;
  const { t } = useTranslation();

  const [currentUser, setCurrentUser] = useState(user);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const initialUserProducts = demoProducts.filter(
    (p) => p.seller.id === user.id
  );
  const [userProducts, setUserProducts] =
    useState<Product[]>(initialUserProducts);

  const [userReviews] = useState<Review[]>(reviewsByUser[user.id] ?? []);

  const [activeTab, setActiveTab] = useState<"profile" | "reviews">(
    initialTab ?? "profile"
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => {
      const filled = index < rating;
      return (
        <Star
          key={index}
          size={16}
          color={filled ? "#FACC15" : "#D1D5DB"}
          fill={filled ? "#FACC15" : "none"}
          style={styles.starIcon}
        />
      );
    });
  };

  const averageRating =
    userReviews.length > 0
      ? (
          userReviews.reduce((acc, review) => acc + review.rating, 0) /
          userReviews.length
        ).toFixed(1)
      : "0.0";

  const handleProductClick = (product: Product) => {
    navigation.navigate("ProductDetail", { productId: String(product.id) });
  };

  const handleToggleFavorite = (productId: number) => {
    setUserProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const handleUserClick = (userId: number) => {
    console.log("Review user clicked:", userId);
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  return (
    <Screen>
      {/* Header + Tabs */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBackButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#1F2933" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{currentUser.username}</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            onPress={() => setActiveTab("profile")}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "profile"
                  ? styles.tabTextActive
                  : styles.tabTextInactive,
              ]}
            >
              {t("profile_button_title")}
            </Text>
            {activeTab === "profile" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("reviews")}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "reviews"
                  ? styles.tabTextActive
                  : styles.tabTextInactive,
              ]}
            >
              {t("profile_my_reviews")}
            </Text>
            {activeTab === "reviews" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <View style={styles.contentPadding}>
            {/* User info */}
            <View style={styles.userInfoRow}>
              <View style={styles.userInfoLeft}>
                {currentUser.avatar ? (
                  <Image
                    source={{ uri: currentUser.avatar }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]} />
                )}
                <View style={styles.userMainInfos}>
                  <Text style={styles.usernameText}>
                    {currentUser.username}
                  </Text>
                  <View style={styles.ratingRow}>
                    {renderStars(currentUser.rating)}
                    <Text style={styles.ratingCountText}>
                      ({currentUser.reviewCount})
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleEditProfile}
                style={styles.moreButton}
                activeOpacity={0.7}
              >
                <MoreHorizontal size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* User details */}
            <View style={styles.detailsBlock}>
              <View style={styles.detailRow}>
                <Users size={16} color="#6B7280" />
                <Text style={styles.detailText}>{currentUser.fullName}</Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>{currentUser.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Flag size={16} color="#6B7280" />
                <Text style={styles.detailText}>{currentUser.nationality}</Text>
              </View>
            </View>

            {/* Bio */}
            <View style={styles.bioBlock}>
              <Text style={styles.sectionTitle}>
                {t("profile_button_title")}
              </Text>
              <Text style={styles.bioText}>{currentUser.bio}</Text>
            </View>

            {/* User products */}
            <View style={styles.productsBlock}>
              <Text style={styles.sectionTitle}>
                {t("profile_x_items").replace(
                  "X",
                  String(userProducts.length)
                )}
              </Text>
              <View style={styles.productsGrid}>
                {userProducts.map((product) => (
                  <View key={product.id} style={styles.productItemWrapper}>
                    <ProductCard
                      product={product}
                      onClick={() => handleProductClick(product)}
                      onToggleFavorite={() =>
                        handleToggleFavorite(product.id)
                      }
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <View style={styles.contentPadding}>
            {/* Average rating */}
            <View style={styles.averageRatingBlock}>
              <Text style={styles.averageRatingText}>{averageRating}</Text>
              <View style={styles.averageStarsRow}>
                {renderStars(Math.round(Number(averageRating)))}
              </View>
              <Text style={styles.averageSubtitle}>
                {t("profile_x_reviews").replace(
                  "X",
                  String(userReviews.length)
                )}
              </Text>
            </View>

            {/* Sort info */}
            <View style={styles.sortInfoBlock}>
              <Text style={styles.sortInfoText}>
                {t("profile_sorted_recent")}
              </Text>
            </View>

            {/* Reviews list */}
            <View style={styles.reviewsList}>
              {userReviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <TouchableOpacity
                    style={styles.reviewHeaderRow}
                    onPress={() => handleUserClick(review.reviewer.id)}
                    activeOpacity={0.7}
                  >
                    {review.reviewer.avatar ? (
                      <Image
                        source={{ uri: review.reviewer.avatar }}
                        style={styles.reviewAvatar}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[styles.reviewAvatar, styles.avatarPlaceholder]}
                      />
                    )}
                    <View style={styles.reviewHeaderTextBlock}>
                      <View style={styles.reviewHeaderTopRow}>
                        <Text style={styles.reviewUsernameText}>
                          {review.reviewer.username}
                        </Text>
                        <Text style={styles.reviewDateText}>
                          {review.date}
                        </Text>
                      </View>
                      <View style={styles.reviewStarsRow}>
                        {renderStars(review.rating)}
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.reviewCommentText}>
                    {review.comment}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {isEditModalVisible && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setIsEditModalVisible(false)}
          onSave={(updatedUser) => {
            setCurrentUser((prev) => ({
              ...prev,
              ...updatedUser,
            }));
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  headerWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBackButton: {
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
  tabsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 14,
  },
  tabTextActive: {
    color: "#111827",
  },
  tabTextInactive: {
    color: "#6B7280",
  },
  tabIndicator: {
    marginTop: 8,
    height: 2,
    width: "100%",
    backgroundColor: "#7BCCEB",
  },
  contentPadding: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  userInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    marginRight: 16,
  },
  avatarPlaceholder: {
    backgroundColor: "#E5E7EB",
  },
  userMainInfos: {
    flexShrink: 1,
  },
  usernameText: {
    fontSize: 16,
    color: "#111827",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  starIcon: {
    marginRight: 2,
  },
  ratingCountText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  moreButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsBlock: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  bioBlock: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  productsBlock: {
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  productItemWrapper: {
    width: "48%",
    marginBottom: 16,
  },
  averageRatingBlock: {
    alignItems: "center",
    marginBottom: 24,
  },
  averageRatingText: {
    fontSize: 40,
    color: "#111827",
    marginBottom: 8,
  },
  averageStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  averageSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  sortInfoBlock: {
    marginBottom: 24,
  },
  sortInfoText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  reviewsList: {
    gap: 16,
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 16,
  },
  reviewHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    marginRight: 12,
  },
  reviewHeaderTextBlock: {
    flex: 1,
  },
  reviewHeaderTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewUsernameText: {
    fontSize: 14,
    color: "#111827",
  },
  reviewDateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  reviewStarsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewCommentText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    paddingLeft: 60,
  },
});
