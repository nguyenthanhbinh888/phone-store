import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import { authService, TOKEN_KEY } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authNotification: string | null;
  clearNotification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [authNotification, setAuthNotification] = useState<string | null>(null);

  const clearNotification = useCallback(() => setAuthNotification(null), []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setAuthNotification('Bạn đã đăng xuất khỏi tài khoản.');
    setTimeout(() => {
      setAuthNotification(null);
    }, 4000);
  }, []);

  // Fetch current user if token exists on boot
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          setToken(storedToken);
        }
      } catch (err) {
        console.warn('Phiên đăng nhập đã hết hạn hoặc không hợp lệ:', err);
        if (isMounted) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (request: LoginRequest) => {
    const authRes = await authService.login(request);
    localStorage.setItem(TOKEN_KEY, authRes.token);
    setToken(authRes.token);

    // Fetch full user details
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    setIsAuthModalOpen(false);
    setAuthNotification(`Chào mừng trở lại, ${currentUser.fullName}!`);
    setTimeout(() => {
      setAuthNotification(null);
    }, 4000);
  };

  const register = async (request: RegisterRequest) => {
    const authRes = await authService.register(request);
    localStorage.setItem(TOKEN_KEY, authRes.token);
    setToken(authRes.token);

    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    setIsAuthModalOpen(false);
    setAuthNotification(`Đăng ký thành công! Chào mừng bạn, ${currentUser.fullName}!`);
    setTimeout(() => {
      setAuthNotification(null);
    }, 4000);
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        authNotification,
        clearNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
