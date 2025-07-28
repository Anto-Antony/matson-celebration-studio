import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '../types/wedding';

interface WeddingAuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  userId: string | null;
  globalIsLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  logout: () => Promise<void>;
  setUserId: (id: string | null) => void;
}

const WeddingAuthContext = createContext<WeddingAuthContextType | undefined>(undefined);

export const WeddingAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [globalIsLoading, setGlobalIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('wedding_user');
    const storedIsLoggedIn = localStorage.getItem('wedding_isLoggedIn');
    const storedUserId = localStorage.getItem('wedding_userId');
    if (storedUser && storedIsLoggedIn === 'true') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        if (storedUserId) setUserId(storedUserId);
      } catch (e) {
        localStorage.removeItem('wedding_user');
        localStorage.removeItem('wedding_isLoggedIn');
        localStorage.removeItem('wedding_userId');
      }
    }
    setGlobalIsLoading(false);
  }, []);

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ user: User | null; error: string | null }> => {
    setGlobalIsLoading(true);
    const { data, error } = await supabase
      .from('user_profile')
      .select('user_id, bride_name, groom_name, email, phone_number, password')
      .eq('email', email)
      .maybeSingle();

    if (error || !data) {
      setGlobalIsLoading(false);
      return { user: null, error: 'No user found' };
    }

    if (data.password !== password) {
      setGlobalIsLoading(false);
      return { user: null, error: 'Incorrect password' };
    }

    const customUser: User = {
      id: data.user_id,
      email: data.email,
      isAuthenticated: true,
      bride_name: data.bride_name,
      groom_name: data.groom_name,
      phone_number: data.phone_number,
    };
    setUser(customUser);
    setIsLoggedIn(true);
    localStorage.setItem('wedding_user', JSON.stringify(customUser));
    localStorage.setItem('wedding_isLoggedIn', 'true');
    localStorage.setItem('wedding_userId', data.user_id);
    setUserId(data.user_id);
    setGlobalIsLoading(false);
    return { user: customUser, error: null };
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setUser(null);
    setIsLoggedIn(false);
    setGlobalIsLoading(false);
    localStorage.removeItem('wedding_user');
    localStorage.removeItem('wedding_isLoggedIn');
    localStorage.removeItem('wedding_userId');
    setUserId(null);
  }, []);

  const value = {
    user,
    isLoggedIn,
    userId,
    globalIsLoading,
    login,
    logout,
    setUserId,
  };

  return (
    <WeddingAuthContext.Provider value={value}>
      {children}
    </WeddingAuthContext.Provider>
  );
};

export const useWeddingAuth = () => {
  const context = useContext(WeddingAuthContext);
  if (context === undefined) {
    throw new Error('useWeddingAuth must be used within a WeddingAuthProvider');
  }
  return context;
}; 