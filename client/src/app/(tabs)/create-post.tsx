import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../../context/auth-context";
import axios from "axios";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
const API_URL = Platform.OS === "ios" ? "http://localhost:5000/api" : "http://10.0.2.2:5000/api";

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
  const { user } = useAuth();
  const [caption, setCaption] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("original");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to pick an image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to take a photo using camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Camera permission needed",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to upload and share the post
  const handleShare = async () => {
    if (!selectedImage) {
      Toast.show({
        type: "error",
        text1: "Please select an image",
      });
      return;
    }

    if (!caption.trim()) {
      Toast.show({
        type: "error",
        text1: "Please add a caption",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Creating form data
      const formData = new FormData();
      formData.append("caption", caption.trim());

      // Extracting file extension
      const uriParts = selectedImage.split(".");
      const fileType = uriParts[uriParts.length - 1];

      // Appending image with proper formatting
      formData.append("image", {
        uri: Platform.OS === "ios" ? selectedImage.replace("file://", "") : selectedImage,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      console.log("Uploading post with:", {
        caption: caption.trim(),
        imageUri: selectedImage,
      });

      // API Call
      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data) => data,
      });

      console.log("Post created successfully:", response.data);

      Toast.show({
        type: "success",
        text1: "Post created successfully!",
      });

      // Navigate to profile
      router.push("/(tabs)/profile");
    } catch (error) {
      console.error("Error creating post:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error creating post",
        text2: error.response?.data?.error || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">New Post</Text>
        <TouchableOpacity onPress={handleShare} disabled={isLoading || !selectedImage}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <Text className={`text-lg font-semibold ${selectedImage ? "text-blue-500" : "text-blue-300"}`}>
              Share
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Image Preview */}
        <View className="aspect-square">
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-gray-100 items-center justify-center">
              <Text className="text-gray-400">No image selected</Text>
            </View>
          )}
          <View className="absolute bottom-4 right-4 flex-row space-x-4">
            <TouchableOpacity className="bg-black/50 p-2 rounded-full" onPress={pickImage}>
              <Ionicons name="images-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-black/50 p-2 rounded-full" onPress={takePhoto}>
              <Ionicons name="camera-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        {selectedImage && (
          <View className="py-4 border-t border-gray-200">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
              {FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => setSelectedFilter(filter.id)}
                  className={`items-center mr-6 ${selectedFilter === filter.id ? "opacity-100" : "opacity-50"}`}
                >
                  <View className="w-20 h-20 rounded-md bg-gray-200 mb-2">
                    <Image source={{ uri: selectedImage }} className="w-full h-full rounded-md" resizeMode="cover" />
                  </View>
                  <Text className="text-sm">{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Caption */}
        <View className="p-4 border-t border-gray-200">
          <View className="flex-row">
            <Image source={{ uri: user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg" }} className="w-10 h-10 rounded-full" />
            <TextInput
              placeholder="Write a caption..."
              multiline
              className="flex-1 ml-3 text-base"
              value={caption}
              onChangeText={setCaption}
              editable={!isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
