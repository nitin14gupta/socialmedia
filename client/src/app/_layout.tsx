import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { AuthProvider } from "../context/auth-context";


export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <StatusBar style="auto" />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

