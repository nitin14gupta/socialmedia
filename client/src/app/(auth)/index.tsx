import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

export default function Auth() {
  // Navigate to login page
  const handleLoginPress = () => {
    router.push("/(auth)/login");
  };

  // Navigate to register page
  const handleRegisterPress = () => {
    router.push("/(auth)/register");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <View className="items-center mb-10">
        <Text className="text-3xl font-bold text-blue-500 mb-2">SocialApp</Text>
        <Text className="text-gray-500 text-center mb-8">
          Connect with friends and share your moments
        </Text>
      </View>

      <View className="w-full space-y-4">
        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-full w-full"
          onPress={handleLoginPress}
        >
          <Text className="text-white text-center font-bold text-lg">
            Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white border border-blue-500 py-3 rounded-full w-full"
          onPress={handleRegisterPress}
        >
          <Text className="text-blue-500 text-center font-bold text-lg">
            Create New Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
