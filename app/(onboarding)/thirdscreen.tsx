import { router, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SliderIndicator from "../../components/SliderIndicator";
import { styles } from "./thirdscreen.styles";
const { width, height } = Dimensions.get("window");
const W = (n:any) => (width / 375) * n;
const H = (n:any) => (height / 812) * n;
export default function AnotherScreen() {
  const routes = useRouter();

  const skip = () => {
    router.replace("/test");
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
            source={require("../../assets/images/fruti.png")}
            style={styles.photo}
            resizeMode="contain"
          />
        </View>

        {/* FOOTER */}
        <View style={styles.footerWrapper}>
          <ImageBackground
            source={require("../../assets/images/Subtract.png")}
            resizeMode="stretch"
            style={styles.footerBg}
          >
            <View style={styles.textWrapper}>
              <Text style={styles.title}>
                <Text style={{ color: "#F03745" }}>Learn</Text>
                <Text style={{ color: "#000" }}> & Improve </Text>
              </Text>

              <Text style={styles.description}>
                Learn more about why your health{"\n"} choices are and how
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


