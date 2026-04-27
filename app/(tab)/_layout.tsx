import { getuserbyid } from "@/service/Api";
import { userEvent } from "@/utils/events";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";

interface UserData {
  name: string;
  email: string;
  image: string;
}

export default function TabLayout() {
  const router = useRouter();
  const [data, setData] = useState<UserData>({
    name: "",
    email: "",
    image: "",
  });
  const [scan, setScan] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const getData = async () => {
    try {
      let response: any = await getuserbyid();
      const user = response?.data?.getUserById;

      setData({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        image: user.image,
      });
    } catch (err) {
      console.log("Error loading user:", err);
    }
  };

  // Handle navigation for bottom tabs and scan/profile
  const handlePress = (screen: string) => {
    if (screen === "scan") setScan(true);
    else setScan(false);

    router.push(`/(tab)/${screen}` as any);
  };

  useEffect(() => {
    getData();

    const listener = (updatedUser: UserData) => {
      setData(updatedUser);
    };
    userEvent.on("profileUpdated", listener);

    return () => {
      userEvent.off("profileUpdated", listener);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "700",
          color: "#1B1919",
          fontFamily: "Poppins_600SemiBold",
        },
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 0,
          shadowOpacity: 0,
          height: 90,
        },
        headerRight: () => (
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => handlePress("profile")}>
              {data.image ? (
                <Image
                  source={{ uri: data.image }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImage}>
                  <Image
                    source={require("../../assets/images/blankdp.png")}
                    style={styles.profileImage1}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
        ),
      }}
      tabBar={(props) => (
        <CustomTabBar {...props} handlePress={handlePress} scan={scan} />
      )}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: () => (
            <View>
              <Text
                style={styles.headerTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {data?.name
                  ? data.name.length > 20
                    ? data.name.slice(0, 10) + "..."
                    : data.name
                  : ""}
              </Text>
              <Text style={styles.headerSubtitle}>
                Let's track your sugar today
              </Text>
              {/*<TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text>
                  <Text style={{ textDecorationLine: "none" }}>Note: </Text>
                  <Text
                    style={{ textDecorationLine: "underline", color: "blue" }}
                  >
                    Disclaimer & Data Source
                  </Text>
                </Text>
              </TouchableOpacity>*/}

              <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <ScrollView>
                      <Text style={styles.modalTitle}>Disclaimer</Text>

                      <Text style={styles.modalText}>
                        This application is provided for informational and
                        educational purposes only. The content displayed in the
                        app is not intended to provide medical advice,
                        diagnosis, treatment, or healthcare recommendations.
                      </Text>

                      <Text style={styles.modalText}>
                        Nutritional information shown in this app is sourced
                        from the Open Food Facts public database and may be
                        incomplete or inaccurate. Users should verify
                        information independently when necessary.
                      </Text>

                      <Text
                        style={styles.linkText}
                        onPress={() =>
                          Linking.openURL("https://world.openfoodfacts.org/")
                        }
                      >
                        Data provided by Open Food Facts —
                        https://world.openfoodfacts.org/
                      </Text>

                      <Text style={styles.modalText}>
                        Any scores, labels, or insights presented in the app are
                        based solely on nutritional data and are intended for
                        general informational use only. They should not be
                        interpreted as medical, health, or clinical evaluations.
                      </Text>
                    </ScrollView>

                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          ),
        }}
      />
      <Tabs.Screen name="log" options={{ title: "Log" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Drink Scanner",
          headerShown: true,
        }}
      />
      <SafeAreaView edges={["bottom"]}></SafeAreaView>
    </Tabs>
  );
}

interface CustomTabBarProps extends BottomTabBarProps {
  handlePress: (screen: string) => void;
  scan: boolean;
}

function CustomTabBar({ state, handlePress, scan }: CustomTabBarProps) {
  const activeRoute = state.routeNames[state.index];

  const tabs = [
    { name: "home", label: "Home", icon: "home-outline" },
    { name: "log", label: "Log", icon: "book-outline" },
    { name: "learn", label: "Learn", icon: "school-outline" },
    { name: "profile", label: "Profile", icon: "person-outline" },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const focused = activeRoute === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => handlePress(tab.name)}
              style={[
                styles.tabItem,
                { backgroundColor: focused ? "#F63E4C" : "transparent" },
              ]}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={focused ? "#fff" : "#444"}
              />
              <Text
                style={[styles.label, { color: focused ? "#fff" : "#444" }]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.scanContainer}>
        <View style={styles.scanWrapper}>
          <TouchableOpacity
            style={[styles.scanButton, scan && { backgroundColor: "#F63E4C" }]}
            activeOpacity={0.85}
            onPress={() => handlePress("scan")}
          >
            <AntDesign name="scan" size={20} color={scan ? "white" : "black"} />
            <Text style={[styles.label, { color: scan ? "white" : "black" }]}>
              Scan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    width: "100%",
    height: "80@ms",
    position: "absolute",
    bottom: "0@ms",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "8@ms",
    paddingBottom: "8@ms",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F9F4F1",
    borderRadius: "40@ms",
    paddingVertical: "10@ms",
    paddingHorizontal: "10@ms",
    width: "300@ms",
    borderColor: "#FFEBDF",
    alignItems: "center",
    height: "66@ms",
    justifyContent: "space-evenly",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "6@ms",
    paddingHorizontal: "1@ms",
    width: "55@ms",
    borderRadius: "40@ms",
  },
  label: {
    fontSize: "10@ms",
    marginTop: "4@ms",
    fontWeight: "400",
  },
  scanContainer: {
    alignItems: "center",
  },
  scanWrapper: {
    padding: "8@ms",
    backgroundColor: "#FFF6F1",
    borderRadius: "60@ms",
    width: "66@ms",
    height: "66@ms",
    borderWidth: 1,
    borderColor: "#FFEBDF",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "47@ms",
    width: "55@ms",
    height: "45@ms",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: "16@ms",
    marginRight: "16@ms",
  },
  profileImage: {
    width: "36@ms",
    height: "36@ms",
    borderRadius: "18@ms",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage1: {
    width: "43@ms",
    height: "43@ms",
    borderRadius: "18@ms",
    resizeMode: "cover",
  },
  headerTitle: {
    fontSize: "20@ms",
    fontWeight: "700",
    color: "#1B1919",
    fontFamily: "Poppins_600SemiBold",
  },
  headerSubtitle: {
    fontSize: "18@ms",
    color: "#75748E",
    fontFamily: "Poppins_400Regular",
    marginTop: "2@ms",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 10 },
  linkText: {
    fontSize: 16,
    color: "#007AFF",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  closeButton: { marginTop: 10, alignSelf: "center", padding: 10 },
  closeText: { fontSize: 16, color: "#007AFF", fontWeight: "bold" },
  disclaimerText: { marginTop: 8 },
});
