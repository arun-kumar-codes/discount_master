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

import { Colors } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { Discount } from '../../types';

function FavoriteDiscountCard({
  discount,
  onRemove,
}: {
  discount: Discount;
  onRemove: () => void;
}) {
  return (
    <View style={styles.card}>
      {discount.imageUrl ? (
        <Image source={{ uri: discount.imageUrl }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]}>
          <Ionicons name="image-outline" size={40} color={Colors.textSecondary} />
        </View>
      )}

      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{discount.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{discount.description}</Text>
          </View>
          <TouchableOpacity onPress={onRemove} style={styles.removeBtn} hitSlop={8}>
            <Ionicons name="heart" size={22} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardMeta}>
          {discount.discountPercentage != null && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount.discountPercentage}%</Text>
            </View>
          )}
          <View style={styles.availBadge}>
            <Ionicons name="people-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.availText}>
              {discount.maxClaims - discount.claimsCount} left
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function FavoritesScreen() {
  const { discounts, favorites, toggleFavorite } = useApp();

  const favoriteDiscounts = discounts.filter((d) => favorites.includes(d.id));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>My Favorites</Text>
        {favoriteDiscounts.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favoriteDiscounts.length}</Text>
          </View>
        )}
      </View>

      {favoriteDiscounts.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={72} color={Colors.border} />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart on any discount to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteDiscounts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <FavoriteDiscountCard
              discount={item}
              onRemove={() => toggleFavorite(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  appBarTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  countBadge: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardImage: { width: 100, height: 110 },
  imagePlaceholder: {
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', marginBottom: 10 },
  cardInfo: { flex: 1, marginRight: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 16 },
  removeBtn: { padding: 2 },
  cardMeta: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  discountBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  availText: { fontSize: 11, color: Colors.textSecondary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
