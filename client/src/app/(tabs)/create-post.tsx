import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FILTERS = [
  { id: "original", name: "Original" },
  { id: "clarendon", name: "Clarendon" },
  { id: "gingham", name: "Gingham" },
  { id: "moon", name: "Moon" },
  { id: "lark", name: "Lark" },
  { id: "reyes", name: "Reyes" },
  { id: "juno", name: "Juno" },
  { id: "slumber", name: "Slumber" },
  { id: "crema", name: "Crema" },
  { id: "ludwig", name: "Ludwig" },
];

export default function CreatePost() {
  const [caption, setCaption] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("original");
  const [selectedImage] = React.useState("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f");

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">New Post</Text>
        <TouchableOpacity>
          <Text className="text-blue-500 font-semibold text-lg">Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Image Preview */}
        <View className="aspect-square">
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute bottom-4 right-4 flex-row space-x-4">
            <TouchableOpacity className="bg-black/50 p-2 rounded-full">
              <Ionicons name="images-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-black/50 p-2 rounded-full">
              <Ionicons name="camera-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View className="py-4 border-t border-gray-200">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                className={`items-center mr-6 ${
                  selectedFilter === filter.id ? "opacity-100" : "opacity-50"
                }`}
              >
                <View className="w-20 h-20 rounded-md bg-gray-200 mb-2">
                  <Image
                    source={{ uri: selectedImage }}
                    className="w-full h-full rounded-md"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-sm">{filter.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Caption */}
        <View className="p-4 border-t border-gray-200">
          <View className="flex-row">
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              className="w-10 h-10 rounded-full"
            />
            <TextInput
              placeholder="Write a caption..."
              multiline
              className="flex-1 ml-3 text-base"
              value={caption}
              onChangeText={setCaption}
            />
          </View>
        </View>

        {/* Additional Options */}
        <View className="border-t border-gray-200">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <Text className="text-base">Tag People</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <Text className="text-base">Add Location</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <Text className="text-base">Add Music</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <Text className="text-base">Advanced Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}