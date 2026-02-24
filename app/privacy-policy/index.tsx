import { Privicydata } from "@/utils/Privicy";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Privacy() {
  const navigation = useNavigation();
  const [expandedIndex, setExpandedIndex] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Privacy & Security",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
      headerTitleStyle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 18,
        color: "#636363",
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginLeft: 16 }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#FFEAEA",
            }}
          >
            <Ionicons name="chevron-back-outline" size={26} color="#636363" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
        // marginBottom: 70,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Poppins_600SemiBold",
            fontSize: 18,
            marginBottom: 7,
            color: "#222",
          }}
        >
          Privacy Policy
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#555",
            fontFamily: " Poppins_400Regular",
            lineHeight: 20,
            textAlign: "left",
            marginBottom: 10,
          }}
        >
          In addition to the terms of use in these pages, a Privacy Policy is
          also incorporated into this Agreement. The Privacy Policy sets out
          what information we obtain from Users and what we do with it.
        </Text>
        {Array.isArray(Privicydata) && Privicydata.length > 0 ? (
          Privicydata.map((item, index) => {
            const question = Object.values(item)[0];
            const answer = Object.values(item)[1];
            const isOpen = expandedIndex === index;

            return (
              <View
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: "#eee",
                  borderRadius: 8,
                  marginBottom: 12,
                  padding: 12,
                }}
              >
                <TouchableOpacity
                //@ts-ignore
                  onPress={() => setExpandedIndex(isOpen ? null : index)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontFamily: "Poppins_600SemiBold", flex: 1 }}>
                    {question}
                  </Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                  />
                </TouchableOpacity>

                {isOpen && (
                  <Text
                    style={{
                      marginTop: 10,
                      color: "#666",
                      lineHeight: 20,
                    }}
                  >
                    {answer}
                  </Text>
                )}
              </View>
            );
          })
        ) : (
          <Text>No Privacy Data Available</Text>
        )}
      </ScrollView>
    </View>
  );
}
