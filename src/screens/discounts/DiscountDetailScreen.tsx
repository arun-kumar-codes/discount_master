import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { DiscountsStackParamList } from '../../navigation/AppNavigator';

type Route = RouteProp<DiscountsStackParamList, 'DiscountDetail'>;
type Nav = NativeStackNavigationProp<DiscountsStackParamList, 'DiscountDetail'>;

function generateClaimCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function DiscountDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { discountId } = route.params;
  const { discounts, isFavorite, toggleFavorite } = useApp();

  const discount = discounts.find((d) => d.id === discountId);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [claimCode] = useState(generateClaimCode());

  if (!discount) {
    return (
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Discount not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const available = discount.maxClaims - discount.claimsCount;
  const fav = isFavorite(discountId);

  const openMap = () => {
    if (discount.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${discount.location.lat},${discount.location.lng}`;
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open maps.'));
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={styles.heroContainer}>
          {discount.imageUrl ? (
            <Image source={{ uri: discount.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Ionicons name="image-outline" size={64} color={Colors.textSecondary} />
            </View>
          )}

          {/* Back button */}
          <TouchableOpacity style={styles.backOverlay} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>

          {/* Favorite button */}
          <TouchableOpacity style={styles.favOverlay} onPress={() => toggleFavorite(discountId)}>
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={22}
              color={fav ? Colors.error : Colors.white}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title + badge */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>{discount.title}</Text>
            {discount.discountPercentage != null && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>-{discount.discountPercentage}%</Text>
              </View>
            )}
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About this offer</Text>
          <Text style={styles.description}>{discount.description}</Text>

          {/* Availability card */}
          <View style={styles.infoCard}>
            <Ionicons name="people-outline" size={24} color={Colors.primary} />
            <View style={styles.infoCardText}>
              <Text style={styles.infoCardLabel}>Availability</Text>
              <Text style={styles.infoCardValue}>
                {available} of {discount.maxClaims} available
              </Text>
            </View>
          </View>

          {/* Location card */}
          {discount.location && (
            <View style={styles.infoCard}>
              <Ionicons name="location-outline" size={24} color={Colors.primary} />
              <View style={styles.infoCardText}>
                <Text style={styles.infoCardLabel}>Location</Text>
                <Text style={styles.infoCardValue}>View on map</Text>
              </View>
              <TouchableOpacity onPress={openMap} style={styles.openMapBtn}>
                <Text style={styles.openMapText}>OPEN</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Valid period */}
          <View style={styles.infoCard}>
            <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
            <View style={styles.infoCardText}>
              <Text style={styles.infoCardLabel}>Valid Until</Text>
              <Text style={styles.infoCardValue}>
                {new Date(discount.validTo).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          {/* Claim button */}
          <TouchableOpacity
            style={[styles.claimBtn, available <= 0 && styles.claimBtnDisabled]}
            onPress={() => available > 0 && setClaimModalVisible(true)}
            disabled={available <= 0}
            activeOpacity={0.85}
          >
            <Ionicons name="qr-code-outline" size={20} color={Colors.white} />
            <Text style={styles.claimBtnText}>
              {available > 0 ? 'CLAIM OFFER' : 'NO AVAILABILITY'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Claim Modal */}
      <Modal
        visible={claimModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setClaimModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Offer Claimed!</Text>
            <Text style={styles.modalSubtitle}>Show this code to the merchant:</Text>

            {/* QR-like display */}
            <View style={styles.qrBox}>
              <View style={styles.qrGrid}>
                {Array.from({ length: 49 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.qrCell,
                      (i + (i % 7)) % 3 === 0 && styles.qrCellFilled,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.claimCodeBox}>
              <Text style={styles.claimCode}>{claimCode}</Text>
            </View>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setClaimModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  heroContainer: { position: 'relative' },
  heroImage: { width: '100%', height: 280 },
  heroPlaceholder: {
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 24 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  title: { flex: 1, fontSize: 22, fontWeight: '700', color: Colors.text },
  discountBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountBadgeText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  description: { fontSize: 15, color: Colors.textLight, lineHeight: 22, marginBottom: 24 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    gap: 14,
  },
  infoCardText: { flex: 1 },
  infoCardLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  infoCardValue: { fontSize: 15, fontWeight: '600', color: Colors.text },
  openMapBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  openMapText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    marginTop: 16,
  },
  claimBtnDisabled: { backgroundColor: Colors.textSecondary },
  claimBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  backBtn: { padding: 16 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 16, color: Colors.textSecondary },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  qrBox: {
    width: 180,
    height: 180,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrGrid: {
    width: 148,
    height: 148,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qrCell: {
    width: 148 / 7,
    height: 148 / 7,
    backgroundColor: 'transparent',
  },
  qrCellFilled: {
    backgroundColor: Colors.primary,
  },
  claimCodeBox: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 24,
  },
  claimCode: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 4,
  },
  closeModalBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  closeModalText: { color: Colors.white, fontWeight: '600', fontSize: 15 },
});
