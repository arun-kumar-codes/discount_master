import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../constants/colors';
import { MOCK_STORES } from '../../constants/mockData';
import { StoresStackParamList } from '../../navigation/AppNavigator';
import { Store } from '../../types';

type Nav = NativeStackNavigationProp<StoresStackParamList, 'StoresList'>;

function StoreCard({ store, onPress }: { store: Store; onPress: () => void }) {
  const openMap = () => {
    if (store.lat != null && store.lng != null) {
      const url = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open maps.'));
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Image */}
      {store.avatarUrl ? (
        <Image source={{ uri: store.avatarUrl }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]}>
          <Ionicons name="storefront-outline" size={52} color={Colors.primaryLight} />
        </View>
      )}

      {/* Info */}
      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.storeName} numberOfLines={1}>{store.fullName}</Text>
          <TouchableOpacity
            onPress={openMap}
            style={[styles.mapBtn, (!store.lat || !store.lng) && styles.mapBtnDisabled]}
            disabled={!store.lat || !store.lng}
          >
            <Ionicons
              name="location"
              size={22}
              color={store.lat && store.lng ? Colors.primary : Colors.border}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Store</Text>
          </View>
          <TouchableOpacity style={styles.viewMoreBtn} onPress={onPress}>
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function StoresScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Stores</Text>
      </View>

      <FlatList
        data={MOCK_STORES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="storefront-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No stores available.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <StoreCard
            store={item}
            onPress={() =>
              navigation.navigate('StoreDiscounts', {
                storeId: item.id,
                storeName: item.fullName,
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  appBarTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  list: { padding: 16, paddingBottom: 40 },
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
    marginBottom: 12,
  },
  storeName: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.text },
  mapBtn: { padding: 4 },
  mapBtnDisabled: { opacity: 0.4 },
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
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
});
