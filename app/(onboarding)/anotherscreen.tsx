
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
import { styles } from "./anotherscreen.styles";
const { width, height } = Dimensions.get("window");
const W = (n:any) => (width / 375) * n;
const H = (n:any) => (height / 812) * n;


export default function AnotherScreen() {
  const routes = useRouter();

  const skip = () => {
    routes.replace("/test");
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
            source={require("../../assets/images/onboarding-women.png")}
       
            style={styles.womanImg}
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
                <Text style={{ color: "#000" }}>Welcome To </Text>
                <Text style={{ color: "#F03745" }}>Sips{"\n"}That Spike</Text>
              </Text>

              <Text style={styles.description}>
                An app that helps you understand{"\n"}how sugary drinks affect your{"\n"}glucose levels and your health.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => routes.replace("/secondscreen")}
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

