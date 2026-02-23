import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SliderIndicator from "../../components/SliderIndicator";
import { styles } from "./secondscreen.styles";
const { width, height } = Dimensions.get("window");
const W = (n:any) => (width / 375) * n;
const H = (n:any) => (height / 812) * n;
export default function ThirdScreen() {
  const routes = useRouter();
  const skip = () => routes.replace("/test");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>

        {/* TOP IMAGE */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.skipBtn} onPress={skip}>
            <Text style={styles.skipText}>Skip &gt;</Text>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/cola-can.png")}
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
                <Text style={{ color: "#000" }}>How Does </Text>
                <Text style={{ color: "#F03745" }}>Sips{"\n"}That Spike Work</Text>
              </Text>

              <View style={styles.row}>
                <View style={styles.box}>
                  <View style={styles.circle}>
                    <Image source={require("../../assets/images/Group1.png")} />
                  </View>
                  <Text style={styles.texts}>Scan Drinks</Text>
                </View>

                <View style={styles.box}>
                  <View style={styles.circle}>
                    <Image source={require("../../assets/images/Group2.png")} />
                  </View>
                  <Text style={styles.texts}>Track your daily intake</Text>
                </View>
              </View>

              <View style={styles.singleRow}>
                <View style={styles.boxWide}>
                  <View style={styles.circle}>
                    <Image source={require("../../assets/images/Group3.png")} />
                  </View>
                  <Text style={styles.texts}>Get your glucose{"\n"}spike score</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => routes.replace("/thirdscreen")}
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


