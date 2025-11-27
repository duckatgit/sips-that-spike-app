import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
export default function Notification() {
  const navigation = useNavigation();
const router=useRouter()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Terms & Conditions",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
      headerTitleStyle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 18,
        color: "#636363",
        marginleft:"10@ms"
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={{ marginLeft: 16, marginTop: -3 }}
        >
          <View style={{width:28,height:28,alignItems:"center",justifyContent:"center",borderRadius:"10",borderWidth:1,borderColor:"#FFEAEA"}}>

          <Ionicons name="chevron-back-outline" size={26} color="#636363" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Terms & Conditions</Text>
    </View>
  );
}















