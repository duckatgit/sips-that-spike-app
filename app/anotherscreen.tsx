
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import SliderIndicator from "./SliderIndicator";

const { width, height } = Dimensions.get("window");
const W = (n:any) => (width / 375) * n;
const H = (n:any) => (height / 812) * n;


export default function AnotherScreen() {
  const routes = useRouter();

  const skip = () => {
    routes.push("/test");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>

        {/* TOP SECTION */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.skipBtn} onPress={skip}>
            <Text style={styles.skipText}>Skip &gt;</Text>
          </TouchableOpacity>

          <Image
            source={require("../assets/images/onboarding-women.png")}
            style={styles.womanImg}
            resizeMode="contain"
          />
        </View>

        {/* FOOTER */}
        <View style={styles.footerWrapper}>
          <ImageBackground
            source={require("../assets/images/Subtract.png")}
            resizeMode="stretch"
            style={styles.footerBg}
          >
            <View style={styles.textWrapper}>
              <Text style={styles.title}>
                <Text style={{ color: "#000" }}>Welcome To </Text>
                <Text style={{ color: "#F03745" }}>Sips{"\n"}That Spike</Text>
              </Text>

              <Text style={styles.description}>
                An app that helps you understand{"\n"}how sugary drinks affect your{"\n"}glucose levels and your health.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => routes.push("/secondscreen")}
            >
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
             <SliderIndicator total={3} currentIndex={0} />

          </ImageBackground>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
  },

  /* ---------- TOP SECTION ---------- */
  topSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: H(10),
    paddingBottom: 0,
  },

  skipBtn: {
    position: "absolute",
    top: H(0),
    right: W(20),
    zIndex: 20,
  },

  skipText: {
    fontSize: W(14),
    fontWeight: "600",
    color: "#F03745",
  },

  womanImg: {
    width: "90%",
    height: "100%",
    // objectFit:"cover"
  },

  /* ---------- FOOTER SECTION ---------- */

  footerWrapper: {
    height: H(340),
    width: "100%",
  },

  footerBg: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: H(40),
    alignItems: "center",
    zIndex:20,
    marginTop:H(-60)
    
  },

  textWrapper: {
    marginTop: H(40),
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: W(36),
    lineHeight: H(45),
    textAlign: "center",
    fontWeight: "600",
    marginTop: H(30),
  },

  description: {
    marginTop: H(18),
    fontFamily: "Poppins_500Medium",
    color: "#615253",
    fontSize: W(16),
    lineHeight: H(24),
    textAlign: "center",
  },

  btn: {
    backgroundColor: "#F03745",
    borderRadius: W(30),
    height: H(50),
    width: W(300),
    justifyContent: "center",
    alignItems: "center",
    marginTop: H(20),
  },

  btnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: W(16),
    color: "#fff",
  },
});
