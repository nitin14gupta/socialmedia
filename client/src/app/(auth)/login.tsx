import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/auth-context";
import Toast from "react-native-toast-message";
import { z } from "zod";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login, isLoading, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user]);

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
    } catch (error: any) {
      // Error handling is done in auth context with Toast
      console.error("Login error:", error);
    }
  };

  // If already authenticated, don't render the login form
  if (user) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1 p-6">
        <View className="pt-12 pb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-500 mb-4">← Back</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome back</Text>
          <Text className="text-gray-500">Sign in to continue</Text>
        </View>

        <View className="space-y-4 mb-6">
          <View>
            <Text className="text-gray-600 mb-2">Email</Text>
            <TextInput
              className={`bg-gray-100 p-4 rounded-lg text-gray-800 ${
                errors.email ? "border-2 border-red-500" : ""
              }`}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
            )}
          </View>

          <View>
            <Text className="text-gray-600 mb-2">Password</Text>
            <TextInput
              className={`bg-gray-100 p-4 rounded-lg text-gray-800 ${
                errors.password ? "border-2 border-red-500" : ""
              }`}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              secureTextEntry
              autoComplete="password"
              editable={!isLoading}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          className={`py-4 rounded-lg items-center ${
            isLoading ? "bg-blue-300" : "bg-blue-500"
          }`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Log In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity 
            onPress={() => router.push("/(auth)/register")}
            disabled={isLoading}
          >
            <Text className="text-blue-500 font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
