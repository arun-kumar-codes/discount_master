import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { StoresStackParamList } from '../../navigation/AppNavigator';
import { Discount } from '../../types';

type Route = RouteProp<StoresStackParamList, 'StoreDiscounts'>;
type Nav = NativeStackNavigationProp<StoresStackParamList, 'StoreDiscounts'>;

function DiscountCard({ discount, onPress }: { discount: Discount; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {discount.imageUrl ? (
        <Image source={{ uri: discount.imageUrl }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]}>
          <Ionicons name="image-outline" size={40} color={Colors.textSecondary} />
        </View>
      )}
      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>{discount.title}</Text>
          {discount.discountPercentage != null && (
            <View style={styles.pctBadge}>
              <Text style={styles.pctText}>-{discount.discountPercentage}%</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>{discount.description}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.availRow}>
            <Ionicons name="people-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.availText}>
              {discount.maxClaims - discount.claimsCount} / {discount.maxClaims} available
            </Text>
          </View>
          <TouchableOpacity style={styles.claimBtn} onPress={onPress}>
            <Text style={styles.claimBtnText}>View Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function StoreDiscountsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { storeId, storeName } = route.params;
  const { discounts } = useApp();

  const storeDiscounts = discounts.filter((d) => d.merchantId === storeId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{storeName}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={storeDiscounts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>
            {storeDiscounts.length} offer{storeDiscounts.length !== 1 ? 's' : ''} available
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="pricetag-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No offers from this store yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <DiscountCard
            discount={item}
            onPress={() => navigation.navigate('StoreDiscountDetail', { discountId: item.id })}
          />
        )}
      />
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
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  list: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardImage: { width: '100%', height: 140 },
  imagePlaceholder: {
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: 16 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 10,
  },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.text },
  pctBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pctText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  cardDesc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 14, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  availText: { fontSize: 12, color: Colors.textSecondary },
  claimBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  claimBtnText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
});
