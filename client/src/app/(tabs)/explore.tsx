import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EXPLORE_DATA = [
  {
    id: "1",
    type: "image",
    media: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    likes: "456K",
  },
  {
    id: "2",
    type: "video",
    media: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    likes: "1.2M",
    duration: "0:45",
  },
  {
    id: "3",
    type: "image",
    media: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    likes: "89K",
  },
  {
    id: "4",
    type: "reel",
    media: "https://images.unsplash.com/photo-1596516109370-29001ec8ec36",
    likes: "2.1M",
    duration: "0:30",
  },
  {
    id: "5",
    type: "image",
    media: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd",
    likes: "543K",
  },
  {
    id: "6",
    type: "video",
    media: "https://images.unsplash.com/photo-1576828831022-ca0ea7f0ac95",
    likes: "892K",
    duration: "1:15",
  },
];

const CATEGORIES = [
  "For You",
  "Travel",
  "Fashion",
  "Music",
  "Food",
  "Art",
  "Sports",
  "Beauty",
];

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 3;

const ExploreItem = ({ item }: { item: typeof EXPLORE_DATA[0] }) => {
  return (
    <TouchableOpacity 
      className="relative" 
      style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }}
    >
      <Image
        source={{ uri: item.media }}
        style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }}
        className="bg-gray-200"
      />
      {(item.type === "video" || item.type === "reel") && (
        <View className="absolute top-2 right-2">
          <Ionicons 
            name={item.type === "reel" ? "play-circle" : "play"}
            size={24} 
            color="white" 
          />
          <Text className="text-white text-xs absolute top-7 right-0">
            {item.duration}
          </Text>
        </View>
      )}
      <View className="absolute bottom-2 left-2 flex-row items-center">
        <Ionicons name="heart" size={14} color="white" />
        <Text className="text-white text-xs ml-1">{item.likes}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = React.useState("For You");

  const renderHeader = () => (
    <View className="mb-4">
      <View className="px-4 py-2 flex-row items-center bg-white border-b border-gray-200">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Ionicons name="search" size={20} color="#666" />
          <Text className="ml-2 text-gray-500">Search</Text>
        </View>
      </View>
      
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-2 py-3 bg-white"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item)}
            className={`px-4 py-2 rounded-full mx-1 ${
              selectedCategory === item ? "bg-black" : "bg-gray-100"
            }`}
          >
            <Text
              className={`${
                selectedCategory === item ? "text-white" : "text-gray-800"
              } font-medium`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={EXPLORE_DATA}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => <ExploreItem item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
