import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { member4Api } from '../api/member4Api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sch_token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('sch_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  const saveSession = useCallback((nextToken, userPayload) => {
    setToken(nextToken);
    setUser(userPayload);
    localStorage.setItem('sch_token', nextToken);
    localStorage.setItem('sch_user', JSON.stringify(userPayload));
  }, []);

  const clearSession = useCallback(() => {
    setToken('');
    setUser(null);
    localStorage.removeItem('sch_token');
    localStorage.removeItem('sch_user');
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem('sch_token')) {
      setLoading(false);
      return;
    }
    try {
      const response = await member4Api.getProfile();
      const profile = response.data.data;
      setUser(profile);
      localStorage.setItem('sch_user', JSON.stringify(profile));
    } catch (error) {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const loginWithMockGoogle = async (payload) => {
    const response = await member4Api.mockGoogleLogin(payload);
    const authData = response.data.data;
    saveSession(authData.token, {
      id: authData.userId,
      email: authData.email,
      name: authData.name,
      pictureUrl: authData.pictureUrl,
      roles: authData.roles
    });
    return authData;
  };

  const handleOAuthCallback = async (callbackToken) => {
    localStorage.setItem('sch_token', callbackToken);
    setToken(callbackToken);
    await refreshProfile();
  };

  const hasAnyRole = useCallback(
    (roles = []) => {
      if (!roles.length) return true;
      const userRoles = user?.roles || [];
      return roles.some((role) => userRoles.includes(role));
    },
    [user]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      loginWithMockGoogle,
      handleOAuthCallback,
      logout: clearSession,
      hasAnyRole
    }),
    [token, user, loading, clearSession, hasAnyRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
