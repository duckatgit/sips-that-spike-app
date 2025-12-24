import React from "react";
import { View, StyleSheet } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

interface SliderIndicatorProps {
  total: number;     // total slides
  currentIndex: number; // active slide index (0,1,2)
}

export default function SliderIndicator({ total, currentIndex }: SliderIndicatorProps) {
  console.log("total,currindex", total, currentIndex);
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
  
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "8@ms",
    marginTop: "20@ms",
  },
  dot: {
    width: "22@ms",
    height: "6@ms",
    borderRadius: "3@ms",
  },
  activeDot: {
     width: "50@ms",
    backgroundColor: "#353386", // dark blue highlight
  },
  inactiveDot: {
    backgroundColor: "#D5D4FB", // light color
  },
});
