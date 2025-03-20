import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth-context";
import { router } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";

const API_URL = Platform.OS === 'ios' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api';

interface Post {
  _id: string;
  image: string;
  caption: string;
  likes: string[];
  comments: Array<{
    _id: string;
    text: string;
    user: {
      _id: string;
      username: string;
      avatar: string;
    };
  }>;
  createdAt: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchPosts = async () => {
    if (!user?.id) return;
    
    try {
      console.log('Fetching posts for user:', user.id);
      const response = await axios.get(`${API_URL}/posts/user/${user.id}`);
      console.log('Fetched posts:', response.data);
      setPosts(response.data);
    } catch (error: any) {
      console.error('Error fetching posts:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: 'Error fetching posts',
        text2: error.response?.data?.error || 'Please try again',
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user?.id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: response.data.likes } : post
      ));
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error liking post',
        text2: error.response?.data?.error || 'Please try again',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error logging out',
        text2: 'Please try again',
      });
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-white"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Header */}
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-2xl font-bold">{user.username}</Text>
            {user.bio && (
              <Text className="text-gray-600 mt-1">{user.bio}</Text>
            )}
          </View>
          <TouchableOpacity 
            className="bg-gray-100 p-2 rounded-full"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <Image
            source={{ uri: user.avatar || "https://randomuser.me/api/portraits/men/32.jpg" }}
            className="w-20 h-20 rounded-full"
          />
          <View className="flex-1 flex-row justify-around ml-4">
            <View className="items-center">
              <Text className="text-lg font-bold">{posts.length}</Text>
              <Text className="text-gray-600">Posts</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">{user.followers?.length || 0}</Text>
              <Text className="text-gray-600">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">{user.following?.length || 0}</Text>
              <Text className="text-gray-600">Following</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          className="mt-4 p-2 border border-gray-300 rounded-md"
          onPress={() => router.push('/(tabs)/edit-profile')}
        >
          <Text className="text-center font-semibold">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* View Mode Toggle */}
      <View className="flex-row justify-center border-t border-gray-200">
        <TouchableOpacity 
          className={`flex-1 p-2 items-center ${viewMode === 'grid' ? 'border-b-2 border-black' : ''}`}
          onPress={() => setViewMode('grid')}
        >
          <Ionicons 
            name="grid-outline" 
            size={24} 
            color={viewMode === 'grid' ? '#000' : '#666'} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 p-2 items-center ${viewMode === 'list' ? 'border-b-2 border-black' : ''}`}
          onPress={() => setViewMode('list')}
        >
          <Ionicons 
            name="list-outline" 
            size={24} 
            color={viewMode === 'list' ? '#000' : '#666'} 
          />
        </TouchableOpacity>
      </View>

      {/* Posts */}
      {isLoading ? (
        <View className="py-8">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : posts.length === 0 ? (
        <View className="py-8 items-center">
          <Ionicons name="images-outline" size={48} color="#666" />
          <Text className="mt-2 text-gray-600">No posts yet</Text>
          <TouchableOpacity 
            className="mt-4 bg-blue-500 px-4 py-2 rounded-md"
            onPress={() => router.push('/(tabs)/create-post')}
          >
            <Text className="text-white font-semibold">Create First Post</Text>
          </TouchableOpacity>
        </View>
      ) : viewMode === 'grid' ? (
        <View className="flex-row flex-wrap">
          {posts.map((post) => (
            <TouchableOpacity 
              key={post._id}
              className="w-1/3 aspect-square p-0.5"
              onPress={() => router.push(`/(tabs)/post/${post._id}`)}
            >
              <Image
                source={{ uri: post.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View>
          {posts.map((post) => (
            <View key={post._id} className="border-b border-gray-200">
              <View className="p-4 flex-row items-center">
                <Image
                  source={{ uri: user.avatar || "https://randomuser.me/api/portraits/men/32.jpg" }}
                  className="w-8 h-8 rounded-full"
                />
                <Text className="ml-2 font-semibold">{user.username}</Text>
              </View>
              <Image
                source={{ uri: post.image }}
                className="w-full aspect-square"
                resizeMode="cover"
              />
              <View className="p-4">
                <View className="flex-row items-center mb-2">
                  <TouchableOpacity 
                    className="mr-4"
                    onPress={() => handleLike(post._id)}
                  >
                    <Ionicons 
                      name={post.likes.includes(user.id) ? "heart" : "heart-outline"} 
                      size={24} 
                      color={post.likes.includes(user.id) ? "#ef4444" : "#000"} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="mr-4"
                    onPress={() => router.push(`/(tabs)/post/${post._id}`)}
                  >
                    <Ionicons name="chatbubble-outline" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                <Text className="font-semibold mb-1">{post.likes.length} likes</Text>
                <Text>
                  <Text className="font-semibold">{user.username}</Text>{" "}
                  {post.caption}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
