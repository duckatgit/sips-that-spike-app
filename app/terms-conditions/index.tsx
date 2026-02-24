import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Notification() {
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Terms & Conditions",
      headerTitleAlign: "left",
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <View style={styles.backIconWrapper}>
            <Ionicons name="chevron-back-outline" size={26} color="#636363" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const currentYear = new Date().getFullYear();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.mainHeading}>
        TERMS OF USE AGREEMENT & PRIVACY POLICY{"\n\n"}
      </Text>

      <Text style={styles.paragraph}>
        This Agreement governs the use of all products, software, services,
        applications, and related content provided by Sips That Spike ("Sips
        That Spike," "we," "us," or "our"). By clicking "Agree" or using the
        Service, you confirm that you have read, understood, and accepted these
        Terms of Use and our Privacy Policy.
        {"\n\n"}
      </Text>

      <Text style={styles.paragraph}>
        This app is intended for informational and educational purposes only. It
        does not provide medical advice, diagnosis, treatment, or professional
        healthcare recommendations. Users should consult a qualified healthcare
        professional for any medical concerns.
        {"\n\n"}
      </Text>

      <Text style={styles.sectionTitle}>Use of Device Features</Text>
      <Text style={styles.paragraph}>
        The app may request access to your device camera solely to scan product
        barcodes in order to retrieve publicly available nutritional
        information. No photos or videos are stored or transmitted by the app.
        {"\n\n"}
      </Text>

      <Text style={styles.sectionTitle}>Third-Party Services</Text>
      <Text style={styles.paragraph}>
        Certain features rely on third-party data providers, including the Open
        Food Facts public database, to display nutritional information.
        {"\n\n"}
      </Text>

      <Text style={styles.sectionTitle}>Privacy & Account Control</Text>
      <Text style={styles.paragraph}>
        Your use of the Service is also governed by our Privacy Policy, which
        explains how we collect, use, and protect your information. You may stop
        using the Service or delete your account at any time through the app
        settings.
        {"\n\n"}
      </Text>

      <Text style={styles.paragraph}>
        The Service and all related information are provided "as is" and "as
        available," without warranties of any kind.
      </Text>

      <Text style={styles.footer}>
        © Sips That Spike {currentYear}. All rights reserved.
      </Text>
    </ScrollView>
  );
}

/* ================== CSS (StyleSheet) ================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 16,
    paddingBottom: 100,
  },

  header: {
    backgroundColor: "#fff",
    elevation: 0,
    shadowOpacity: 0,
  },

  headerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#636363",
    marginLeft: 10,
  },

  backBtn: {
    marginLeft: 16,
    marginTop: -3,
  },

  backIconWrapper: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFEAEA",
  },

  mainHeading: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#222",
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
    textAlign: "left",
    fontFamily: "Poppins_400Regular",
  },

  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    color: "#222",
    marginTop: 12,
  },

  footer: {
    marginTop: 24,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
});
