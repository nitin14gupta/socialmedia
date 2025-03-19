import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: "#3b82f6", // blue-500
      tabBarInactiveTintColor: "#6b7280", // gray-500
      tabBarShowLabel: true,
      tabBarStyle: {
        paddingBottom: 5,
        paddingTop: 5,
      },
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="explore" 
        options={{
          title: "Explore",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
          ),
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="create-post" 
        options={{
          title: "Post",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={28} color={color} />
          ),
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="reels" 
        options={{
          title: "Reels",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "play-circle" : "play-circle-outline"} size={24} color={color} />
          ),
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
          headerShown: false,
        }} 
      />
    </Tabs>
  );
}
