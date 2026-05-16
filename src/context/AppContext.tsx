import React, { createContext, useContext, useState, useCallback } from 'react';
import { Discount, Notification } from '../types';
import { MOCK_DISCOUNTS, MOCK_NOTIFICATIONS } from '../constants/mockData';

interface AppContextType {
  discounts: Discount[];
  favorites: string[];
  notifications: Notification[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  addDiscount: (discount: Discount) => void;
  updateDiscount: (discount: Discount) => void;
  deleteDiscount: (id: string) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [discounts, setDiscounts] = useState<Discount[]>(MOCK_DISCOUNTS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);

  const addDiscount = useCallback((discount: Discount) => {
    setDiscounts((prev) => [discount, ...prev]);
  }, []);

  const updateDiscount = useCallback((updated: Discount) => {
    setDiscounts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  }, []);

  const deleteDiscount = useCallback((id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        discounts,
        favorites,
        notifications,
        isFavorite,
        toggleFavorite,
        addDiscount,
        updateDiscount,
        deleteDiscount,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
