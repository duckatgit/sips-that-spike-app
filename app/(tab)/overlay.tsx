import React, { useState } from "react";
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Overlay() {
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [layout, setLayout] = useState<{ width: number; height: number } | null>(null);

  // ✅ Only draw after layout exists
  if (!layout) {
    return (
      <View
        style={styles.overlayContainer}
        onLayout={(e) => setLayout(e.nativeEvent.layout)}
      />
    );
  }

  const { width, height } = layout;
  const innerSize = Math.min(width * 0.75, 300);

  const outer = rrect(rect(0, 0, width, height), 0, 0);
  const inner = rrect(
    rect(width / 2 - innerSize / 2, height / 2 - innerSize / 2, innerSize, innerSize),
    40,
    40
  );

  return (
    <View
      style={styles.overlayContainer}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
    >
      <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
        <DiffRect inner={inner} outer={outer} color="black" opacity={0.6} />
      </Canvas>

      <TouchableOpacity
        style={[styles.closeButton, { top: Platform.OS === "ios" ? 50 : 30 }]}
        onPress={() => router.push("/(tab)/scan")}
      >
        <Ionicons name="close-circle" size={36} color="#fff" />
      </TouchableOpacity>

      {/* <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Align the barcode inside the box</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  bottomTextContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  bottomText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});
