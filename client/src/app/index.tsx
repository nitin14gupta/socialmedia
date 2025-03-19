import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    // Navigate to auth screen after 2 seconds
    const timer = setTimeout(() => {
      router.replace("/(auth)");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="screen-container items-center justify-center">
      <View className="items-center space-y-4">
        <Text className="text-heading text-black">SocialApp</Text>
        <Text className="text-body text-black">Connect with friends</Text>
      </View>
    </View>
  );
}
