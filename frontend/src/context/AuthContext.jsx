import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [token, setToken] = useState(authService.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('nawi_user', JSON.stringify(res.data));
          }
        } catch {
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }
    verifyUser();
  }, [token]);

  const login = async (email, password, role) => {
    const res = await authService.login(email, password, role);
    if (res.success && res.data) {
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const hasRole = (allowedRoles = []) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return allowedRoles.includes(user.role);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    hasRole,
    isAdmin: user?.role === 'ADMIN',
    isEngineer: user?.role === 'TEST_ENGINEER' || user?.role === 'ADMIN',
    isReviewer: user?.role === 'REVIEWER' || user?.role === 'ADMIN',
    isOfficer: user?.role === 'LABORATORY_OFFICER' || user?.role === 'ADMIN',
    isViewer: user?.role === 'VIEWER'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
