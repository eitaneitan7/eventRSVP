import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Event } from "@/utils/contentModel";

interface EventCardProps {
  event: Event;
  index: number;
  animate?: boolean;
  isRsvped?: boolean;
  onPress?: () => void;
}

const EventCard = ({
  event,
  index,
  animate = true,
  isRsvped,
  onPress,
}: EventCardProps) => {
  const translateY = useSharedValue(animate ? 50 : 0);
  const opacity = useSharedValue(animate ? 0 : 1);

  useEffect(() => {
    if (animate) {
      translateY.value = withDelay(index * 50, withSpring(0));
      opacity.value = withDelay(index * 50, withSpring(1));
    }
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {isRsvped && (
          <View style={styles.checkIcon}>
            <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          </View>
        )}
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.details}>
          📍 {event.location} | 🗓 {new Date(event.date).toLocaleDateString()}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  checkIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

export default EventCard;
