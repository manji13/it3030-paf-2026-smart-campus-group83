import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { member4Api } from '../api/member4Api';
import { useAuthContext } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuthContext();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const response = await member4Api.getUnreadCount();
      setUnreadCount(response.data.data.unreadCount || 0);
    } catch {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    refreshUnreadCount();
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      unreadCount,
      refreshUnreadCount,
      setUnreadCount
    }),
    [unreadCount]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
