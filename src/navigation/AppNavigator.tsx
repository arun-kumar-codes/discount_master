import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/colors';
import { Discount } from '../types';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Discounts
import DiscountsListScreen from '../screens/discounts/DiscountsListScreen';
import DiscountDetailScreen from '../screens/discounts/DiscountDetailScreen';
import CreateDiscountScreen from '../screens/discounts/CreateDiscountScreen';
import EditDiscountScreen from '../screens/discounts/EditDiscountScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

// Stores
import StoresScreen from '../screens/stores/StoresScreen';
import StoreDiscountsScreen from '../screens/stores/StoreDiscountsScreen';

// Tabs
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';

// ─── Param Lists ──────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type DiscountsStackParamList = {
  DiscountsList: undefined;
  DiscountDetail: { discountId: string };
  CreateDiscount: undefined;
  EditDiscount: { discount: Discount };
  Notifications: undefined;
};

export type StoresStackParamList = {
  StoresList: undefined;
  StoreDiscounts: { storeId: string; storeName: string };
  StoreDiscountDetail: { discountId: string };
};

export type FavoritesStackParamList = {
  FavoritesList: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Analytics: undefined;
};

export type MainTabParamList = {
  DiscountsTab: undefined;
  StoresTab: undefined;
  FavoritesTab: undefined;
  ProfileTab: undefined;
};

// ─── Stack Navigators ─────────────────────────────────────────────────────────

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const DiscountsStack = createNativeStackNavigator<DiscountsStackParamList>();
const StoresStack = createNativeStackNavigator<StoresStackParamList>();
const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const stackScreenOptions = {
  headerShown: false,
};

function DiscountsNavigator() {
  return (
    <DiscountsStack.Navigator screenOptions={stackScreenOptions}>
      <DiscountsStack.Screen name="DiscountsList" component={DiscountsListScreen} />
      <DiscountsStack.Screen name="DiscountDetail" component={DiscountDetailScreen} />
      <DiscountsStack.Screen name="CreateDiscount" component={CreateDiscountScreen} />
      <DiscountsStack.Screen name="EditDiscount" component={EditDiscountScreen} />
      <DiscountsStack.Screen name="Notifications" component={NotificationsScreen} />
    </DiscountsStack.Navigator>
  );
}

function StoresNavigator() {
  return (
    <StoresStack.Navigator screenOptions={stackScreenOptions}>
      <StoresStack.Screen name="StoresList" component={StoresScreen} />
      <StoresStack.Screen name="StoreDiscounts" component={StoreDiscountsScreen} />
      <StoresStack.Screen name="StoreDiscountDetail" component={DiscountDetailScreen} />
    </StoresStack.Navigator>
  );
}

function FavoritesNavigator() {
  return (
    <FavoritesStack.Navigator screenOptions={stackScreenOptions}>
      <FavoritesStack.Screen name="FavoritesList" component={FavoritesScreen} />
    </FavoritesStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={stackScreenOptions}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Analytics" component={AnalyticsScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 11, marginBottom: 2 },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
            DiscountsTab: ['pricetag', 'pricetag-outline'],
            StoresTab: ['storefront', 'storefront-outline'],
            FavoritesTab: ['heart', 'heart-outline'],
            ProfileTab: ['person', 'person-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline'];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DiscountsTab" component={DiscountsNavigator} options={{ title: 'Discounts' }} />
      <Tab.Screen name="StoresTab" component={StoresNavigator} options={{ title: 'Stores' }} />
      <Tab.Screen name="FavoritesTab" component={FavoritesNavigator} options={{ title: 'Favorites' }} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? (
        <MainTabs />
      ) : (
        <AuthStack.Navigator screenOptions={stackScreenOptions}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
