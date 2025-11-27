import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface SlideCardProps {
  item: {
    image: any;
    title: string;
    subtitle?: string;
    description: string;
  };
  onNext?: () => void;
  onSkip?: () => void;
  isLast?: boolean;
}

export default function SlideCard({ item, onNext, onSkip, isLast }: SlideCardProps) {
  return (
    <View style={[styles.slide, { width }]}>
      {/* Skip button */}

      {/* Image */}
      <View style={styles.back}>
      <TouchableOpacity onPress={onSkip} style={styles.skipContainer}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>

      {/* Title and subtitle */}
      <Text style={styles.title}>
        Welcome To <Text style={styles.highlight}>{item.title}</Text>
      </Text>
      <Text style={styles.description}>{item.description}</Text>

      {/* Next button */}
      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Text style={styles.nextText}>{isLast ? "Get Started" : "Next"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
    backgroundColor: "#fff",
  },
  skipContainer: {
    alignSelf: "flex-end",
    paddingRight: 25,
    paddingTop: 10,
  },
  skipText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "500",
  },
  image: {
    width: width * 0.8,
    height: height * 0.45,
    position: "absolute",
    right:0,
    bottom:0
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#222",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  highlight: {
    color: "#3b4ef8",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  nextButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    borderRadius: 30,
    width: width * 0.85,
    alignItems: "center",
    marginBottom: 30,
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  back: {
  width: width * 0.98,
  height: height * 0.5,
  backgroundColor: "#f2f2f2",
  borderBottomLeftRadius: "15%",
  borderBottomRightRadius: "15%",
  
  alignSelf: "center",
  overflow: "hidden",
},

});
