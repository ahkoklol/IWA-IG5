import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Home, Search, PlusCircle, Bell, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { AddProductModal, NewListing } from "../screens/sell/AddProductModal";

export type BottomTabId = "home" | "search" | "sell" | "notifications" | "profile";

interface BottomNavProps {
  activeTab: BottomTabId;
  onTabChange: (tab: BottomTabId) => void;
  onAddProduct: (product: NewListing) => void;
}

export function BottomNavbar({ activeTab, onTabChange, onAddProduct }: BottomNavProps) {
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const { t } = useTranslation();

  const tabs: { id: BottomTabId; icon: any; labelKey: string }[] = [
    { id: "home", icon: Home, labelKey: "navbar_home" },
    { id: "search", icon: Search, labelKey: "navbar_search" },
    { id: "sell", icon: PlusCircle, labelKey: "navbar_sell" },
    { id: "notifications", icon: Bell, labelKey: "navbar_notifications" },
    { id: "profile", icon: User, labelKey: "navbar_profile" },
  ];

  const handleTabPress = (tabId: BottomTabId) => {
    if (tabId === "sell") {
      setIsSellModalOpen(true);
      return;
    }

    onTabChange(tabId);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inner}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabPress(tab.id)}
                style={styles.tab}
                activeOpacity={0.7}
              >
                <Icon
                  size={26}
                  strokeWidth={2}
                  color={isActive ? "#7BCCEB" : "#4B5563"}
                />
                <Text
                  style={[
                    styles.label,
                    isActive ? styles.labelActive : styles.labelInactive,
                  ]}
                  numberOfLines={1}
                >
                  {t(tab.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {isSellModalOpen && (
        <AddProductModal
          onClose={() => setIsSellModalOpen(false)}
          onAdd={(product) => {
            onAddProduct(product);
            // IMPORTANT: ne pas fermer ici
            // le modal de succès dans AddProductModal appellera onClose()
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
  },
  labelActive: {
    color: "#7BCCEB",
    fontWeight: "600",
  },
  labelInactive: {
    color: "#4B5563",
    fontWeight: "400",
  },
});
