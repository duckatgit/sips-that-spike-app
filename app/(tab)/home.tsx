import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { JSX, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Green from "@/assets/images/green.svg";
import Pin from "@/assets/images/pin.svg";
import AIConsentModal, { checkAIConsent } from "@/components/Aiconsentmodal";
import { productLogByUserId, recommendeddrink } from "@/service/Api";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { ScaledSheet } from "react-native-size-matters";

export default function Home(): JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const [product, setproduct] = useState<any>([]);
  const [result, setresult] = useState<any>(null);
  const [loading, setloading] = useState<boolean>(false);
  const [Aidata, setaidata] = useState<any>(null);
  const router = useRouter();
  const [showConsent, setShowConsent] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleScanPress = async () => {
    const alreadyConsented = await checkAIConsent();
    if (alreadyConsented) {
      router.push("/(tab)/scanner");
    } else {
      setShowConsent(true);
    }
  };
  // ------------------ helpers: risk & flow ------------------
  const generateSugarFlow = (base: number) => {
    const safe = isFinite(base) ? base : 0;
    return [
      safe * 0.3,
      safe * 0.55,
      safe * 0.8,
      safe,
      safe * 0.75,
      safe * 0.5,
      safe * 0.4,
    ];
  };

  const fetchLogData = async () => {
    setloading(true);
    try {
      const response: any = await productLogByUserId("day");
      const responseAI: any = await recommendeddrink();
      console.log("responseAI", responseAI);

      if (responseAI?.status === true) {
        const Realdata = responseAI?.data?.recommended_drinks;
        console.log("realdata", Realdata);
        setaidata(Realdata);
      }
      if (response?.success && response?.data) {
        const raw = response.data.data ?? {};

        const productsArray = Object.values(raw).filter(
          (item: any) => item && item._id,
        );

        const resultData = raw.result ||
          Object.entries(raw).find(([k]) => k === "result")?.[1] || {
            totalSugar: 0,
            spikePercentage: 0,
          };

        setproduct(productsArray || []);
        setresult(resultData);
      } else {
        setproduct([]);
        setresult({ totalSugar: 0, spikePercentage: 0 });
      }
    } catch (err) {
      console.log("fetchLogData error:", err);
      setproduct([]);
      setresult({ totalSugar: 0, spikePercentage: 0 });
    } finally {
      setloading(false);
    }
  };

  // ------------------ derive chart data from totalSugar ------------------
  const totalSugar = Number(result?.totalSugar ?? 0);
  const safeSugar = Number.isFinite(totalSugar) ? totalSugar : 0;

  const drinksChartValues = generateSugarFlow(safeSugar); // always pink
  const riskChartValues = generateSugarFlow(safeSugar); // color depends on risk

  const drinksData = {
    labels: new Array(drinksChartValues.length).fill(""),
    datasets: [
      {
        data: drinksChartValues,
        color: () => `#FF4D6D`,
        strokeWidth: 2,
      },
    ],
  };
  useEffect(() => {
    fetchLogData();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });

      // Fetch data again when screen is focused
      fetchLogData();
    }, []),
  );

  const spikePercentage = Number(result?.spikePercentage ?? 0);
  const safeSpikePercentage = Number.isFinite(spikePercentage) ? spikePercentage : 0;

  const getSpikeColor = (spike: number) => {
    if (spike < 50) return "#4CAF50";
    if (spike < 80) return "#FFA500";
    return "#FF4D4D";
  };

  const getSpikeLabel = (spike: number) => {
    if (spike < 50) return "Low";
    if (spike < 80) return "Moderate";
    return "High";
  };

  const riskColor = getSpikeColor(safeSpikePercentage);
  const riskLabel = getSpikeLabel(safeSpikePercentage);

  const riskData = {
    labels: new Array(riskChartValues.length).fill(""),
    datasets: [
      {
        data: riskChartValues,
        color: () => riskColor,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfigBase = {
    paddingLeft: 0,
    paddingRight: 0,
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    fillShadowGradientFrom: "#FF4D6D",
    fillShadowGradientTo: "#FFE3E8",
    fillShadowGradientFromOpacity: 0.8,
    fillShadowGradientToOpacity: 0.1,
    color: () => `#FF4D6D`,
    strokeWidth: 3,
    decimalPlaces: 0,
    propsForBackgroundLines: { stroke: "transparent" },
    propsForDots: { r: "0" },
  };

  const chartConfigRisk = {
    ...chartConfigBase,
    color: () => riskColor,
    fillShadowGradientFrom: riskColor,
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F63E4C" />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }
  const renderRecommendationCard = ({ item }: { item: any }) => {
    return (
      <View style={styles.recommendationCard}>
        <View style={styles.dot}></View>
        <Image
          style={styles.recoImage}
          source={
            item.image
              ? { uri: item.image }
              : require("../../assets/images/Mango.png")
          }
        />
        <View style={styles.tip}>
          <Text style={styles.upperTexts}>{item.name}</Text>
          <Text style={styles.lowerTexts}>Sugar: {item.sugar}g</Text>
        </View>
      </View>
    );
  };

  // ------------------ UI ------------------
  return (
    <SafeAreaView edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Cards */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardTitle}>Drinks Today</Text>
                  <Text style={styles.cardValue}>
                    {product ? product.length : 0}
                  </Text>
                </View>

                <View style={styles.circleContainer}>
                  <View style={styles.circle}>
                    <Text style={styles.circleText}>{safeSugar}</Text>
                    <Text style={styles.circleSub}>Sug.</Text>
                  </View>
                </View>
              </View>

              {/* Drinks Today Chart (pink, based on totalSugar) */}
              <LineChart
                data={drinksData}
                width={425}
                height={90}
                chartConfig={chartConfigBase}
                bezier
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={false}
                withHorizontalLabels={false}
                withShadow
                withDots={false}
                style={StyleSheet.flatten(styles.chart)}
              />
            </View>

            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardTitle}>Glucose Spike</Text>
                  <Text style={[styles.cardValue, { color: riskColor }]}>{riskLabel}</Text>
                  <Text style={[styles.cardSpikeValue, { color: riskColor }]}>{safeSpikePercentage.toFixed(0)}%</Text>
                </View>

                <Image
                  source={require("../../assets/images/pepsi.png")}
                  style={styles.drinkIcon}
                />
              </View>

              {/* Risk Level Chart (color depends on totalSugar) */}
              <LineChart
                data={riskData}
                width={425}
                height={90}
                chartConfig={chartConfigRisk}
                bezier
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={false}
                withHorizontalLabels={false}
                withShadow
                withDots={false}
                style={StyleSheet.flatten(styles.chart)}
              />
            </View>
          </View>

          {/* Scanner Button */}
          <View style={styles.scannerButtonWrapper}>
            <Pressable
              style={({ pressed }) => [
                styles.scanButton,
                pressed && styles.scanButtonPressed,
              ]}
              onPress={handleScanPress}
            >
              <AntDesign name="scan" size={20} color="#fff" />
              <Text style={styles.scanButtonText}> Scan a Drink</Text>
            </Pressable>
          </View>

          {/* Today's drinks */}
          <View style={styles.todaysDrink}>
            <Text style={styles.sectionTitle}>Today's drinks</Text>

            {(!product || product.length === 0) && (
              <View
                style={[
                  styles.todaysDrinkRow,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 24,
                  },
                ]}
              >
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="water-outline" size={36} color="#999" />
                  <Text style={{ marginTop: 8, color: "#777" }}>
                    No drinks scanned today
                  </Text>
                  <Text style={{ color: "#777", marginTop: 6 }}>
                    Tap "Scan a Drink" to start
                  </Text>
                </View>
              </View>
            )}

            {/* Product list (unchanged) */}
            {product?.map((item: any, index: number) => (
              <View style={styles.todaysDrinkRow} key={index}>
                <View style={styles.todaysDrinkItem}>
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.itemImages}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/images/Mango.png")}
                      style={styles.itemImages}
                    />
                  )}

                  <View>
                    <Text style={styles.upperText}>
                      {item.product_name?.length > 13
                        ? item.product_name.substring(0, 10) + "..."
                        : item.product_name}
                    </Text>
                    <Text style={styles.lowerText}>Sugar Content</Text>
                  </View>
                </View>

                <View style={styles.todaysDrinkRight}>
                  <Text style={styles.rightText}>
                    {item.nutrition?.sugars
                      ? Number(item.nutrition.sugars).toFixed(2)
                      : "0.00"}
                    g/
                    {item.sugar_per_oz ? item.sugar_per_oz : "0.00"} oz
                  </Text>

                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          item.nutrition?.sugars > 10
                            ? "#FF4D4D"
                            : item.nutrition?.sugars >= 5
                              ? "#FFA500"
                              : "#4CAF50",
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* AI Recommended Scans */}
          {/* <View style={styles.ai}>
            <Text style={styles.sectionTitle}>AI Recommended Scans</Text>

            <View style={styles.recommendationContainer}>
              {Aidata && Aidata.length > 0 ? (
                Aidata.map((item: any, index: number) => (
                  <View key={index} style={styles.recommendationCard}>
                    <View style={styles.dot}></View>

                    <Image
                      style={styles.recoImage}
                      source={
                        item.image
                          ? { uri: item.image }
                          : require("../../assets/images/Mango.png") 
                      }
                    />

                    <View style={styles.tip}>
                      <Text style={styles.upperTexts}>
                        {item.name || "Unknown"}
                      </Text>
                      <Text style={styles.lowerTexts}>Sugar content</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noLogsContainer}>
                  <Text style={styles.noLogsText}>
                    No AI recommended drinks found
                  </Text>
                </View>
              )}
            </View>
          </View> */}

          {/* Disclaimer */}
          <View style={styles.disclaimerWrapper}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.disclaimerLink}>
                <Text style={styles.disclaimerNote}>Note: </Text>
                <Text style={styles.disclaimerUnderline}>Disclaimer & Data Source</Text>
              </Text>
            </TouchableOpacity>
          </View>

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
                    This application is provided for informational and educational
                    purposes only. The content displayed in the app is not intended
                    to provide medical advice, diagnosis, treatment, or healthcare
                    recommendations.
                  </Text>
                  <Text style={styles.modalText}>
                    Nutritional information shown in this app is sourced from the
                    Open Food Facts public database and may be incomplete or
                    inaccurate. Users should verify information independently when
                    necessary.
                  </Text>
                  <Text
                    style={styles.linkText}
                    onPress={() => Linking.openURL("https://world.openfoodfacts.org/")}
                  >
                    Data provided by Open Food Facts — https://world.openfoodfacts.org/
                  </Text>
                  <Text style={styles.modalText}>
                    Any scores, labels, or insights presented in the app are based
                    solely on nutritional data and are intended for general
                    informational use only. They should not be interpreted as
                    medical, health, or clinical evaluations.
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

          {/* Bottom small cards */}
          {/* <View style={styles.bottomSection}>
            <Pressable
              style={({ pressed }) => [
                styles.bottomContent,
                pressed && styles.bottomContentHover,
              ]}
            >
              <Pin style={styles.bottomImage1} />

              <View style={styles.bottomText}>
                <Text style={styles.upperText}>Learn</Text>
                <Text style={styles.lowerText}>Sugar Education</Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.bottomContent,
                pressed && styles.bottomContentHover,
              ]}
            >
              <Green style={styles.bottomImage1} />

              <View style={styles.bottomText}>
                <Text style={styles.upperText}>Drink choices</Text>
                <Text style={styles.lowerText}>Better choices</Text>
              </View>
            </Pressable>
          </View> */}
        </View>
      </ScrollView>
      <AIConsentModal
        visible={showConsent}
        onAllow={() => {
          setShowConsent(false);
          router.push("/(tab)/scanner");
        }}
        onDecline={() => {
          setShowConsent(false);
          // stays on home, AI analysis not used
        }}
      />
    </SafeAreaView>
  );
}

export const styles = ScaledSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: "10@ms",
    marginBottom: "90@ms",
    marginTop: "5@ms",
  },

  // ---------- CARDS ----------
  cardContainer: {
    paddingHorizontal: "20@ms",
    marginBottom: "10@ms",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: "16@ms",
    marginBottom: "12@ms",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "16@ms",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: "16@ms",
    color: "#000",
    fontWeight: "500",
  },

  cardValue: {
    fontSize: "18@ms",
    color: "#333",
    marginTop: "6@ms",
    fontWeight: "600",
  },

  cardSpikeValue: {
    fontSize: "13@ms",
    fontWeight: "500",
    marginTop: "2@ms",
  },

  chart: {
    borderRadius: 16,
    width: "100%",
    height: "90@ms",
    marginLeft: 0,
    paddingLeft: 0,
  },

  // ---------- CIRCLE ----------
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  circle: {
    width: "60@ms",
    height: "60@ms",
    borderRadius: "30@ms",
    backgroundColor: "#f9f9f9",
    borderWidth: "3@ms",
    borderColor: "#ff7b89",
    alignItems: "center",
    justifyContent: "center",
  },

  circleText: {
    fontWeight: "700",
    fontSize: "12@ms",
    color: "#000",
  },

  circleSub: {
    fontSize: "10@ms",
    color: "#999",
  },

  drinkIcon: {
    width: "80@ms",
    height: "50@ms",
    resizeMode: "contain",
  },

  // ---------- SCAN BUTTON ----------
  scannerButtonWrapper: {
    paddingHorizontal: "20@ms",
    marginTop: "16@ms",
    marginBottom: "16@ms",
    alignItems: "center",
  },

  scanButton: {
    width: "310@ms",
    height: "56@ms",
    backgroundColor: "#F63E4C",
    borderRadius: "50@ms",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "14@ms",
    paddingHorizontal: "12@ms",
  },

  scanButtonPressed: {
    opacity: 0.9,
  },

  scanButtonText: {
    color: "#fff",
    fontSize: "18@ms",
    fontWeight: "600",
  },

  // ---------- TODAY'S DRINK ----------
  todaysDrink: {
    marginHorizontal: "20@ms",
    marginTop: "10@ms",
  },

  sectionTitle: {
    fontSize: "20@ms",
    fontWeight: "600",
    marginBottom: "12@ms",
  },

  todaysDrinkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderColor: "#e6e6e6",
    borderWidth: "1@ms",
    borderRadius: "10@ms",
    paddingHorizontal: "14@ms",
    paddingVertical: "10@ms",
    marginBottom: "10@ms",
  },

  todaysDrinkItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemImages: {
    width: "55@ms",
    height: "55@ms",
    resizeMode: "contain",
    marginRight: "10@ms",
  },

  upperText: {
    color: "#111",
    fontSize: "14@ms",
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },

  lowerText: {
    color: "#615253",
    fontSize: "12@ms",
    marginTop: "4@ms",
    fontFamily: "Poppins_500Medium",
  },

  todaysDrinkRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: "8@ms",
  },

  rightText: {
    marginRight: "12@ms",
    fontSize: "12@ms",
    color: "#000",
  },

  statusDot: {
    width: "10@ms",
    height: "10@ms",
    borderRadius: "5@ms",
    borderWidth: "1@ms",
    borderColor: "#ccc",
  },

  // ---------- AI SECTION ----------
  ai: {
    marginTop: "20@ms",
    paddingHorizontal: "20@ms",
    marginBottom: "10@ms",
  },

  recommendationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  recommendationCard: {
    padding: "10@ms",
    width: "157@ms",
    height: "70@ms",
    borderWidth: "1@ms",
    borderColor: "#CFE9F9",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: "10@ms",
    position: "relative",
  },

  recoImage: {
    width: "50@ms",
    height: "40@ms",
    resizeMode: "contain",
    marginRight: "10@ms",
  },

  upperTexts: {
    color: "#111",
    fontSize: "12@ms",
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },

  lowerTexts: {
    color: "#615253",
    fontSize: "12@ms",
    fontFamily: "Poppins_500Medium",
    marginTop: "2@ms",
  },

  tip: {
    justifyContent: "center",
    width: "108@ms",
  },

  dot: {
    position: "absolute",
    top: "4@ms",
    right: "4@ms",
    width: "7@ms",
    height: "7@ms",
    backgroundColor: "#00B140",
    borderRadius: "5@ms",
  },

  noLogsContainer: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "20@ms",
  },

  noLogsText: {
    fontSize: 16,
    color: "#999",
  },

  // ---------- BOTTOM CARDS ----------
  bottomSection: {
    marginTop: "20@ms",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: "8@ms",
  },

  bottomContent: {
    width: "165@ms",
    height: "120@ms",
    borderWidth: "1@ms",
    borderColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "10@ms",
    backgroundColor: "#fff",
    borderRadius: "10@ms",
    gap: "10@ms",
  },

  bottomContentHover: {
    backgroundColor: "#F4F5FF",
    transform: [{ translateY: -5 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  bottomImage1: {
    width: 100,
    height: 100,
    marginTop: 10,
  },

  bottomText: {
    alignItems: "center",
  },

  // ---------- DISCLAIMER ----------
  disclaimerWrapper: {
    marginHorizontal: "20@ms",
    marginTop: "20@ms",
    marginBottom: "10@ms",
    alignItems: "center",
  },
  disclaimerLink: {
    fontSize: "13@ms",
  },
  disclaimerNote: {
    color: "#75748E",
    fontFamily: "Poppins_400Regular",
  },
  disclaimerUnderline: {
    color: "blue",
    textDecorationLine: "underline",
    fontFamily: "Poppins_400Regular",
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

  // ---------- LOADER ----------
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  loadingText: {
    marginTop: "10@vs",
    fontSize: "14@ms",
    color: "#75748E",
    fontFamily: "Poppins_500Medium",
  },
});
