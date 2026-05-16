import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { ProfileStackParamList } from '../../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout, updateUser } = useAuth();
  const isMerchant = user?.role === 'merchant';

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [lat, setLat] = useState(user?.lat?.toString() ?? '');
  const [lng, setLng] = useState(user?.lng?.toString() ?? '');
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGetLocation = async () => {
    setIsLocating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Simulate getting location
    setLat('40.429345');
    setLng('-3.68143');
    setIsLocating(false);
    Alert.alert('Success', 'Location retrieved successfully.');
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required.');
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    updateUser({
      fullName: fullName.trim(),
      phone: phone.trim(),
      lat: parseFloat(lat) || undefined,
      lng: parseFloat(lng) || undefined,
    });
    setIsSaving(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out?')) {
        logout();
      }
      return;
    }

    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>My Profile</Text>
        <View style={styles.appBarActions}>
          {isMerchant && (
            <>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('Analytics')}
              >
                <Ionicons name="analytics-outline" size={22} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => Alert.alert('Media Library', 'Media management would open here.')}
              >
                <Ionicons name="images-outline" size={22} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => Alert.alert('Subscriptions', 'Payment & subscription management.')}
              >
                <Ionicons name="card-outline" size={22} color={Colors.text} />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons
                    name={isMerchant ? 'storefront' : 'person'}
                    size={44}
                    color={Colors.primary}
                  />
                </View>
              )}
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={() => Alert.alert('Upload Photo', 'Image picker would open here.')}
              >
                <Ionicons name="camera" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* QR code for regular users */}
          {!isMerchant && (
            <View style={styles.qrCard}>
              <Text style={styles.qrTitle}>My QR Code</Text>
              <Text style={styles.qrSubtitle}>Show this to the merchant</Text>
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
              <Text style={styles.userId}>ID: {user?.id}</Text>
            </View>
          )}

          {/* Personal Info */}
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputRow, styles.inputDisabled]}>
              <Ionicons name="mail-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: Colors.textSecondary }]}
                value={user?.email}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={[styles.inputRow, styles.inputDisabled]}>
              <Ionicons name="call-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: Colors.textSecondary }]}
                value={user?.phone}
                editable={false}
              />
            </View>
          </View>

          {/* Location */}
          <Text style={styles.sectionTitle}>Location</Text>

          <View style={styles.locationRow}>
            <View style={[styles.fieldGroup, styles.flex]}>
              <Text style={styles.label}>Latitude</Text>
              <View style={styles.inputRow}>
                <Ionicons name="location-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={lat}
                  onChangeText={setLat}
                  keyboardType="decimal-pad"
                  placeholder="0.000000"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            </View>
            <View style={{ width: 12 }} />
            <View style={[styles.fieldGroup, styles.flex]}>
              <Text style={styles.label}>Longitude</Text>
              <View style={styles.inputRow}>
                <Ionicons name="location-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={lng}
                  onChangeText={setLng}
                  keyboardType="decimal-pad"
                  placeholder="0.000000"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.locationBtn, isLocating && styles.locationBtnDisabled]}
            onPress={handleGetLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Ionicons name="navigate-outline" size={18} color={Colors.primary} />
            )}
            <Text style={styles.locationBtnText}>
              {isLocating ? 'Getting location...' : 'Get Current Location'}
            </Text>
          </TouchableOpacity>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Role badge */}
          <View style={styles.roleBadge}>
            <Ionicons
              name={isMerchant ? 'storefront-outline' : 'person-outline'}
              size={16}
              color={Colors.primary}
            />
            <Text style={styles.roleText}>
              {isMerchant ? 'Business Account' : 'Customer Account'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
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
  appBarActions: { flexDirection: 'row', gap: 2 },
  iconBtn: { padding: 8 },
  scroll: { padding: 24, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    backgroundColor: 'rgba(35,68,106,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  qrCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  qrTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  qrSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16 },
  qrBox: {
    width: 160,
    height: 160,
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrGrid: { width: 136, height: 136, flexDirection: 'row', flexWrap: 'wrap' },
  qrCell: { width: 136 / 7, height: 136 / 7, backgroundColor: 'transparent' },
  qrCellFilled: { backgroundColor: Colors.primary },
  userId: { fontSize: 11, color: Colors.textSecondary, fontFamily: 'monospace' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    marginTop: 4,
  },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    height: 50,
  },
  inputDisabled: { opacity: 0.7 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  locationRow: { flexDirection: 'row', marginBottom: 0 },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
    marginBottom: 28,
    marginTop: 4,
  },
  locationBtnDisabled: { opacity: 0.6 },
  locationBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  roleText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
});
