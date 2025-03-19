import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const USER_DATA = {
  username: "john.doe",
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  bio: "📸 Photography enthusiast\n🌍 Travel lover\n💻 Software Engineer",
  posts: 248,
  followers: "24.5K",
  following: 420,
  website: "www.johndoe.com",
};

const POSTS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    likes: "2,345",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    likes: "4,567",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    likes: "6,789",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1596516109370-29001ec8ec36",
    likes: "8,901",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd",
    likes: "1,234",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1576828831022-ca0ea7f0ac95",
    likes: "3,456",
  },
];

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 3;

const ProfileHeader = () => {
  return (
    <View className="bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold">{USER_DATA.username}</Text>
          <Ionicons name="chevron-down" size={20} color="#000" style={{ marginLeft: 4 }} />
        </View>
        <View className="flex-row space-x-4">
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={26} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={26} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Info */}
      <View className="p-4">
        <View className="flex-row items-center">
          <Image
            source={{ uri: USER_DATA.avatar }}
            className="w-20 h-20 rounded-full"
          />
          <View className="flex-1 flex-row justify-around ml-4">
            <View className="items-center">
              <Text className="text-lg font-bold">{USER_DATA.posts}</Text>
              <Text className="text-gray-600">Posts</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">{USER_DATA.followers}</Text>
              <Text className="text-gray-600">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">{USER_DATA.following}</Text>
              <Text className="text-gray-600">Following</Text>
            </View>
          </View>
        </View>

        <View className="mt-4">
          <Text className="font-bold">{USER_DATA.name}</Text>
          <Text className="text-gray-600 mt-1">{USER_DATA.bio}</Text>
          <Text className="text-blue-500 mt-1">{USER_DATA.website}</Text>
        </View>

        <View className="flex-row mt-4 space-x-2">
          <TouchableOpacity className="flex-1 bg-gray-100 py-2 rounded-md">
            <Text className="text-center font-semibold">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-100 py-2 rounded-md">
            <Text className="text-center font-semibold">Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-10 bg-gray-100 items-center justify-center rounded-md">
            <Ionicons name="person-add-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          <View className="items-center mr-4">
            <View className="w-16 h-16 rounded-full border-2 border-gray-300 items-center justify-center">
              <Ionicons name="add" size={30} color="#000" />
            </View>
            <Text className="text-xs mt-1">New</Text>
          </View>
          {["Travel", "Food", "Pets", "Memories"].map((highlight) => (
            <View key={highlight} className="items-center mr-4">
              <View className="w-16 h-16 rounded-full bg-gray-200" />
              <Text className="text-xs mt-1">{highlight}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Tabs */}
      <View className="flex-row border-t border-gray-200">
        <TouchableOpacity className="flex-1 items-center py-2 border-t-2 border-black">
          <Ionicons name="grid-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2">
          <Ionicons name="play-circle-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2">
          <Ionicons name="person-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Profile() {
  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={POSTS}
        numColumns={3}
        ListHeaderComponent={ProfileHeader}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }}
            className="relative"
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }}
              className="bg-gray-200"
            />
            <View className="absolute bottom-2 left-2 flex-row items-center">
              <Ionicons name="heart" size={14} color="white" />
              <Text className="text-white text-xs ml-1">{item.likes}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
