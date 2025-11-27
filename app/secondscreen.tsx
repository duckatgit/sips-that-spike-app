import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import Theme from "@/data/constant";
import { useRouter } from "expo-router";
import SliderIndicator from "./SliderIndicator";

const { width, height } = Dimensions.get("window");
const W = (n:any) => (width / 375) * n;
const H = (n:any) => (height / 812) * n;
export default function ThirdScreen() {
  const routes = useRouter();
  const skip = () => routes.push("/test");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>

        {/* TOP IMAGE */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.skipBtn} onPress={skip}>
            <Text style={styles.skipText}>Skip &gt;</Text>
          </TouchableOpacity>

          <Image
            source={require("../assets/images/cola-can.png")}
            style={styles.photo}
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
                <Text style={{ color: "#000" }}>How Does </Text>
                <Text style={{ color: "#F03745" }}>Sips{"\n"}That Spike Work</Text>
              </Text>

              <View style={styles.row}>
                <View style={styles.box}>
                  <View style={styles.circle}>
                    <Image source={require("../assets/images/Group1.png")} />
                  </View>
                  <Text style={styles.texts}>Scan Drinks</Text>
                </View>

                <View style={styles.box}>
                  <View style={styles.circle}>
                    <Image source={require("../assets/images/Group2.png")} />
                  </View>
                  <Text style={styles.texts}>Track your daily intake</Text>
                </View>
              </View>

              <View style={styles.singleRow}>
                <View style={styles.boxWide}>
                  <View style={styles.circle}>
                    <Image source={require("../assets/images/Group3.png")} />
                  </View>
                  <Text style={styles.texts}>Get your glucose{"\n"}spike score</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => routes.push("/thirdscreen")}
            >
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>

            <SliderIndicator total={3} currentIndex={1} />
          </ImageBackground>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF6F1",
  },

  container: {
    flex: 1,
  },

  /* TOP SECTION */
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
    color: "#F03745"
  },

  photo: {
   width: "90%",
    height: "100%",
    marginBottom: H(-13),
  },

  /* FOOTER */
  footerWrapper: {
    height: H(450),
    width: "100%",
  },

  footerBg: {
      flex: 1,
    width: "100%",
    // justifyContent: "space-between",
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
    marginTop: H(50),
  },

  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: "20@vs",
    paddingHorizontal: "10@ms",
  },

  box: {
    width: "45%",
    flexDirection: "row",
    alignItems: "center",
    padding: "10@ms",
    borderRadius: "10@ms",
    backgroundColor: "#F6F7FE",
    gap: "10@ms",
  },

  boxWide: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    padding: "10@ms",
    borderRadius: "10@ms",
    backgroundColor: "#F6F7FE",
    gap: "10@ms",
  },

  singleRow: {
    width: "100%",
    alignItems: "center",
    marginTop: "10@vs",
  },

  circle: {
    width: "45@ms",
    height: "45@ms",
    borderRadius: "45@ms",
    backgroundColor: "#FFE8E3",
    justifyContent: "center",
    alignItems: "center",
  },

  texts: {
    fontSize: "13@ms",
    fontFamily: "Poppins_500Medium",
    color: "#494862",
    flexShrink: 1,
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
