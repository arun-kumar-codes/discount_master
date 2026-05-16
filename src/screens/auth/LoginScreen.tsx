import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    const e = { email: '', password: '' };
    if (!email.trim()) e.email = 'Email is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    await login(email.trim(), password);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Sign in to Discounts</Text>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputRow, errors.email ? styles.inputErr : null]}>
              <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {!!errors.email && <Text style={styles.errText}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputRow, errors.password ? styles.inputErr : null]}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {!!errors.password && <Text style={styles.errText}>{errors.password}</Text>}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.btnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  header: { marginTop: 64, marginBottom: 48, alignItems: 'center' },
  title: { fontSize: 30, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginTop: 6 },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 14,
    height: 52,
  },
  inputErr: { borderColor: Colors.error },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: Colors.text },
  eyeBtn: { padding: 4 },
  errText: { fontSize: 12, color: Colors.error, marginTop: 4 },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  registerText: { color: Colors.textSecondary, fontSize: 14 },
  registerLink: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
});
