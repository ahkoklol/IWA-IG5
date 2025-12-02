// src/components/admin/AdminLayout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { AdminNav } from "../../screens/admin/AdminNav";
import { Screen } from "../../components/Screen";

interface AdminLayoutProps {
  activeTab: "reports" | "search";
  children: React.ReactNode;
}

export function AdminLayout({ activeTab, children }: AdminLayoutProps) {
  return (
    <View style={styles.root}>
      {/* Contenu de l’écran (avec ton composant Screen pour garder ton style global) */}
      <Screen>{children}</Screen>

      {/* Navbar admin fixe en bas */}
      <AdminNav
        activeTab={activeTab}
        onTabChange={() => {
          // no-op ici : la vraie logique de changement d’onglet
          // est gérée dans AdminRootScreen
        }}
        onLogout={() => {
          // no-op ici aussi, on ne l'utilise pas via ce layout
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingBottom: 60, // laisse la place à la nav en bas
  },
});
