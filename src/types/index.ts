export interface Location {
  lat: number;
  lng: number;
}

export interface Discount {
  id: string;
  title: string;
  description: string;
  discountPercentage?: number;
  fixedDiscount?: number;
  validFrom: string;
  validTo: string;
  location?: Location;
  merchantId: string;
  maxClaims: number;
  claimsCount: number;
  active: boolean;
  imageUrl?: string;
  category?: string;
}

export interface Store {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  lat?: number;
  lng?: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'merchant';
  avatarUrl?: string;
  lat?: number;
  lng?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AnalyticsSummary {
  totalDiscounts: number;
  totalClaims: number;
  activeDiscounts: number;
  conversionRate: number;
  topDiscount: string;
  claimsThisMonth: number;
}
