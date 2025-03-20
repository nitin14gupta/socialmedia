import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

// Use localhost for iOS simulator, 10.0.2.2 for Android emulator
const API_URL = Platform.OS === 'ios' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api';

// Define user type
type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
} | null;

// Define auth context type
type AuthContextType = {
  user: User;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Load stored authentication data
  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await fetchUser(storedToken);
      }
    } catch (error) {
      console.error("Error loading auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data
  const fetchUser = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUser(response.data);
    } catch (error: any) {
      console.error("Error fetching user:", error.response?.data || error.message);
      await logout();
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting registration with:', { username, email });
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });

      console.log('Registration response:', response.data);
      const { token: authToken, user: userData } = response.data;
      
      await AsyncStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
      
      Toast.show({
        type: "success",
        text1: "Welcome!",
        text2: "Your account has been created successfully",
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      console.error('Registration error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      const message = error.response?.data?.error || error.message || "Registration failed. Please try again.";
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', { email });
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      console.log('Login response:', response.data);
      const { token: authToken, user: userData } = response.data;
      
      await AsyncStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
      
      Toast.show({
        type: "success",
        text1: "Welcome back!",
        text2: `Logged in as ${userData.username}`,
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      console.error('Login error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      const message = error.response?.data?.error || error.message || "Login failed. Please try again.";
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
      setUser(null);
      
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });

      router.replace("/(auth)");
    } catch (error) {
      console.error("Error during logout:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to logout. Please try again.",
      });
    }
  };

  // Create axios interceptor for token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, isLoading, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
