import React from "react";
import {
  Image,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import Theme from "@/data/constant";
import { useRouter, router } from "expo-router";
import SliderIndicator from "./SliderIndicator";

const { width, height } = Dimensions.get("window");
const W = (n:any) => (width / 375) * n;
const H = (n:any) => (height / 812) * n;
export default function AnotherScreen() {
  const routes = useRouter();

  const skip = () => {
    router.push("/test");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>

        {/* TOP IMAGE */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.skipBtn} onPress={skip}>
            <Text style={styles.skipText}>Skip &gt;</Text>
          </TouchableOpacity>

          <Image
            source={require("../assets/images/fruti.png")}
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
                <Text style={{ color: "#F03745" }}>Learn</Text>
                <Text style={{ color: "#000" }}> & Improve </Text>
              </Text>

              <Text style={styles.description}>
                Learn more about why your health{"\n"} choices matter and how
                your glucose{"\n"} levels can affect your health
              </Text>
            </View>

            <View style={styles.center}>
              <TouchableOpacity style={styles.btn} onPress={skip}>
                <Text style={styles.btnText}>Get Started</Text>
              </TouchableOpacity>

              <SliderIndicator total={3} currentIndex={2} />
            </View>
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

  photo: {
     width: "90%",
    height: "100%",
    marginRight: "-25%",
  },

  /* FOOTER SECTION */
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
    marginTop: H(50),
  },

  description: {
    marginTop: H(18),
    fontFamily: "Poppins_500Medium",
    color: "#615253",
    fontSize: W(16),
    lineHeight: H(24),
    textAlign: "center"
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
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
});
