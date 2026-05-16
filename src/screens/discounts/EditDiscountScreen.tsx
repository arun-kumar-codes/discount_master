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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { DiscountsStackParamList } from '../../navigation/AppNavigator';

type Route = RouteProp<DiscountsStackParamList, 'EditDiscount'>;
type Nav = NativeStackNavigationProp<DiscountsStackParamList, 'EditDiscount'>;

export default function EditDiscountScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { discount: original } = route.params;
  const { updateDiscount } = useApp();

  const [title, setTitle] = useState(original.title);
  const [description, setDescription] = useState(original.description);
  const [percentage, setPercentage] = useState(original.discountPercentage?.toString() ?? '');
  const [maxClaims, setMaxClaims] = useState(original.maxClaims.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !percentage || !maxClaims) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    const pct = parseFloat(percentage);
    const max = parseInt(maxClaims, 10);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      Alert.alert('Validation Error', 'Discount % must be between 1 and 100.');
      return;
    }
    if (isNaN(max) || max <= 0) {
      Alert.alert('Validation Error', 'Max claims must be a positive number.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    updateDiscount({
      ...original,
      title: title.trim(),
      description: description.trim(),
      discountPercentage: pct,
      maxClaims: max,
    });

    setIsSubmitting(false);
    Alert.alert('Success', 'Discount updated successfully!', [
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
          <Text style={styles.headerTitle}>Edit Discount</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Discount Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          {/* Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          {/* Percentage + Max claims */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.flex]}>
              <Text style={styles.label}>Discount % *</Text>
              <TextInput
                style={styles.input}
                value={percentage}
                onChangeText={setPercentage}
                keyboardType="numeric"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={[styles.fieldGroup, styles.flex]}>
              <Text style={styles.label}>Max Claims *</Text>
              <TextInput
                style={styles.input}
                value={maxClaims}
                onChangeText={setMaxClaims}
                keyboardType="numeric"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          {/* Active status info */}
          <View style={styles.statusCard}>
            <Ionicons
              name={original.active ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={original.active ? Colors.success : Colors.error}
            />
            <Text style={styles.statusText}>
              Status: {original.active ? 'Active' : 'Inactive'}
            </Text>
            <Text style={styles.statusClaims}>
              {original.claimsCount} / {original.maxClaims} claims used
            </Text>
          </View>

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
              <Text style={styles.submitText}>SAVE CHANGES</Text>
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
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  statusText: { fontSize: 14, fontWeight: '600', color: Colors.text, flex: 1 },
  statusClaims: { fontSize: 13, color: Colors.textSecondary },
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
