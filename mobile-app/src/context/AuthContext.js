import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for stored token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          // Verify token is still valid
          try {
            const response = await api.getMe();
            if (response.success) {
              setUser(response.data);
              setIsAuthenticated(true);
            } else {
              await AsyncStorage.removeItem('userToken');
            }
          } catch (error) {
            // Token invalid, clear it
            await AsyncStorage.removeItem('userToken');
          }
        }
      } catch (e) {
        console.log('Auth check failed', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    if (username && password) {
      try {
        const response = await api.login(username, password);
        
        if (response.success && response.data.token) {
          await AsyncStorage.setItem('userToken', response.data.token);
          setUser(response.data);
          setIsAuthenticated(true);
          return true;
        }
        return false;
      } catch (e) {
        console.log('Login failed', e);
        return false;
      }
    }
    return false;
    return false;
  };

  const register = async (username, password, email, phone, role) => {
    try {
      const response = await api.register(username, password, email, phone, role);
      
      if (response.success && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        setUser(response.data);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      console.log('Registration failed', e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsAuthenticated(false);
      setUser(null);
    } catch (e) {
      console.log('Logout failed', e);
    }
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, isLoading, user, login, logout, register}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
