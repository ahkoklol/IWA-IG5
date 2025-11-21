// src/screens/admin/AdminRootScreen.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { Report, Product, Category, User } from "../../shared/types";
import {
  demoReports,
  demoProducts,
  users as demoUsers,
} from "../../mocks/products";

import { AdminNav } from "./AdminNav";
import { AdminReportsPage } from "./AdminReportsScreen";
import { AdminSearchPage } from "./AdminSearchScreen";

type Props = NativeStackScreenProps<RootStackParamList, "AdminRoot">;

export function AdminRootScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<"reports" | "search">("reports");

  const reports: Report[] = demoReports;
  const products: Product[] = demoProducts;
  const users: User[] = demoUsers;

  const handleReportClick = (report: Report) => {
    navigation.navigate("AdminReportDetail", { reportId: report.id });
  };

  const handleCategorySelect = (category: Category) => {
    navigation.navigate("CategoryResults", {
      category,
      searchQuery: "",
    });
  };

  const handleProductClick = (product: Product) => {
    navigation.navigate("ProductDetail", {
      productId: String(product.id),
    });
  };

  const handleUserClick = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    navigation.navigate("MyProfileScreen", {
      user,
      initialTab: "profile",
    });
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", paddingBottom: 60 }}>
      {activeTab === "reports" ? (
        <AdminReportsPage
          reports={reports}
          onReportClick={handleReportClick}
        />
      ) : (
        <AdminSearchPage
          products={products}
          users={users}
          onCategorySelect={handleCategorySelect}
          onProductClick={handleProductClick}
          onUserClick={handleUserClick}
        />
      )}

      <AdminNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
    </View>
  );
}
