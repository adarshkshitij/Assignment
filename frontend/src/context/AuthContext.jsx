import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { tokenStorage } from '../lib/api';
import { getApiError, isValidEmail, sanitizeEmail, sanitizeText } from '../utils/form';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = tokenStorage.get();

      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (error) {
          tokenStorage.clear();
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const register = async (name, email, password, role, adminCode) => {
    try {
      const cleanName = sanitizeText(name);
      const cleanEmail = sanitizeEmail(email);
      const cleanAdminCode = adminCode.trim();

      if (!cleanName) {
        return { success: false, error: 'Name is required' };
      }

      if (!isValidEmail(cleanEmail)) {
        return { success: false, error: 'Enter a valid email address' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      if (role === 'admin' && !cleanAdminCode) {
        return { success: false, error: 'Admin code is required for admin registration' };
      }

      const res = await api.post('/auth/register', {
        name: cleanName,
        email: cleanEmail,
        password,
        role,
        adminCode: cleanAdminCode,
      });

      tokenStorage.set(res.data.token);
      setUser(res.data.user);

      return { success: true, message: 'Account created successfully' };
    } catch (error) {
      return { success: false, error: getApiError(error, 'Registration failed') };
    }
  };

  const login = async (email, password) => {
    try {
      const cleanEmail = sanitizeEmail(email);

      if (!isValidEmail(cleanEmail)) {
        return { success: false, error: 'Enter a valid email address' };
      }

      if (!password.trim()) {
        return { success: false, error: 'Password is required' };
      }

      const res = await api.post('/auth/login', {
        email: cleanEmail,
        password,
      });

      tokenStorage.set(res.data.token);
      setUser(res.data.user);

      return { success: true, message: 'Signed in successfully' };
    } catch (error) {
      return { success: false, error: getApiError(error, 'Invalid credentials') };
    }
  };

  const logout = () => {
    tokenStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
