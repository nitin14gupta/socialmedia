import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth-context";
import { router } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";

const API_URL = Platform.OS === 'ios' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api';

interface Post {
  _id: string;
  image: string;
  caption: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
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

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      console.log('Fetching feed posts');
      const response = await axios.get(`${API_URL}/posts/feed`);
      console.log('Fetched feed posts:', response.data);
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
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
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

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Please log in to view your feed</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold">Feed</Text>
        <TouchableOpacity onPress={() => router.push('/create-post')}>
          <Ionicons name="add-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {posts.length === 0 ? (
            <View className="py-8 items-center">
              <Ionicons name="images-outline" size={48} color="#666" />
              <Text className="mt-2 text-gray-600">No posts in your feed</Text>
              <Text className="text-gray-500">Follow people to see their posts</Text>
            </View>
          ) : (
            posts.map((post) => (
              <View key={post._id} className="border-b border-gray-200">
                <TouchableOpacity 
                  className="p-4 flex-row items-center"
                  onPress={() => router.push(`/profile/${post.user._id}`)}
                >
                  <Image
                    source={{ uri: post.user.avatar || "https://randomuser.me/api/portraits/men/32.jpg" }}
                    className="w-8 h-8 rounded-full"
                  />
                  <Text className="ml-2 font-semibold">{post.user.username}</Text>
                </TouchableOpacity>
                
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
                        name={post.likes.includes(user._id) ? "heart" : "heart-outline"} 
                        size={24} 
                        color={post.likes.includes(user._id) ? "#ef4444" : "#000"} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className="mr-4"
                      onPress={() => router.push(`/post/${post._id}`)}
                    >
                      <Ionicons name="chatbubble-outline" size={24} color="#000" />
                    </TouchableOpacity>
                  </View>
                  
                  <Text className="font-semibold mb-1">{post.likes.length} likes</Text>
                  <Text>
                    <Text 
                      className="font-semibold"
                      onPress={() => router.push(`/profile/${post.user._id}`)}
                    >
                      {post.user.username}
                    </Text>{" "}
                    {post.caption}
                  </Text>
                  
                  {post.comments.length > 0 && (
                    <TouchableOpacity 
                      className="mt-1"
                      onPress={() => router.push(`/post/${post._id}`)}
                    >
                      <Text className="text-gray-500">
                        View all {post.comments.length} comments
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  <Text className="text-gray-500 text-sm mt-1">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
