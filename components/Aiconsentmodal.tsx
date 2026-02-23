import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// ─── CONFIG — Edit these to match your actual AI service ──────────────────────
const AI_SERVICE_NAME = "Open Food Facts";
const APP_NAME = "Sips That Spike";
const DATA_SENT = [
  "Scanned barcode number (to retrieve drink nutritional info)",
];
const DATA_NOT_SENT = [
  "Your name or email address",
  "Phone number",
  "Location data",
  "Any personal account information",
];
const STORAGE_KEY = "ai_consent_given"; // AsyncStorage key
// ──────────────────────────────────────────────────────────────────────────────

const AIConsentModal = ({ visible, onAllow, onDecline }: any) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 16;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(300);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleAllow = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, "true");
    } catch (e) {
      console.warn("Could not save consent:", e);
    }
    onAllow();
  };

  const handleDecline = () => {
    onDecline();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDecline}
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: fadeAnim, paddingBottom: bottomPadding + 16 },
        ]}
      >
        {/* Modal Card */}
        <Animated.View
          style={[styles.card, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🤖</Text>
            </View>
            <Text style={styles.title}>Data & Privacy Notice</Text>
            <Text style={styles.subtitle}>
              When you scan a drink, {APP_NAME} sends the barcode number to{" "}
              {AI_SERVICE_NAME} to retrieve nutritional information such as
              sugar content, calories, and serving size.
            </Text>
          </View>

          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
          >
            {/* Data Sent */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                📤 Data sent to Open Food Facts
              </Text>
              {DATA_SENT.map((item, i) => (
                <View key={i} style={styles.dataRow}>
                  <View style={styles.dot} />
                  <Text style={styles.dataText}>{item}</Text>
                </View>
              ))}
            </View>
            {/* Divider */}
            <View style={styles.divider} />
            {/* Data NOT Sent */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                🔒 The following is NEVER sent to Open Food Facts:
              </Text>
              {DATA_NOT_SENT.map((item, i) => (
                <View key={i} style={styles.dataRow}>
                  <View style={[styles.dot, styles.dotGreen]} />
                  <Text style={styles.dataText}>{item}</Text>
                </View>
              ))}
            </View>
            {/* Purpose */}
            <View style={styles.purposeBox}>
              <Text style={styles.purposeText}>
                📋 <Text style={styles.bold}>Purpose:</Text> This data is used
                only to present nutritional insights based on publicly available
                food data.
              </Text>
            </View>
            {/* Third Party Note */}
            <Text style={styles.thirdPartyNote}>
              Nutritional data is sourced from the{" "}
              <Text style={styles.bold}>Open Food Facts</Text> public database.
              {"\n"}
              Data Source: world.openfoodfacts.org{"\n"}
              Open Food Facts is a non-profit open database and maintains data
              protection standards consistent with our{" "}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDecline}
              activeOpacity={0.7}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.allowButton}
              onPress={handleAllow}
              activeOpacity={0.7}
            >
              <Text style={styles.allowText}>Allow & Continue</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// ─── Helper: Check consent status (call this anywhere before AI actions) ───────
export const checkAIConsent = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value === "true";
  } catch {
    return false;
  }
};

// ─── Helper: Reset consent (useful for testing or if user revokes in settings) ─
export const resetAIConsent = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Could not reset consent:", e);
  }
};

export default AIConsentModal;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 26,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555555",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  scrollArea: {
    maxHeight: 340,
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#E8453C", // your app's red color
    marginTop: 5,
    marginRight: 10,
  },
  dotGreen: {
    backgroundColor: "#2ECC71",
  },
  dataText: {
    fontSize: 13,
    color: "#444444",
    flex: 1,
    lineHeight: 19,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  purposeBox: {
    backgroundColor: "#FFF8F8",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#E8453C",
  },
  purposeText: {
    fontSize: 13,
    color: "#444444",
    lineHeight: 19,
  },
  bold: {
    fontWeight: "700",
  },
  thirdPartyNote: {
    fontSize: 12,
    color: "#888888",
    lineHeight: 17,
    marginBottom: 8,
    textAlign: "center",
  },
  link: {
    color: "#E8453C",
    textDecorationLine: "underline",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#DDDDDD",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  declineText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666666",
  },
  allowButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#E8453C",
    alignItems: "center",
    shadowColor: "#E8453C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  allowText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
