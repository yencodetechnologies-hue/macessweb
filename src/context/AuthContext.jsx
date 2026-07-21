import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  setSelectedApartmentId,
} from '../api/client';
import { fetchCurrentUser, login as loginApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const current = await fetchCurrentUser();
      setUser(current);
      return current;
    } catch {
      clearAuthStorage();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async ({ identifier, password, userType }) => {
    const data = await loginApi({ identifier, password, userType });
    setUser(data.user);
    if (data.user?.apartmentId) {
      setSelectedApartmentId(data.user.apartmentId);
    }
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshUser,
      isAuthenticated: !!user && !!getToken(),
    }),
    [user, loading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function isAdminRole(userType) {
  return userType === 'admin' || userType === 'apartment';
}

export function isUserRole(userType) {
  return userType === 'user' || userType === 'tenant';
}
