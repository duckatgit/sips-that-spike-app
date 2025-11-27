

import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { View, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
  });

 

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider >
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]} >
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            animation: "none",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tab)" />
          <Stack.Screen name="splashscreen" />
          <Stack.Screen name="anotherscreen" />
          <Stack.Screen name="secondscreen" />
           <Stack.Screen name="thirdscreen" />

        </Stack>

        <Toast position="top" topOffset={50} visibilityTime={3000} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
