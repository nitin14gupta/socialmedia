import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/auth-context";
import { z } from "zod";
import Toast from "react-native-toast-message";

// Validation schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { register, isLoading, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user]);

  const validateForm = () => {
    try {
      registerSchema.parse({ username, email, password, confirmPassword });
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

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(username, email, password);
    } catch (error: any) {
      console.error("Registration error:", error);
    }
  };

  // If already authenticated, don't render the register form
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
          <Text className="text-3xl font-bold text-gray-800 mb-2">Create Account</Text>
          <Text className="text-gray-500">Join our social community</Text>
        </View>

        <View className="space-y-4 mb-6">
          <View>
            <Text className="text-gray-600 mb-2">Username</Text>
            <TextInput
              className={`bg-gray-100 p-4 rounded-lg text-gray-800 ${
                errors.username ? "border-2 border-red-500" : ""
              }`}
              placeholder="Choose a username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrors((prev) => ({ ...prev, username: "" }));
              }}
              autoCapitalize="none"
              autoComplete="username"
              editable={!isLoading}
            />
            {errors.username && (
              <Text className="text-red-500 text-sm mt-1">{errors.username}</Text>
            )}
          </View>

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
              placeholder="Create a password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              secureTextEntry
              autoComplete="password-new"
              editable={!isLoading}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
            )}
          </View>

          <View>
            <Text className="text-gray-600 mb-2">Confirm Password</Text>
            <TextInput
              className={`bg-gray-100 p-4 rounded-lg text-gray-800 ${
                errors.confirmPassword ? "border-2 border-red-500" : ""
              }`}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              secureTextEntry
              autoComplete="password-new"
              editable={!isLoading}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          className={`py-4 rounded-lg items-center ${
            isLoading ? "bg-blue-300" : "bg-blue-500"
          }`}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign Up</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity 
            onPress={() => router.push("/(auth)/login")}
            disabled={isLoading}
          >
            <Text className="text-blue-500 font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
