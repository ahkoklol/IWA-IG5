// src/components/Screen.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["top", "right", "left"]}
    >
      {children}
    </SafeAreaView>
  );
}
