// src/components/Screen.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
  noTopSafeArea?: boolean;
}

export function Screen({ children, noTopSafeArea = false }: ScreenProps) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={noTopSafeArea ? ["left", "right"] : ["top", "right", "left"]}
    >
      {children}
    </SafeAreaView>
  );
}
