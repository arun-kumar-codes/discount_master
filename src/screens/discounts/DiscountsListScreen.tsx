import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { DiscountsStackParamList } from '../../navigation/AppNavigator';
import { Discount } from '../../types';

type Nav = NativeStackNavigationProp<DiscountsStackParamList, 'DiscountsList'>;

type FilterType = 'all' | 'mine';

function FavoriteButton({ discountId }: { discountId: string }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(discountId);
  return (
    <TouchableOpacity onPress={() => toggleFavorite(discountId)} style={styles.favBtn} hitSlop={8}>
      <Ionicons name={fav ? 'heart' : 'heart-outline'} size={18} color={fav ? Colors.error : Colors.textSecondary} />
    </TouchableOpacity>
  );
}

function DiscountCard({
  discount,
  isMerchant,
  isOwn,
  onPress,
  onEdit,
  onDelete,
}: {
  discount: Discount;
  isMerchant: boolean;
  isOwn: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {discount.imageUrl ? (
          <Image source={{ uri: discount.imageUrl }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={[styles.cardImage, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={44} color={Colors.textSecondary} />
          </View>
        )}

        {/* Favorite button */}
        <View style={styles.favCircle}>
          <FavoriteButton discountId={discount.id} />
        </View>

        {/* Edit / Delete (merchant only, own discounts) */}
        {isOwn && (
          <View style={styles.editRow}>
            <TouchableOpacity style={styles.actionCircle} onPress={onEdit}>
              <Ionicons name="pencil" size={16} color={Colors.info} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCircle} onPress={onDelete}>
              <Ionicons name="trash" size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{discount.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={1}>{discount.description}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{discount.category ?? 'Food'}</Text>
          </View>
          <TouchableOpacity style={styles.viewMoreBtn} onPress={onPress}>
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function DiscountsListScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { discounts, deleteDiscount } = useApp();
  const isMerchant = user?.role === 'merchant';
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered =
    isMerchant && filter === 'mine'
      ? discounts.filter((d) => d.merchantId === user?.id)
      : discounts;

  const handleDelete = (id: string) => {
    Alert.alert('Delete Discount', 'Are you sure you want to delete this discount?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteDiscount(id),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Nearby Offers</Text>
        <View style={styles.appBarActions}>
          {isMerchant && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => Alert.alert('QR Scanner', 'Camera access required on device.')}
            >
              <Ionicons name="qr-code-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Merchant filter */}
      {isMerchant && (
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
            onPress={() => setFilter('all')}
          >
            <Ionicons
              name="list-outline"
              size={16}
              color={filter === 'all' ? Colors.white : Colors.text}
            />
            <Text style={[styles.filterBtnText, filter === 'all' && styles.filterBtnTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'mine' && styles.filterBtnActive]}
            onPress={() => setFilter('mine')}
          >
            <Ionicons
              name="storefront-outline"
              size={16}
              color={filter === 'mine' ? Colors.white : Colors.text}
            />
            <Text style={[styles.filterBtnText, filter === 'mine' && styles.filterBtnTextActive]}>
              My Offers
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="pricetag-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No discounts available.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <DiscountCard
            discount={item}
            isMerchant={isMerchant}
            isOwn={isMerchant && item.merchantId === user?.id}
            onPress={() => navigation.navigate('DiscountDetail', { discountId: item.id })}
            onEdit={() => navigation.navigate('EditDiscount', { discount: item })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />

      {/* FAB for merchant */}
      {isMerchant && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateDiscount')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color={Colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  appBarTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  appBarActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 8 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterBtnText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  filterBtnTextActive: { color: Colors.white },
  list: { padding: 16, paddingBottom: 100 },
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
  imageContainer: { position: 'relative' },
  cardImage: { width: '100%', height: 140 },
  imagePlaceholder: {
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  favBtn: { alignItems: 'center', justifyContent: 'center' },
  editRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 6,
  },
  actionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 14 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(75,110,150,0.15)',
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  viewMoreBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewMoreText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
