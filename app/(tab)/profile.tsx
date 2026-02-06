
import DeleteAccount from "@/components/DeleteAccountPopup";
import SignoutPopup from "@/components/SignoutPopup";
import { deleteUser, getAllScansDataByUsers, getuserbyid } from "@/service/Api";
import { useToast } from "@/utils/useToastHook";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
interface UserData {
  name: string;
  email: string;
  image: string;
}

export default function Profile() {
  const [loading, setLoading] = useState(false); // logout loader
  const [profileLoading, setProfileLoading] = useState(true); // page loading
  const { showToast } = useToast();
  const [isSignOutConfirmationOpen, setIsSignOutConfirmationOpen] = useState(false);
  const [isDeleteAccount, setIsDeleteAccount] = useState<boolean>(false);
  const [data, setData] = useState<UserData>({
    name: "",
    email: "",
    image: "",
  });

  const [allScansData, setAllScansData] = useState<any>({
    totalCalories: '',
    totalSugar: '',
    healthyChoice: '',
    totalScans: '',
    dailySugarIntake: '',
    dayStreak: ''
  });

  const LinearProgress = ({ value, max }: any) => {
    const percent = Math.min((value / max) * 100, 100);

    return (
      <View style={{ width: "100%", height: 12, backgroundColor: "#eee", borderRadius: 10 }}>
        <View
          style={{
            width: `${percent}%`,
            height: "100%",
            backgroundColor:
              percent > 70 ? "red" : percent > 40 ? "orange" : "green",
            borderRadius: 10,
          }}
        />
      </View>
    );
  };
  const showToastNotification = (type: string, msg: string) => {
    console.log("EEERERERERERE", type);
    //  showToast(type, msg);

    showToast(type, msg)

  };
  // ============================
  // FETCH USER DATA
  // ============================
  const getData = async () => {
    try {
      setProfileLoading(true);

      let response: any = await getuserbyid();
      const user = response?.data?.getUserById;
      let res = await getAllScansDataByUsers();
      console.log("res data of alluser", res);
      setAllScansData({
        totalCalories: res.result.totalCalories,
        totalSugarIntake: res.result.dailySugarIntake,
        healthyChoice: res.result.healthyChoice,
        totalScans: res.result.totalScans,
        totalSugar: res.result.totalSugar,
        dayStreak: res.result.dayStreak
      })
      console.log("User Data:", user);

      setData({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        image: user.image,
      });
    } catch (err) {
      console.log("Error loading user:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // ============================
  // AUTO REFRESH WHEN SCREEN OPENS
  // ============================
  useFocusEffect(
    useCallback(() => {
      console.log("Profile screen opened → fetching...");
      getData();
    }, [])
  );

  // ============================
  // LOGOUT FUNCTION
  // ============================
  const onLogout = async () => {

    setLoading(true);
    try {
      await AsyncStorage.multiRemove(["token", "userId", "role", "name"]);
      showToastNotification("success", "Logout Successfully");

      router.replace("/signin");
    } catch (error) {
      console.error("Logout Error:", error);
      showToastNotification("error", "Something went wrong!");


    } finally {
      setLoading(false);
    }
  };

  const onDeleteAccount = async () => {
    setLoading(true);
    try {
      const responsne = await deleteUser();
      if (responsne.status) {
        showToastNotification("success", "User Deleted Successfully");
        await AsyncStorage.multiRemove(["token", "userId", "role", "name"]);
        router.replace("/signin");
        setIsDeleteAccount(false);
      }
    } catch (error: any) {
      showToastNotification("error", error?.response?.data?.message || error?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }

  }

  // ============================
  // PAGE LOADER WHILE GETTING PROFILE
  // ============================
  if (profileLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#F63E4C" />
      </SafeAreaView>
    );
  }

  const dailySugarIntake = allScansData.totalSugarIntake ?? 0;
  const healthyChoice = allScansData.healthyChoice ?? 0;
  // 1
  console.log("dailySugarIntake", dailySugarIntake, healthyChoice);
  // ============================
  // MAIN UI RENDER
  // ============================
  console.log("allscandata", allScansData)
  return (
    // <SafeAreaView style={styles.container}>
    <ScrollView
      contentContainerStyle={{ paddingBottom: 150, backgroundColor: "white", justifyContent: "center", alignItems: "center", }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>


        <View style={styles.first}>
          <View style={styles.second}>
            <View style={styles.imgdiv}>
              {data.image ? (
                <Image
                  source={{ uri: data.image }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                    alignSelf: "flex-start",
                  }}
                />
              ) : (

                <View style={styles.imgbord}>

                  <Image
                    source={require("../../assets/images/blankdp.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                      alignSelf: "flex-start",


                    }}
                  />
                </View>
              )}
            </View>

            <View style={styles.fourth}>
              {/* <Text style={styles.name}>
  {data?.name
    ? data.name.length > 15
      ? data.name.substring(0, 15) + "..."
      : data.name
    : "User"}
</Text> */}
              <Text
                style={styles.name}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {data?.name || "User"}
              </Text>
              <Text style={styles.email}>{data.email ? data.email : "user@gmail.com"}</Text>
            </View>
          </View>

          <Pressable
            style={styles.third}
            onPress={() => router.push("/(tab)/editprofile")}
          >
            <AntDesign name="edit" size={15} color="#F63E4C" />
            <Text style={styles.edit}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* ============================
          YOUR STATS (UI SAME)
        ============================ */}
        <View style={styles.stats}>
          <View style={styles.statstitles}>
            <Text style={styles.statsText}>Your Stats</Text>
          </View>

          <View style={styles.status}>
            {/* Total Scans */}
            <View style={styles.box}>
              <View style={styles.box1}>
                <View style={styles.box2}>
                  <Image
                    source={require("../../assets/images/camera.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <View style={styles.box3}>
                  <Text style={styles.total}>{allScansData.totalScans}</Text>
                  <Text style={styles.tscan}>Total Scans</Text>
                </View>
              </View>
            </View>

            {/* Total Sugar */}
            <View style={styles.box}>
              <View style={styles.box1}>
                <View style={styles.box2}>
                  <Image
                    source={require("../../assets/images/dice.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <View style={styles.box3}>
                  <Text style={styles.total}>
                    {allScansData.totalSugar ? allScansData.totalSugar.toFixed(2) : "0.00"}g
                  </Text>

                  <Text style={styles.tscan}>Total Sugar</Text>
                </View>
              </View>
            </View>

            {/* Daily Strike */}
            <View style={styles.box}>
              <View style={styles.box1}>
                <View style={styles.box2}>
                  <Image
                    source={require("../../assets/images/calender.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <View style={styles.box3}>
                  <Text style={styles.total}>{allScansData.dayStreak}</Text>
                  <Text style={styles.tscan}>Daily Streak</Text>
                </View>
              </View>
            </View>
          </View>
        </View>



        <View style={styles.ten}>
          <View style={styles.nine}>
            <View style={styles.eight}>
              <Text>Daily Sugar Intake</Text>
              <Text>{dailySugarIntake.toFixed(2)}g </Text>
            </View>

            {/* Dynamic Progress Bar */}
            <LinearProgress value={dailySugarIntake} max={50} />
          </View>

          <View style={styles.nine}>
            <View style={styles.eight}>
              <Text>Healthy choice</Text>
              {/* <Text>{healthyChoice && allScansData.totalScans?(healthyChoice/allScansData.totalScans).toFixed(2):''}</Text> */}
              {/* one correct for decimal show */}
              <Text>{allScansData.totalScans > 0
                ? (healthyChoice / allScansData.totalScans).toFixed(2)
                : ''}</Text>
            </View>

            {/* Dynamic Progress Bar */}
            <LinearProgress value={healthyChoice} max={10} />
          </View>
        </View>

        {/* ============================
          ACCOUNT SECTION (UI SAME)
        ============================ */}
        <View style={styles.statsts}>
          <View style={styles.statstitles}>
            <Text style={styles.statsText}>Account</Text>
          </View>

          <View style={styles.statstitlesyi}>
            <Pressable onPress={() => router.push("/(tab)/notification")}>
              <View style={styles.statstitlesfirsti}>
                <View style={styles.hell}>
                  <View style={styles.bell}>
                    <MaterialIcons name="local-police" size={16} color="black" />
                  </View>
                  <Text style={styles.note}>Terms & Conditions</Text>
                </View>

                <View style={styles.next}>
                  <FontAwesome6 name="greater-than" size={12} color="#B3B3B3" />
                </View>
              </View>
            </Pressable>

            <Pressable onPress={() => router.push("/(tab)/privacy")}>
              <View style={styles.statstitlesfirsti}>
                <View style={styles.hell}>
                  <View style={styles.bell1}>
                    <Fontisto name="bell-alt" size={16} color="black" />
                  </View>

                  <Text style={styles.note}>Privacy & Security</Text>
                </View>

                <View style={styles.next}>
                  <FontAwesome6
                    name="greater-than"
                    size={12}
                    color="#B3B3B3"
                  />
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        {/* ============================
          SUPPORT SECTION (UI SAME)
        ============================ */}
        <View style={styles.statstsio}>
          <View style={styles.statstitles}>
            <Text style={styles.statsText}>Support</Text>
          </View>

          <View style={styles.statstitlesyi}>
            <Pressable onPress={() => router.push("/(tab)/help")}>
              <View style={styles.statstitlesfirsti}>
                <View style={styles.hell}>
                  <View style={styles.bell}>
                    <Entypo name="help-with-circle" size={16} color="black" />
                  </View>

                  <Text style={styles.note}>Help Center</Text>
                </View>

                <View style={styles.next}>
                  <FontAwesome6
                    name="greater-than"
                    size={12}
                    color="#B3B3B3"
                  />
                </View>
              </View>
            </Pressable>

            <Pressable onPress={() => router.push("/(tab)/feedback")}>
              <View style={styles.statstitlesfirsti}>
                <View style={styles.hell}>
                  <View style={styles.bell1}>
                    <MaterialIcons name="feedback" size={16} color="black" />
                  </View>

                  <Text style={styles.note}>Send Feedback</Text>
                </View>

                <View style={styles.next}>
                  <FontAwesome6
                    name="greater-than"
                    size={12}
                    color="#B3B3B3"
                  />
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        {/* ============================
          LOGOUT BUTTON WITH LOADER
        ============================ */}
        <Pressable
          style={styles.scanButton}
          onPress={() => setIsSignOutConfirmationOpen(true)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#F63E4C" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={24} color="#F63E4C" />
              <Text style={styles.scanButtonText}> Sign Out</Text>
            </>
          )}
        </Pressable>
        <Pressable
          style={styles.scanButton}
          onPress={() => setIsDeleteAccount(true)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#F63E4C" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={24} color="#F63E4C" />
              <Text style={styles.scanButtonText}> Delete Account</Text>
            </>
          )}
        </Pressable>
      </View>
      {isDeleteAccount && <DeleteAccount visible={isDeleteAccount} isLoading={loading} onCancel={() => setIsDeleteAccount(false)} onConfirm={onDeleteAccount} />}
      {isSignOutConfirmationOpen && <SignoutPopup visible={isSignOutConfirmationOpen} onCancel={() => setIsSignOutConfirmationOpen(false)} onConfirm={onLogout} />}
    </ScrollView>
    // </SafeAreaView>
  );
}


export const styles = ScaledSheet.create({
  /* ---- Main Container ---- */
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: "10@ms",
    paddingTop: "20@ms",
  },

  /* ---- Scan Button ---- */
  scanButton: {
    width: "90%",
    height: "56@ms",
    borderWidth: 2,
    backgroundColor: "white",
    borderColor: "#F63E4C",
    borderRadius: "50@ms",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    alignSelf: "center",
    marginTop: "10@ms",
  },
  scanButtonText: {
    color: "#F63E4C",
    fontSize: "18@ms",
    fontWeight: "600",
  },

  /* ---- Profile Card ---- */
  first: {
    width: "100%",
    minHeight: "110@ms",
    backgroundColor: "#FFF0F1",
    borderRadius: "10@ms",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: "2@ms",
    paddingRight: "10@ms",
    borderWidth: 2,
    borderColor: "#FDD1D3",
  },

  imgdiv: {
    width: "72@ms",
    height: "72@ms",
    borderRadius: "10@ms",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  imgbord: {
    width: "60@ms",
    height: "60@ms",
    borderRadius: "100@ms",
    borderWidth: 1,
    borderColor: "#FFEBDF",
    overflow: "hidden",
  },

  second: {
    flex: 1,
    height: "72@ms",
    flexDirection: "row",
    alignItems: "center",
    gap: "20@ms",
    paddingLeft: "10@ms",
  },

  third: {
    width: "28%",
    height: "34@ms",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#F63E4C",
    backgroundColor: "#FFFFFFE5",
    borderRadius: "10@ms",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: "3@ms"
  },

  fourth: {
    width: "53%",
    height: "60@ms",
    justifyContent: "center",
    // borderWidth:1,
    // borderColor:"black",
    gap: "3@ms"
  },

  name: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: "16@ms",
    lineHeight: "21@ms",
    color: "#1B1919",
    textTransform: "capitalize",
  },
  email: {
    fontFamily: "Poppins_400Regular",
    fontSize: "10@ms",
    lineHeight: "14@ms",
    color: "#75748E",
    textTransform: "capitalize",
  },
  edit: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: "12@ms",
    color: "#F63E4C",
    textTransform: "capitalize",
  },

  /* ---- Your Stats ---- */
  stats: {
    width: "100%",
    marginTop: "20@ms",
  },

  statsText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: "18@ms",
    color: "#1B1919",
    marginBottom: "10@ms",
    lineHeight: 30
  },

  status: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10@ms",
    // borderWidth:1,
    // borderColor:"black"
  },

  box: {
    width: "30%",
    minHeight: "96@ms",
    borderWidth: 2,
    borderColor: "#FDD1D3",
    backgroundColor: "#E6E6FF",
    borderRadius: "10@ms",
    justifyContent: "center",
    alignItems: "center",
    padding: "10@ms",
  },

  box1: {
    padding: "4@ms",
    width: "80@ms",
    height: "80@ms",
    backgroundColor: "#E6E6FF",
    borderRadius: "10@ms",
    alignItems: "center",
    justifyContent: "center",
    gap: "5@ms",
  },

  box2: {
    width: "30@ms",
    height: "30@ms",
    overflow: "hidden",
  },

  box3: {
    width: "80@ms",
    height: "35@ms",
    justifyContent: "center",
    alignItems: "center",
  },

  total: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: "12@ms",
    color: "#1B1919",
  },
  tscan: {
    fontFamily: "Poppins_400Regular",
    fontSize: "11@ms",
    color: "#636363",
  },

  /* ---- Health Goals ---- */
  statst: {
    width: "100%",
    marginTop: "20@ms",
    padding: "5@ms",
  },

  ten: {
    width: "100%",
    alignItems: "center",
    gap: "10@ms",
    marginTop: "10@ms",
  },

  nine: {
    width: "100%",
    minHeight: "60@ms",
    borderWidth: 3,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10@ms",
    padding: "10@ms",
  },

  imgs: {
    width: "100%",
    height: "10@ms",
    borderRadius: "10@ms",
    borderWidth: 2,
    borderColor: "black",
  },

  eight: {
    width: "100%",
    height: "30@ms",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "4@ms",
  },

  /* ---- Account Section ---- */
  statsts: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: "20@ms",
    padding: "10@ms",
    borderRadius: "10@ms",
  },

  statstitles: {
    width: "100%",
    minHeight: "28@ms",
    paddingVertical: "4@ms",
    // borderWidth: 1,
    // borderColor: "black",
    justifyContent: "center",
  },


  statstitlesyi: {
    width: "100%",
    height: "90@ms",
    gap: "20@ms",
  },

  statstitlesfirsti: {
    width: "100%",
    height: "28@ms",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  hell: {
    width: "40%",
    flexDirection: "row",
    gap: "10@ms",
    alignItems: "center",
  },

  bell: {
    width: "28@ms",
    height: "28@ms",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#D6F5E1",
    borderRadius: "10@ms",
    justifyContent: "center",
    alignItems: "center",
  },
  bell1: {
    width: "28@ms",
    height: "28@ms",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#E9D9FF",
    borderRadius: "10@ms",
    justifyContent: "center",
    alignItems: "center",
  },

  note: {
    fontFamily: "Poppins_500Medium",
    fontSize: "12@ms",
    color: "#4B4B4B",
  },

  next: {
    width: "12@ms",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---- Support Section ---- */
  statstsio: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: "20@ms",
    marginBottom: "20@ms",
    padding: "10@ms",
    borderRadius: "10@ms",
  },
});
