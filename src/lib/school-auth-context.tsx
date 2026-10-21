'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SchoolUser {
  id: string;
  name: string;
  email: string;
  role: string;
  jobTitle?: string;
  schoolId?: string;
  schoolName?: string;
  urn?: string;
  postcode?: string;
  townCity?: string;
  headteacherName?: string;
  organisationId?: string;
  organisationName?: string;
}

interface SchoolAuthContextType {
  user: SchoolUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>;
  register: (data: any) => Promise<{ success: boolean; error?: string; verificationCode?: string }>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendCode: (email: string) => Promise<{ success: boolean; error?: string; verificationCode?: string }>;
  logout: () => void;
}

const SchoolAuthContext = createContext<SchoolAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'a4s_school_user';

export function SchoolAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SchoolUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load school user session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/school/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        return {
          success: false,
          error: data.error,
          requiresVerification: data.requiresVerification,
        };
      }

      setUser(data.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: 'A network error occurred. Please try again.' };
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/school/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.success) {
        return { success: false, error: data.error };
      }

      return {
        success: true,
        verificationCode: data.verificationCode,
      };
    } catch {
      return { success: false, error: 'A network error occurred during registration.' };
    }
  };

  const verifyCode = async (email: string, code: string) => {
    try {
      const res = await fetch('/api/auth/school/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!data.success) {
        return { success: false, error: data.error };
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Failed to verify code.' };
    }
  };

  const resendCode = async (email: string) => {
    try {
      const res = await fetch('/api/auth/school/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return {
        success: data.success,
        error: data.error,
        verificationCode: data.verificationCode,
      };
    } catch {
      return { success: false, error: 'Failed to resend verification code.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SchoolAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verifyCode,
        resendCode,
        logout,
      }}
    >
      {children}
    </SchoolAuthContext.Provider>
  );
}

export function useSchoolAuth() {
  const context = useContext(SchoolAuthContext);
  if (!context) {
    throw new Error('useSchoolAuth must be used within a SchoolAuthProvider');
  }
  return context;
}
