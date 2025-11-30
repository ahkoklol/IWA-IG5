// src/screens/admin/AdminReportsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { Report } from "../../shared/types/report";
import { Screen } from "../../components/Screen";
import { AdminLayout } from "./AdminLayout";
import { getAllReports } from "../../api/reportingApi";

// ---------- Composant présentational ----------

interface AdminReportsPageProps {
  reports: Report[];
  onReportClick: (report: Report) => void;
}

export function AdminReportsPage({
  reports,
  onReportClick,
}: AdminReportsPageProps) {
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "most-reports">(
    "recent",
  );
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const getSortedReports = () => {
    const sorted = [...reports];

    switch (sortBy) {
      case "recent":
        return sorted.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      case "most-reports":
        return sorted.sort(
          (a, b) => (b.reportCount ?? 1) - (a.reportCount ?? 1),
        );
      default:
        return sorted;
    }
  };

  const sortedReports = getSortedReports();

  // Si status est absent, on considère "pending" par défaut
  const pendingCount = reports.filter(
    (r) => r.status === "pending" || !r.status,
  ).length;
  const processedCount = reports.length - pendingCount;

  const handleChangeSort = (
    value: "recent" | "oldest" | "most-reports",
  ) => {
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
              const isPending =
                report.status === "pending" || !report.status;

              return (
                <TouchableOpacity
                  key={report.reportId}
                  onPress={() => {
                    if (isPending) onReportClick(report);
                  }}
                  style={[
                    styles.reportCard,
                    isPending
                      ? styles.reportCardPending
                      : styles.reportCardProcessed,
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
                      {report.productName ??
                        `Annonce #${report.postId}`}
                    </Text>
                  </View>

                  <Text style={styles.cardDescription}>
                    {report.description}
                  </Text>

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
                        {report.reportCount ?? 1} signalement
                        {(report.reportCount ?? 1) > 1 ? "s" : ""}
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

type AdminReportsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "AdminReports"
>;

export function AdminReportsScreen({ navigation }: AdminReportsScreenProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllReports();
        if (!mounted) return;
        setReports(data);
      } catch (e) {
        if (!mounted) return;
        setError((e as Error).message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadReports();
    return () => {
      mounted = false;
    };
  }, []);

  const handleReportClick = (report: Report) => {
    navigation.navigate("AdminReportDetail", {
      reportId: report.reportId,
    });
  };

  return (
    <AdminLayout activeTab="reports">
      {loading ? (
        <Screen>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
            }}
          >
            <ActivityIndicator />
            <Text style={{ marginTop: 8 }}>Chargement des signalements…</Text>
          </View>
        </Screen>
      ) : error ? (
        <Screen>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
            }}
          >
            <Text style={{ color: "#b91c1c", marginBottom: 8 }}>
              Erreur lors du chargement des signalements
            </Text>
            <Text style={{ color: "#6b7280", fontSize: 12 }}>{error}</Text>
          </View>
        </Screen>
      ) : (
        <AdminReportsPage
          reports={reports}
          onReportClick={handleReportClick}
        />
      )}
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
    backgroundColor: "#ffffffff",
    paddingTop: 16,
    paddingBottom: 5,
  },
  headerTitle: {
    color: "#000000ff",
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
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
    borderColor: "#000000",
  },
  reportCardProcessed: {
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cardTitleProcessed: {
    color: "#9ca3af",
  },
  cardDescription: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space_between",
    alignItems: "center",
  } as any, // pour éviter l'erreur TS sur "space_between" si tu veux strictement "space-between"
  badge: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#ef4444",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 7,
  },
  badgeText: {
    fontSize: 14,
    color: "#b91c1c",
  },
  badgeProcessed: {
    backgroundColor: "#e5e7eb",
    borderColor: "#d1d5db",
  },
  badgeTextProcessed: {
    color: "#9ca3af",
  },
});
