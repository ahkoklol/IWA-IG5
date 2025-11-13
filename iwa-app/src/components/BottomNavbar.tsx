// src/components/BottomNavbar.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Home, Search, PlusCircle, Bell, User } from "lucide-react-native";

export type BottomTabId = "home" | "search" | "sell" | "notifications" | "profile";

interface BottomNavProps {
  activeTab: BottomTabId;
  onTabChange: (tab: BottomTabId) => void;
}

export function BottomNavbar({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: BottomTabId; icon: any; label: string }[] = [
    { id: "home", icon: Home, label: "Accueil" },
    { id: "search", icon: Search, label: "Rechercher" },
    { id: "sell", icon: PlusCircle, label: "Vendre" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: User, label: "Profil" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
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
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
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
