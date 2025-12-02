// src/screens/admin/AdminNav.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AlertCircle, Search, LogOut } from "lucide-react-native";

interface AdminNavProps {
  activeTab: "reports" | "search";
  onTabChange: (tab: "reports" | "search") => void;
  onLogout: () => void;
}


export function AdminNav({ activeTab, onTabChange, onLogout }: AdminNavProps) {
  return (
    <View style={styles.container}>
      {/* --- Reports --- */}
      <TouchableOpacity
        onPress={() => onTabChange("reports")}
        style={styles.button}
        activeOpacity={0.8}
      >
        <AlertCircle
          size={24}
          color={activeTab === "reports" ? "#ffffff" : "#6e6e6eff"}
        />
        <Text
          style={[
            styles.label,
            { color: activeTab === "reports" ? "#ffffff" : "#6e6e6eff" },
          ]}
        >
          Signalements
        </Text>
      </TouchableOpacity>

      {/* --- Logout --- */}
      <TouchableOpacity
        onPress={onLogout}
        style={styles.button}
        activeOpacity={0.8}
      >
        <LogOut size={24} color="#6e6e6eff" />
        <Text style={[styles.label, { color: "#6e6e6eff" }]}>
          Déconnexion
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000ff",
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1.5,
    borderTopColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 6,
    zIndex: 50,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  label: {
    marginTop: 2,
    fontSize: 11,
  },
});
