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
  KeyboardAvoidingView,
  Platform,
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

type Nav = NativeStackNavigationProp<DiscountsStackParamList, 'CreateDiscount'>;

export default function CreateDiscountScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { addDiscount } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [percentage, setPercentage] = useState('');
  const [maxClaims, setMaxClaims] = useState('');
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCaptureLocation = () => {
    setLocationCaptured(true);
    Alert.alert('Location Saved', 'Your current location has been attached to this discount.');
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !percentage || !maxClaims) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }
    const pct = parseFloat(percentage);
    const max = parseInt(maxClaims, 10);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      Alert.alert('Validation Error', 'Discount percentage must be between 1 and 100.');
      return;
    }
    if (isNaN(max) || max <= 0) {
      Alert.alert('Validation Error', 'Max claims must be a positive number.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newDiscount: Discount = {
      id: `d_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      discountPercentage: pct,
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: locationCaptured ? { lat: 40.4168, lng: -3.7038 } : undefined,
      merchantId: user?.id ?? '',
      maxClaims: max,
      claimsCount: 0,
      active: true,
      category: 'Food',
    };

    addDiscount(newDiscount);
    setIsSubmitting(false);
    Alert.alert('Success', 'Discount created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Discount</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cover image placeholder */}
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => Alert.alert('Media', 'Image picker would open here.')}
          >
            <Ionicons name="camera-outline" size={44} color={Colors.textSecondary} />
            <Text style={styles.imagePickerText}>Add Cover Image</Text>
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Discount Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Classic Burger Combo"
              placeholderTextColor={Colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Describe your discount offer..."
              placeholderTextColor={Colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Percentage + Max claims */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.flex]}>
              <Text style={styles.label}>Discount % *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 20"
                placeholderTextColor={Colors.textSecondary}
                value={percentage}
                onChangeText={setPercentage}
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={[styles.fieldGroup, styles.flex]}>
              <Text style={styles.label}>Max Claims *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 50"
                placeholderTextColor={Colors.textSecondary}
                value={maxClaims}
                onChangeText={setMaxClaims}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Location */}
          <TouchableOpacity
            style={[styles.locationBtn, locationCaptured && styles.locationBtnActive]}
            onPress={handleCaptureLocation}
          >
            <Ionicons
              name={locationCaptured ? 'checkmark-circle' : 'location-outline'}
              size={20}
              color={locationCaptured ? Colors.success : Colors.primary}
            />
            <Text style={[styles.locationText, locationCaptured && styles.locationTextActive]}>
              {locationCaptured ? 'Location Saved (tap to update)' : 'Use My Current Location'}
            </Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitText}>CREATE DISCOUNT</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
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
  imagePicker: {
    height: 180,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  imagePickerText: { fontSize: 14, color: Colors.textSecondary },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  textarea: { height: 90, paddingTop: 12 },
  row: { flexDirection: 'row' },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  locationBtnActive: { borderColor: Colors.success, backgroundColor: '#F0FFF4' },
  locationText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  locationTextActive: { color: Colors.success },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitText: { color: Colors.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
});
