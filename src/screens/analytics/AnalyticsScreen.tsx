import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../constants/colors';
import { MOCK_ANALYTICS } from '../../constants/mockData';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

function StatCard({
  icon,
  label,
  value,
  color = Colors.primary,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

export default function AnalyticsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { discounts } = useApp();

  const myDiscounts = discounts.filter((d) => d.merchantId === user?.id);
  const totalClaims = myDiscounts.reduce((sum, d) => sum + d.claimsCount, 0);
  const activeDiscounts = myDiscounts.filter((d) => d.active).length;
  const avgConversion = myDiscounts.length
    ? Math.round((totalClaims / myDiscounts.reduce((s, d) => s + d.maxClaims, 0)) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="pricetag-outline"
            label="Total Discounts"
            value={myDiscounts.length}
            color={Colors.primary}
          />
          <StatCard
            icon="checkmark-circle-outline"
            label="Active Discounts"
            value={activeDiscounts}
            color={Colors.success}
          />
          <StatCard
            icon="people-outline"
            label="Total Claims"
            value={totalClaims}
            color={Colors.info}
          />
          <StatCard
            icon="trending-up-outline"
            label="Avg. Claim Rate"
            value={`${avgConversion}%`}
            color={Colors.warning}
          />
        </View>

        {/* This month */}
        <Text style={styles.sectionTitle}>This Month</Text>
        <View style={styles.monthCard}>
          <View style={styles.monthRow}>
            <View style={styles.monthItem}>
              <Text style={styles.monthValue}>{MOCK_ANALYTICS.claimsThisMonth}</Text>
              <Text style={styles.monthLabel}>Claims</Text>
            </View>
            <View style={styles.monthDivider} />
            <View style={styles.monthItem}>
              <Text style={styles.monthValue}>{MOCK_ANALYTICS.conversionRate}%</Text>
              <Text style={styles.monthLabel}>Conversion</Text>
            </View>
            <View style={styles.monthDivider} />
            <View style={styles.monthItem}>
              <Text style={styles.monthValue}>{activeDiscounts}</Text>
              <Text style={styles.monthLabel}>Active</Text>
            </View>
          </View>
        </View>

        {/* Top offer */}
        <Text style={styles.sectionTitle}>Best Performing Offer</Text>
        <View style={styles.topOfferCard}>
          <Ionicons name="trophy-outline" size={28} color={Colors.warning} />
          <View style={styles.topOfferInfo}>
            <Text style={styles.topOfferTitle}>{MOCK_ANALYTICS.topDiscount}</Text>
            <Text style={styles.topOfferSub}>Most claims this month</Text>
          </View>
          <View style={styles.topOfferBadge}>
            <Text style={styles.topOfferBadgeText}>#{1}</Text>
          </View>
        </View>

        {/* Per-discount breakdown */}
        <Text style={styles.sectionTitle}>Discounts Breakdown</Text>
        {myDiscounts.map((d) => {
          const pct = d.maxClaims > 0 ? (d.claimsCount / d.maxClaims) * 100 : 0;
          return (
            <View key={d.id} style={styles.breakdownCard}>
              <View style={styles.breakdownHeader}>
                <Text style={styles.breakdownTitle} numberOfLines={1}>{d.title}</Text>
                <Text style={styles.breakdownClaims}>
                  {d.claimsCount}/{d.maxClaims}
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
              </View>
              <Text style={styles.breakdownPct}>{Math.round(pct)}% claimed</Text>
            </View>
          );
        })}

        {myDiscounts.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="analytics-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No discounts to analyze yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 8 },
  statsGrid: { gap: 10, marginBottom: 8 },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: { flex: 1 },
  statValue: { fontSize: 22, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  monthCard: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 20,
    marginBottom: 8,
  },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  monthItem: { alignItems: 'center', flex: 1 },
  monthValue: { fontSize: 26, fontWeight: '700', color: Colors.white },
  monthLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  monthDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)' },
  topOfferCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  topOfferInfo: { flex: 1 },
  topOfferTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  topOfferSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  topOfferBadge: {
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topOfferBadgeText: { fontSize: 13, fontWeight: '700', color: Colors.warning },
  breakdownCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  breakdownHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  breakdownTitle: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.text },
  breakdownClaims: { fontSize: 12, color: Colors.textSecondary, marginLeft: 8 },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  breakdownPct: { fontSize: 11, color: Colors.textSecondary },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
});
