import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const REELS = [
  {
    id: "1",
    video: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    user: {
      username: "dancerlife",
      avatar: "https://randomuser.me/api/portraits/women/81.jpg",
      isFollowing: false,
    },
    description: "When the beat drops 🎵 #dance #viral",
    audio: "Original Sound - DancerLife",
    likes: "456K",
    comments: "2,845",
    shares: "1,234",
  },
  {
    id: "2",
    video: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    user: {
      username: "travelgram",
      avatar: "https://randomuser.me/api/portraits/men/35.jpg",
      isFollowing: true,
    },
    description: "Paradise found 🌴 #travel #beach #summer",
    audio: "Summer Vibes - TravelMusic",
    likes: "892K",
    comments: "5,123",
    shares: "3,456",
  },
  {
    id: "3",
    video: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    user: {
      username: "foodie_adventures",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      isFollowing: false,
    },
    description: "Making the perfect pasta 🍝 #cooking #foodie",
    audio: "Cooking Time - FoodSounds",
    likes: "234K",
    comments: "1,845",
    shares: "967",
  },
];

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const ReelItem = ({ item }: { item: typeof REELS[0] }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const heartScale = React.useRef(new Animated.Value(1)).current;

  const handleDoubleTap = () => {
    setIsLiked(true);
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={{ height: WINDOW_HEIGHT, width: WINDOW_WIDTH }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setIsMuted(!isMuted)}
        onLongPress={handleDoubleTap}
        className="flex-1"
      >
        <Image
          source={{ uri: item.video }}
          style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}
          className="absolute"
        />

        <View className="absolute bottom-0 w-full h-60 justify-end bg-black/40">
          {/* User Info and Description */}
          <View className="px-4 mb-6">
            <View className="flex-row items-center">
              <Image
                source={{ uri: item.user.avatar }}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <Text className="text-white font-bold ml-2">{item.user.username}</Text>
              {!item.user.isFollowing && (
                <TouchableOpacity className="ml-2 px-4 py-1 bg-red-500 rounded-full">
                  <Text className="text-white font-semibold">Follow</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-white mt-2">{item.description}</Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="musical-notes" size={16} color="white" />
              <Text className="text-white ml-2">{item.audio}</Text>
            </View>
          </View>
        </View>

        {/* Right Side Actions */}
        <View className="absolute right-4 bottom-20 items-center">
          <TouchableOpacity 
            className="items-center mb-6"
            onPress={() => setIsLiked(!isLiked)}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={32}
                color={isLiked ? "#FF3B30" : "white"}
              />
            </Animated.View>
            <Text className="text-white text-sm mt-1">{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mb-6">
            <Ionicons name="chatbubble-outline" size={32} color="white" />
            <Text className="text-white text-sm mt-1">{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mb-6">
            <Ionicons name="paper-plane-outline" size={32} color="white" />
            <Text className="text-white text-sm mt-1">{item.shares}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mb-6">
            <Ionicons name="bookmark-outline" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <Ionicons name="ellipsis-horizontal" size={32} color="white" />
          </TouchableOpacity>
        </View>

        {/* Mute Indicator */}
        {isMuted && (
          <View className="absolute top-1/2 left-1/2 -ml-8 -mt-8 bg-black/50 rounded-full p-4">
            <Ionicons name="volume-mute" size={32} color="white" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default function ReelsScreen() {
  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-4 pt-12 pb-4">
        <Text className="text-white text-xl font-bold">Reels</Text>
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Reels Feed */}
      <FlatList
        data={REELS}
        renderItem={({ item }) => <ReelItem item={item} />}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={WINDOW_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
}