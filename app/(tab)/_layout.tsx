
import React, { useCallback, useEffect, useState } from "react";
import { Tabs, useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { ScaledSheet } from "react-native-size-matters";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { getuserbyid } from "@/service/Api";
import { userEvent } from "@/utils/events";

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

  const getData = async () => {
    try {
      let response = await getuserbyid();
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

    router.push(`/(tab)/${screen}`as any) ;
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
    }, [])
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
      tabBar={(props) => <CustomTabBar {...props} handlePress={handlePress} scan={scan} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: () => (
            <View>
              <Text style={styles.headerTitle} numberOfLines={1}
  ellipsizeMode="tail">
                {data?.name
                  ? data.name.length > 20
                    ? data.name.slice(0, 10) + "..."
                    : data.name
                  : ""}
              </Text>
              <Text style={styles.headerSubtitle}>
                Let's track your sugar today
              </Text>
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
          title: "AI Drink Scanner",
          headerShown: true,
        }}
      />
     <SafeAreaView edges={['bottom']}></SafeAreaView>
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
              <Text style={[styles.label, { color: focused ? "#fff" : "#444" }]}>
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
            <AntDesign
    name="scan"
    size={20}
    color={scan ? "white" : "black"}
  />
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
    width: "260@ms",
    borderColor: "#FFEBDF",
    alignItems: "center",
    height: "66@ms",
    justifyContent: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "6@ms",
    paddingHorizontal: "1@ms",
    width: "60@ms",
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
    fontSize: "14@ms",
    color: "#75748E",
    fontFamily: "Poppins_400Regular",
    marginTop: "2@ms",
  },
});
