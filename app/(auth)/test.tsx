import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Test() {
  const router = useRouter();

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log(" Token from storage:", token);

        if (token) {
          router.replace("/(tab)/home"); 
        } else {
          router.replace("/signin"); 
        }
      } catch (error) {
        console.log("Error reading token:", error);
        router.replace("/signin");
      }
    };

    checkUserLogin();
  }, []);

  // nothing shown — instant redirect
  return <View />;
}
