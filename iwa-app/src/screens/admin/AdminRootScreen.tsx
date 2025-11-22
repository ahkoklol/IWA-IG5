// src/screens/admin/AdminRootScreen.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { Report } from "../../shared/types";
import { demoReports } from "../../mocks/products";

import { AdminNav } from "./AdminNav";
import { AdminReportsPage } from "./AdminReportsScreen";

type Props = NativeStackScreenProps<RootStackParamList, "AdminRoot">;

export function AdminRootScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<"reports" | "search">("reports");

  const reports: Report[] = demoReports;

  const handleReportClick = (report: Report) => {
    navigation.navigate("AdminReportDetail", { reportId: report.id });
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", paddingBottom: 60 }}>
      {/* On n’affiche plus que la page des signalements */}
      <AdminReportsPage reports={reports} onReportClick={handleReportClick} />

      <AdminNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
    </View>
  );
}
