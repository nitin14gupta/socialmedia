import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "../../context/auth-context";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";

const API_URL = Platform.OS === 'ios' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api';

interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
}

interface Post {
  id: string;
  image: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
}

export default function PostDetails() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      setPost(response.data);
    } catch (error: any) {
      console.error('Error fetching post:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: 'Error fetching post',
        text2: error.response?.data?.error || 'Please try again',
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!post) return;
    
    try {
      const response = await axios.post(`${API_URL}/posts/${post.id}/like`);
      setPost(prev => prev ? { ...prev, likes: response.data.likes } : null);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error liking post',
        text2: error.response?.data?.error || 'Please try again',
      });
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || !post) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/posts/${post.id}/comment`, {
        text: comment.trim(),
      });
      setPost(prev => prev ? { ...prev, comments: response.data.comments } : null);
      setComment("");
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error adding comment',
        text2: error.response?.data?.error || 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPost();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Post not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="p-4 flex-row items-center justify-between border-b border-gray-200">
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={() => router.push(`/(tabs)/profile/${post.user.id}`)}
          >
            <Image
              source={{ uri: post.user.avatar || "https://randomuser.me/api/portraits/men/32.jpg" }}
              className="w-8 h-8 rounded-full"
            />
            <Text className="ml-2 font-semibold">{post.user.username}</Text>
          </TouchableOpacity>
          {user?.id === post.user.id && (
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        {/* Image */}
        <Image
          source={{ uri: post.image }}
          className="w-full aspect-square"
          resizeMode="cover"
        />

        {/* Actions */}
        <View className="p-4">
          <View className="flex-row items-center mb-2">
            <TouchableOpacity 
              className="mr-4"
              onPress={handleLike}
            >
              <Ionicons 
                name={post.likes.includes(user?.id || '') ? "heart" : "heart-outline"} 
                size={24} 
                color={post.likes.includes(user?.id || '') ? "#ef4444" : "#000"} 
              />
            </TouchableOpacity>
            <TouchableOpacity className="mr-4">
              <Ionicons name="chatbubble-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <Text className="font-semibold mb-1">{post.likes.length} likes</Text>
          
          {/* Caption */}
          <Text className="mb-2">
            <Text className="font-semibold">{post.user.username}</Text>{" "}
            {post.caption}
          </Text>

          {/* Comments */}
          {post.comments.length > 0 && (
            <View className="mt-2">
              {post.comments.map((comment) => (
                <View key={comment._id} className="flex-row mb-2">
                  <Text>
                    <Text className="font-semibold">{comment.user.username}</Text>{" "}
                    {comment.text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text className="text-gray-500 text-sm mt-1">
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View className="p-4 border-t border-gray-200 flex-row items-center">
        <TextInput
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
          className="flex-1 mr-2 p-2 bg-gray-100 rounded-full"
          editable={!isSubmitting}
        />
        <TouchableOpacity 
          onPress={handleComment}
          disabled={!comment.trim() || isSubmitting}
        >
          <Text className={`font-semibold ${!comment.trim() || isSubmitting ? 'text-blue-300' : 'text-blue-500'}`}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 