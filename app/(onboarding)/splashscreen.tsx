import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';

export default function SplashScreen() {

  useEffect(() => {
    setTimeout(() => {
      router.replace("/anotherscreen");
    }, 2000);
  }, []);

  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF6F1" }} edges={[ "top"]}>
      <LinearGradient
        colors={[
          "#FCB8A3",
          "#FCC4AD",
          "#FFDCC9",
          "#FFF0E4",
          "#FFFFFF"
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.container}
      >
        <View style={styles.main}>
          <Image
            source={require("../../assets/images/spl.png")}
            style={styles.logo}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },

  main: {
    flex: 1,
    justifyContent: "center",  // centers vertically
    alignItems: "center",       // centers horizontally
  },

  logo: {
    width: "150@ms",
    height: "150@ms",
    resizeMode: "contain",
  },
});
