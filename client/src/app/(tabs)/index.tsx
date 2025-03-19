import React from "react";
import { Text, View, FlatList, Image, TouchableOpacity, RefreshControl, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth-context";
import { LinearGradient } from 'expo-linear-gradient';
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const STORIES = [
  {
    id: "s1",
    username: "Your Story",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    hasStory: false,
  },
  {
    id: "s2",
    username: "emma_watson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    hasStory: true,
  },
  {
    id: "s3",
    username: "tom.holland",
    avatar: "https://randomuser.me/api/portraits/men/86.jpg",
    hasStory: true,
  },
];

const POSTS = [
  {
    id: "1",
    user: {
      id: "u1",
      username: "johndoe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    caption: "Enjoying a beautiful day at the beach! 🏖️ #vacation #summer",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    likes: 128,
    comments: 32,
    createdAt: "2h ago",
  },
  {
    id: "2",
    user: {
      id: "u2",
      username: "janedoe",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    caption: "Just finished this amazing book. Highly recommend! 📚 #reading #booklover",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    likes: 256,
    comments: 48,
    createdAt: "5h ago",
  },
  {
    id: "3",
    user: {
      id: "u3",
      username: "alexsmith",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg",
    },
    caption: "Morning coffee and coding session ☕💻 #developer #coding",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    likes: 97,
    comments: 18,
    createdAt: "7h ago",
  },
];

// Story component
const Story = ({ story }: { story: typeof STORIES[0] }) => {
  return (
    <TouchableOpacity className="items-center mx-2">
      <View className="relative">
        {story.hasStory ? (
          <LinearGradient
            colors={['#FF5F6D', '#FFC371']}
            className="w-18 h-18 rounded-full p-[2px]"
          >
            <View className="bg-white p-[2px] rounded-full">
              <Image
                source={{ uri: story.avatar }}
                className="w-16 h-16 rounded-full"
              />
            </View>
          </LinearGradient>
        ) : (
          <View className="w-18 h-18 rounded-full border-2 border-gray-200 p-[2px]">
            <Image
              source={{ uri: story.avatar }}
              className="w-16 h-16 rounded-full"
            />
            <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-6 h-6 items-center justify-center border-2 border-white">
              <Ionicons name="add" size={16} color="white" />
            </View>
          </View>
        )}
      </View>
      <Text className="text-xs mt-1 text-center">{story.username}</Text>
    </TouchableOpacity>
  );
};

// Enhanced Post component with animations
const Post = ({ post }: { post: typeof POSTS[0] }) => {
  const [liked, setLiked] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleDoubleTap = () => {
    setLiked(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View className="mb-6 border-b border-gray-200 pb-2 bg-white">
      <View className="flex-row items-center p-3">
        <Image 
          source={{ uri: post.user.avatar }} 
          className="w-10 h-10 rounded-full"
        />
        <View className="flex-1 ml-3">
          <Text className="font-bold text-[15px]">{post.user.username}</Text>
          <Text className="text-xs text-gray-500">Original audio</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={handleDoubleTap}>
        <Image 
          source={{ uri: post.image }} 
          className="w-full aspect-square"
          resizeMode="cover"
        />
        {liked && (
          <Animated.View 
            style={{
              position: 'absolute',
              alignSelf: 'center',
              top: '40%',
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Ionicons name="heart" size={80} color="white" />
          </Animated.View>
        )}
      </TouchableOpacity>

      <View className="px-3 pt-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row space-x-4">
            <TouchableOpacity onPress={() => setLiked(!liked)}>
              <Ionicons 
                name={liked ? "heart" : "heart-outline"} 
                size={26} 
                color={liked ? "#FF3B30" : "#374151"} 
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="paper-plane-outline" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <Text className="font-bold mt-2">{post.likes.toLocaleString()} likes</Text>

        <View className="mt-1">
          <Text>
            <Text className="font-bold">{post.user.username}</Text>
            {" "}{post.caption}
          </Text>
        </View>

        <TouchableOpacity>
          <Text className="text-gray-500 mt-1">
            View all {post.comments} comments
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-400 text-xs mt-1">
          {post.createdAt}
        </Text>
      </View>
    </View>
  );
};

export default function Home() {
  const { user, isLoading } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render authentication required state
  if (!user) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-xl text-gray-800 mb-4">Please log in to continue</Text>
        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg"
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text className="text-white font-bold text-lg">Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
          <Text className="text-2xl font-bold" style={{ fontFamily: 'System' }}>SocialApp</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={26} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={26} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={26} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={STORIES}
          renderItem={({ item }) => <Story story={item} />}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-2"
        />
      </View>

      <FlatList
        data={POSTS}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#374151"
          />
        }
      />
    </View>
  );
}
