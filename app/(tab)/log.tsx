import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { productLogByUserId, recommendeddrink } from "@/service/Api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "expo-router";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { ScaledSheet } from "react-native-size-matters";

export default function log() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  const [selected, setSelected] = useState("Day");
  const tabs = ["Day", "Week", "Month"];
  const [Aidata, setaidata] = useState<any>(null);
  const [logItems, setLogItems] = useState<any[]>([]);
  const [spikeLevel, setSpikeLevel] = useState(0);
  const [sugarConsumed, setSugarConsumed] = useState(0);
  const [recommendedSugar] = useState(55);
  const [expandedId, setExpandedId] = useState<any>(null);
  const [product, setproduct] = useState<any>(null);

  // NEW LOADING STATE
  const [loading, setLoading] = useState(false);

  const toggleCard = (id: any) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const fetchLogData = async (selected: string) => {
    try {
      setLoading(true); // START LOADING

      // Reset state before new fetch
      setLogItems([]);
      setSpikeLevel(0);
      setSugarConsumed(0);
      setExpandedId(null);

      // Fetch logs
      const response: any = await productLogByUserId(selected.toLowerCase());

      // Fetch AI recommendation
      const responseAI: any = await recommendeddrink();
      console.log("responseAI", responseAI);

      // AI DATA HANDLING
      if (responseAI?.status === true) {
        const Realdata = responseAI?.data?.recommended_drinks ?? [];
        console.log("realdata", Realdata);
        setaidata(Realdata);
      } else {
        setaidata([]); // fallback safe
      }

      // USER LOG DATA
      if (response?.success && response?.data) {
        const logData = response.data.data ?? {};

        const items = Object.keys(logData)
          .filter((key) => key !== "result")
          .map((key) => logData[key]);

        setLogItems(items);
        setSpikeLevel(logData.result?.spikePercentage ?? 0);
        setSugarConsumed(logData.result?.totalSugar ?? 0);
      } else {
        // BACKEND ERROR: handle softly
        setLogItems([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setaidata([]);
      setLogItems([]);
    } finally {
      setTimeout(() => setLoading(false), 600); // smooth animation
    }
  };
  useEffect(() => {
    fetchLogData(selected);
  }, [selected]);

  useFocusEffect(
    useCallback(() => {
      fetchLogData(selected);
    }, [selected]),
  );

  const getColor = (value: number) => {
    if (value < 50) return "#4CAF50";
    if (value < 80) return "#FFA500";
    return "#F03745";
  };
  console.log("aidata", Aidata);
  return (
    // <SafeAreaView style={[styles.safeArea]}>

    <ScrollView
      showsVerticalScrollIndicator={false}
      // contentContainerStyle={styles.scrollContent}
      contentContainerStyle={[
        styles.scrollContent,
        { flexGrow: 1, paddingBottom: 100, backgroundColor: "#fff" }, // extra space at bottom
      ]}
    >
      {/* Top Card */}
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Today's Log</Text>
          <Text style={styles.date}>
            {day}/{month}/{year}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <FontAwesome name="calendar" size={40} color="black" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selected === tab && styles.activeTab]}
            onPress={() => setSelected(tab)}
          >
            <Text
              style={[styles.tabText, selected === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Circular Progress / Loader */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#F63E4C" />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      ) : (
        <>
          {/* SPIKE + SUGAR PROGRESS */}
          <View style={styles.progressContainer}>
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>Average Spike level</Text>
              {/* <Text style={styles.progressSubtitle}>75 / 100%</Text> */}
              <Text style={styles.progressSubtitle}></Text>
              <AnimatedCircularProgress
                size={100}
                width={10}
                fill={spikeLevel}
                tintColor={getColor(spikeLevel)}
                backgroundColor="#EAEAEA"
                rotation={0}
                lineCap="round"
              >
                {(fill: any) => (
                  <Text
                    style={styles.progressValue}
                  >{`${fill.toFixed(0)}%`}</Text>
                )}
              </AnimatedCircularProgress>
            </View>

            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>Total Sugar Consumed</Text>
              <Text style={styles.progressSubtitle}></Text>

              <AnimatedCircularProgress
                size={100}
                width={10}
                fill={(sugarConsumed / recommendedSugar) * 100}
                tintColor={getColor((sugarConsumed / recommendedSugar) * 100)}
                backgroundColor="#EAEAEA"
                rotation={0}
                lineCap="round"
              >
                {() => (
                  <Text style={styles.progressValue}>
                    {`${sugarConsumed.toFixed(2)}g`}
                  </Text>
                )}
              </AnimatedCircularProgress>
            </View>
          </View>

          {/* <View style={styles.listContainer}>
  <Text style={styles.AI}>AI Recommended scans </Text>
  {Aidata && Aidata.length > 0 ? (
    Aidata.map((item:any, index:any) => {
      const sugar = item.sugar ?? 0;
      const sugarLevel =
        sugar > 10 ? "High" : sugar > 5 ? "Moderate" : "Low";
      const fill = sugar > 10 ? 90 : sugar > 5 ? 60 : sugar > 0 ? 30 : 5;
      const color =
        sugar > 10
          ? "#e74c3c"
          : sugar > 5
          ? "#f39c12"
          : sugar > 0
          ? "#2ecc71"
          : "#2ecc71"; 

      return (
        <View key={index} style={styles.listCard}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => toggleCard(index)}
          >
            <Image
              source={require("../../assets/images/Mango.png")}
              style={styles.foodImage}
            />

            <View style={styles.foodInfo}>
              <Text style={styles.foodTitle}>{item.name}</Text>
              <Text style={styles.foodSubtitle}>
                Sugar Contain {sugar.toFixed(2)}g
              </Text>
            </View>

            <FontAwesome
              name="chevron-down"
              size={18}
              color="#000"
              style={{
                transform: [
                  { rotate: expandedId === index ? "180deg" : "0deg" },
                ],
              }}
            />
          </TouchableOpacity>

          {expandedId === index && (
            <View style={styles.innerContainer}>
              <View style={styles.circleBox}>
                <AnimatedCircularProgress
                  size={90}
                  width={8}
                  fill={fill}
                  tintColor={color}
                  backgroundColor="#F3F3F3"
                  rotation={0}
                  duration={800}
                  lineCap="round"
                >
                  {() => (
                    <View style={{ alignItems: "center" }}>
                      <Text style={styles.innerRating}>{sugar.toFixed(2)}g</Text>
                      <Text
                        style={{ fontSize: 12, color: color, marginTop: 2 }}
                      >
                        {sugarLevel}
                      </Text>
                    </View>
                  )}
                </AnimatedCircularProgress>

                <View>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          sugar > 10
                            ? "#FF4D4D"
                            : sugar >= 5
                            ? "#FFA500"
                            : sugar > 0
                            ? "#4CAF50"
                            : "#4CAF50",
                      },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: "#FFFFFF" }]}>
                      {sugar > 10
                        ? "High Spike Risk"
                        : sugar >= 5
                        ? "Medium Spike Risk"
                        : sugar > 0
                        ? "Low Spike Risk"
                        : "Low Spike Risk"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailsBox}>
                <View style={styles.detailCard}>
                  <Text style={styles.detailValue}>{sugar.toFixed(2)}g</Text>
                  <Text style={styles.detailLabel}>
                    Sugar per {item.sugar_per_oz ?? 0} oz
                  </Text>
                </View>

                <View style={styles.detailCard}>
                  <Text style={styles.detailValue}>
                    {item.calories?.toFixed
                      ? item.calories.toFixed(2)
                      : item.calories}
                  </Text>
                  <Text style={styles.detailLabel}>
                    Calories per {item.calories_per_oz ?? 0} oz
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      );
    })
  ) : (
    <View style={styles.noLogsContainer}>
      <Text style={styles.noLogsText}>No AI recommended drinks found</Text>
    </View>
  )}
</View> */}

          <View style={styles.listContainer}>
            <Text style={styles.AI}>Recent Drinks </Text>
            {logItems && logItems.length > 0 ? (
              logItems.map((item) => (
                <View key={item._id} style={styles.listCard}>
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => toggleCard(item._id)}
                  >
                    {item.image_url ? (
                      <Image
                        source={{ uri: item.image_url }}
                        style={styles.foodImage}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/Mango.png")}
                        style={styles.foodImage}
                      />
                    )}

                    <View style={styles.foodInfo}>
                      <Text style={styles.foodTitle}>{item.product_name}</Text>
                      <Text style={styles.foodSubtitle}>
                        Sugar Contain{" "}
                        {item.nutrition?.sugars
                          ? item.nutrition.sugars.toFixed(2)
                          : "0.00"}
                        g
                      </Text>
                    </View>

                    <FontAwesome
                      name="chevron-down"
                      size={18}
                      color="#000"
                      style={{
                        transform: [
                          {
                            rotate: expandedId === item._id ? "180deg" : "0deg",
                          },
                        ],
                      }}
                    />
                  </TouchableOpacity>

                  {expandedId === item._id && (
                    <View style={styles.innerContainer}>
                      {/* SUGAR CIRCLE */}
                      <View style={styles.circleBox}>
                        {(() => {
                          const sugar = item.nutrition?.sugars ?? 0;
                          const sugarLevel =
                            sugar > 10
                              ? "High"
                              : sugar > 5
                                ? "Moderate"
                                : "Low";
                          const fill = sugar > 10 ? 90 : sugar > 5 ? 60 : 30;
                          const color =
                            sugar > 10
                              ? "#e74c3c"
                              : sugar > 5
                                ? "#f39c12"
                                : "#2ecc71";

                          return (
                            <AnimatedCircularProgress
                              size={90}
                              width={8}
                              fill={fill}
                              tintColor={color}
                              backgroundColor="#F3F3F3"
                              rotation={0}
                              duration={800}
                              lineCap="round"
                            >
                              {() => (
                                <View style={{ alignItems: "center" }}>
                                  <Text style={styles.innerRating}>
                                    {sugar.toFixed(2)}g
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      color: color,
                                      marginTop: 2,
                                    }}
                                  >
                                    {sugarLevel}
                                  </Text>
                                </View>
                              )}
                            </AnimatedCircularProgress>
                          );
                        })()}
                        <View>
                          <View
                            style={[
                              styles.badge,
                              {
                                backgroundColor:
                                  item.nutrition?.sugars > 10
                                    ? "#FF4D4D"
                                    : item.nutrition?.sugars >= 5
                                      ? "#FFA500"
                                      : "#4CAF50",
                              },
                            ]}
                          >
                            <Text
                              style={[styles.badgeText, { color: "#FFFFFF" }]}
                            >
                              {item.nutrition?.sugars > 10
                                ? "High Spike Risk"
                                : item.nutrition?.sugars >= 5
                                  ? "Medium Spike Risk"
                                  : "Low Spike Risk"}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* DETAILS */}
                      <View style={styles.detailsBox}>
                        <View style={styles.detailCard}>
                          <Text style={styles.detailValue}>
                            {item.nutrition?.sugars
                              ? item.nutrition.sugars.toFixed(2)
                              : "0.00"}
                            g
                          </Text>
                          <Text style={styles.detailLabel}>
                            Sugar per {item.sugar_per_oz} oz
                          </Text>
                        </View>

                        <View style={styles.detailCard}>
                          <Text style={styles.detailValue}>
                            {item.nutrition?.energy_kcal
                              ? item.nutrition.energy_kcal.toFixed(2)
                              : "0.00"}
                          </Text>
                          <Text style={styles.detailLabel}>
                            Calories per {item.calories_per_oz} oz
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.noLogsContainer}>
                <Text style={styles.noLogsText}>No active logs available</Text>
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

export const styles = ScaledSheet.create({
  noLogsContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  noLogsText: {
    fontSize: "16@ms",
    color: "#999",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    padding: "15@ms",
    width: "100%",
    alignItems: "center",
  },

  // ----- Card Section -----
  card: {
    width: "100%",
    maxWidth: "370@ms",
    height: "137@ms",
    backgroundColor: "#FFEFF2",
    borderRadius: "12@ms",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "12@ms",
    marginBottom: "25@ms",
  },

  textContainer: {
    flexDirection: "column",
    flex: 1,
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: "26@ms",
    lineHeight: "32@ms",
    color: "#1B1919",
  },

  date: {
    fontFamily: "Poppins_500Medium",
    fontSize: "18@ms",
    color: "#75748E",
    marginTop: "4@ms",
  },

  iconContainer: {
    width: "40@ms",
    height: "40@ms",
    marginLeft: "12@ms",
  },

  // ----- Tabs -----
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF5F5",
    borderRadius: "25@ms",
    padding: "5@ms",
    width: "100%",
    maxWidth: "370@ms",
    marginBottom: "20@ms",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: "10@ms",
  },

  tabText: {
    fontSize: "12@ms",
    color: "#7E7E7E",
  },

  activeTab: {
    backgroundColor: "#F03745",
    borderRadius: "20@ms",
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Loader
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: "10@ms",
    fontSize: "14@ms",
    color: "#75748E",
  },

  // ----- Progress Bars -----
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "370@ms",
    marginTop: "20@ms",
  },

  progressCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: "12@ms",
    alignItems: "center",
    paddingVertical: "15@ms",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  progressTitle: {
    fontSize: "13@ms",
    fontWeight: "600",
  },

  progressSubtitle: {
    fontSize: "11@ms",
    color: "#8C8399",
  },

  progressValue: {
    fontSize: "13@ms",
    fontWeight: "700",
  },

  // ----- Log List -----
  listContainer: {
    marginTop: "25@ms",
    width: "100%",
    maxWidth: "370@ms",
    borderWidth: 1,
    borderColor: "#EDEDED",
    borderRadius: "20@ms",
    padding: "10@ms",
  },

  AI: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: "18@ms",
    padding: 5,
  },

  listCard: {
    marginTop: "10@ms",
    backgroundColor: "#fff",
    borderRadius: "12@ms",
    padding: "12@ms",
    marginBottom: "20@ms",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  foodImage: {
    width: "50@ms",
    height: "50@ms",
    borderRadius: "8@ms",
    resizeMode: "contain",
  },

  foodInfo: {
    marginLeft: "10@ms",
    flex: 1,
  },

  foodTitle: {
    fontSize: "14@ms",
    fontWeight: "600",
  },

  foodSubtitle: {
    fontSize: "12@ms",
    color: "#8C8399",
  },

  // ----- Expanded Details -----
  innerContainer: {
    marginTop: "15@ms",
    backgroundColor: "#fff",
    borderRadius: "12@ms",
    padding: "12@ms",
    borderWidth: 2,
    borderColor: "#EEEEEE",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "10@ms",
  },

  circleBox: {
    alignItems: "center",
    justifyContent: "center",
    // borderWidth:2,
    // borderColor:"black",
  },

  innerRating: {
    fontSize: "12@ms",
    fontWeight: "700",
  },

  innerText: {
    fontSize: "10@ms",
    color: "#7E7E7E",
  },

  badge: {
    backgroundColor: "#FFE5E5",
    paddingVertical: "5@ms",
    paddingHorizontal: "12@ms",
    borderRadius: "8@ms",
    marginTop: "10@ms",
  },

  badgeText: {
    fontSize: "12@ms",
    color: "#F03745",
    fontWeight: "600",
  },

  // ----- Detail Box -----
  detailsBox: {
    flex: 1,
    // marginTop: "15@ms",
    gap: "10@ms",
    // marginBottom: "50@ms",
    width: "100%",
  },

  detailCard: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#E6E6FF",
    backgroundColor: "#FFF7F7",
    paddingVertical: "8@ms",
    borderRadius: "10@ms",
    alignItems: "center",
  },

  detailValue: {
    fontSize: "16@ms",
    fontWeight: "700",
  },

  detailLabel: {
    fontSize: "11@ms",
    color: "#8C8399",
  },

  heading: {
    marginLeft: "5@ms",
    fontFamily: "Poppins_600SemiBold",
    fontSize: "18@ms",
    color: "#1B1919",
  },

  header: {},
});
