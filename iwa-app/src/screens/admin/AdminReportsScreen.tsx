// src/screens/admin/AdminReportsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { Report } from "../../shared/types";
import { demoReports } from "../../mocks/products";
import { Screen } from "../../components/Screen";
import { AdminLayout } from "./AdminLayout";

// ---------- Composant présentational (comme ta version web) ----------

interface AdminReportsPageProps {
  reports: Report[];
  onReportClick: (report: Report) => void;
}

export function AdminReportsPage({ reports, onReportClick }: AdminReportsPageProps) {
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "most-reports">(
    "recent"
  );
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const getSortedReports = () => {
    const sorted = [...reports];

    switch (sortBy) {
      case "recent":
        return sorted.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "most-reports":
        return sorted.sort((a, b) => b.reportCount - a.reportCount);
      default:
        return sorted;
    }
  };

  const sortedReports = getSortedReports();
  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const processedCount = reports.filter((r) => r.status !== "pending").length;

  const handleChangeSort = (value: "recent" | "oldest" | "most-reports") => {
    setSortBy(value);
    setSortMenuOpen(false);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "recent":
        return "Du plus récent au plus ancien";
      case "oldest":
        return "Du plus ancien au plus récent";
      case "most-reports":
        return "Le plus de signalements";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      <Screen>
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
      >

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Requêtes de remise en ligne</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{processedCount}</Text>
            <Text style={styles.statLabel}>Traités</Text>
          </View>
        </View>

              {/* Tri */}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortMenuOpen((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Text style={styles.sortText}>{getSortLabel()}</Text>
            <ChevronDown size={20} color="#4b5563" />
          </TouchableOpacity>

          {sortMenuOpen && (
            <View style={styles.sortMenu}>
              <TouchableOpacity
                style={styles.sortMenuItem}
                onPress={() => handleChangeSort("recent")}
              >
                <Text style={styles.sortMenuItemText}>
                  Du plus récent au plus ancien
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortMenuItem}
                onPress={() => handleChangeSort("oldest")}
              >
                <Text style={styles.sortMenuItemText}>
                  Du plus ancien au plus récent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortMenuItem}
                onPress={() => handleChangeSort("most-reports")}
              >
                <Text style={styles.sortMenuItemText}>
                  Le plus de signalements
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
          {sortedReports.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun signalement</Text>
            </View>
          ) : (
            sortedReports.map((report) => {
              const isPending = report.status === "pending";

              return (
                <TouchableOpacity
                  key={report.id}
                  onPress={() => {
                    if (isPending) onReportClick(report);
                  }}
                  style={[
                    styles.reportCard,
                    isPending ? styles.reportCardPending : styles.reportCardProcessed,
                  ]}
                  disabled={!isPending}
                  activeOpacity={0.8}
                >
                  {/* Titre de l'annonce */}
                  <View style={styles.cardHeader}>
                    <Text
                      style={[
                        styles.cardTitle,
                        !isPending && styles.cardTitleProcessed,
                      ]}
                    >
                      {report.productName}
                    </Text>
                  </View>

                  {/* Pill + chevron */}
                  <View style={styles.cardFooter}>
                    <View
                      style={[
                        styles.badge,
                        !isPending && styles.badgeProcessed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          !isPending && styles.badgeTextProcessed,
                        ]}
                      >
                        {report.reportCount} signalement
                        {report.reportCount > 1 ? "s" : ""}
                      </Text>
                    </View>

                    <ChevronRight
                      size={24}
                      color={isPending ? "#000000" : "#9ca3af"}
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )}

      </ScrollView>
      </Screen>
    </View>
  );
}

// ---------- Screen pour React Navigation ----------

type AdminReportsScreenProps = NativeStackScreenProps< RootStackParamList, "AdminReports" >;

export function AdminReportsScreen({ navigation }: AdminReportsScreenProps) {
  const reports: Report[] = demoReports;

  const handleReportClick = (report: Report) => {
    navigation.navigate("AdminReportDetail", { reportId: report.id });
  };

  return (
    <AdminLayout activeTab="reports">
      <AdminReportsPage
        reports={reports}
        onReportClick={handleReportClick}
      />
    </AdminLayout>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingBottom: 32,
  },
  header: {
    backgroundColor: "#ffffffff", // bandeau vert
    paddingTop: 16,
    paddingBottom: 5,
  },
  headerTitle: {
    color: "#000000ff",
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "600",
    textAlign: "center", // centré comme sur la maquette
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)", // léger blanc transparent
    borderWidth: 1,
    borderColor: "#000000ff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statNumber: {
    color: "#000000ff",
    fontSize: 26,
    marginBottom: 4,
    fontWeight: "700",
  },
  statLabel: {
    color: "#000000ff",
    fontSize: 13,
  },
  sortContainer: {
    marginTop: 4,
    marginBottom: 10,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#000000ff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  sortText: {
    fontSize: 14,
    color: "#000000ff",
  },
  sortMenu: {
    marginTop: 4,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#000000ff",
    overflow: "hidden",
  },
  sortMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sortMenuItemText: {
    fontSize: 14,
    color: "#374151",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 14,
  },
  reportCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  reportCardPending: {
    borderColor: "#000000",           // contour noir
  },
  reportCardProcessed: {
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",       // gris clair
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",                  // noir
  },
  cardTitleProcessed: {
    color: "#9ca3af",                  // gris pour traité
  },
  cardMeta: {
    fontSize: 11,
    color: "#9ca3af",
  },
  cardDescription: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#fee2e2",        // rouge très clair
    borderWidth: 1,
    borderColor: "#ef4444",            // rouge foncé
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 7,
  },
  badgeText: {
    fontSize: 14,
    color: "#b91c1c",
  },

  badgeProcessed: {
    backgroundColor: "#e5e7eb",        // gris clair
    borderColor: "#d1d5db",
  },
  badgeTextProcessed: {
    color: "#9ca3af",
  },
});
