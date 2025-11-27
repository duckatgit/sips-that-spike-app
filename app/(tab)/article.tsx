
import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { GetDataById } from "@/service/Api";

export default function Article() {
  const router = useRouter();
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [article, setArticle] = useState<any>(null);

  const fetchArticle = async () => {
    try {
      if (!refreshing) setLoading(true);
      const data = await GetDataById(id as string);
      console.log("API response:", JSON.stringify(data, null, 2));

      if (data?.article) {
        setArticle(data.article);
      } else {
        console.warn("No article found in response:", data);
        setArticle(null);
      }
    } catch (error: any) {
      // console.error("Error fetching article:", error?.response?.status || error);

      // ✅ Handle deleted / not found case (status 404)
      if (error?.response?.status === 404) {
        console.log("Article not found — redirecting");
        setArticle(null);
        router.push("/(tab)/learn")
      
      } else {
        setArticle(null); // fallback for other errors
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Back",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
      headerTitleStyle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 18,
        color: "#1B1919",
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.push("/(tab)/learn")}
          style={{ marginLeft: 16, marginTop: -3 }}
        >
          <Ionicons name="chevron-back-outline" size={26} color="#1B1919" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // ✅ Show loading spinner while fetching
  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F63E4C" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  

  const onRefresh = () => {
    setRefreshing(true);
    fetchArticle();
  };

  // ✅ Safe access (prevents null crash)
  const keyNumbers = article?.keyNumbers?.[0] || {
    totalCarbohydrates: "-",
    addedSugars: "-",
    totalSugars: "-",
    servingSize: "-",
    description: "Decode Hidden Sugars",
    image: "https://via.placeholder.com/300x200.png?text=No+Image",
    hiddenSugarNames: [],
  };

  return (
    // <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F63E4C"]}
            tintColor="#F63E4C"
          />
        }
      >
        <View style={styles.main}>
          <Text style={styles.title}>{article?.title}</Text>

          <View style={styles.container}>
            <Image
              source={{ uri: article?.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.times}>
              <View></View>
              <Text style={styles.date}>
                {article?.createdAt
                  ? new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </Text>
            </View>

            <Text style={styles.header}>{article?.subTitle}</Text>
            <Text style={styles.nutri}>
              Nutritionist:{" "}
              <Text style={styles.milk}>{article?.nutritionist}</Text>
            </Text>
            <Text style={styles.learn}>{article?.description}</Text>
          </View>

          {/* Key Numbers */}
          <View style={styles.keystore}>
            <Text style={styles.headers}>Key Numbers to Watch</Text>
            {[
              ["Total Carbohydrates", keyNumbers.totalCarbohydrates],
              ["Added Sugars", keyNumbers.addedSugars],
              ["Total Sugars", keyNumbers.totalSugars],
              ["Serving Size", keyNumbers.servingSize],
            ].map(([label, value], idx) => (
              <View key={idx} style={styles.keys}>
                <Image
                  source={require("../../assets/images/arrow.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={styles.first}>
                  {label}: <Text style={styles.second}>{value}</Text>
                </Text>
              </View>
            ))}
          </View>

          {/* Hidden Sugar Names */}
          <View style={styles.containers}>
            <Image
              source={{ uri: keyNumbers.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.keystores}>
              <Text style={styles.headers}>Hidden Sugar Names</Text>
              <Text style={styles.appears}>
                Sugar appears under many disguises in ingredient lists. Look for
                these common aliases:
              </Text>
              {keyNumbers.hiddenSugarNames?.length > 0 ? (
                keyNumbers.hiddenSugarNames.map((name: string, index: number) => (
                  <View key={index} style={styles.keys}>
                    <Image
                      source={require("../../assets/images/arrow.png")}
                      style={styles.icons}
                      resizeMode="contain"
                    />
                    <Text style={styles.firsts}>{name}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.firsts}>No hidden sugars listed.</Text>
              )}
            </View>
          </View>

          <Text style={styles.bottom}>
            Remember: ingredients are listed by weight, so if sugar appears in
            the first few ingredients, the product is likely high in sugar.
          </Text>
        </View>
      </ScrollView>
    // </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", overflow: "hidden", paddingBottom: "74@ms" },
  main: { marginHorizontal: "20@ms", marginBottom: "80@ms" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: "10@vs", fontSize: "14@ms", color: "#75748E", fontFamily: "Poppins_500Medium" },
  title: {
    marginTop: "15@ms",
    fontFamily: "Poppins_600SemiBold",
    fontWeight: "600",
    fontSize: "21@ms",
    color: "#1B1919",
    lineHeight: "28@ms",
    marginBottom: "10@vs",
  },
  container: { padding: "1@ms", backgroundColor: "#fff" },
  image: { width: "100%", height: "230@ms", borderRadius: "10@ms" },
  times: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "15@ms" },
  date: { fontFamily: "Poppins_500Medium", color: "#000", fontWeight: "500" },
  header: { fontFamily: "Poppins_600SemiBold", fontSize: "15@ms", fontWeight: "600", lineHeight: "26@ms", marginBottom: "5@ms" },
  nutri: { fontFamily: "Poppins_400Regular", fontWeight: "400", fontSize: "16@ms", lineHeight: "18@ms", color: "#000", marginBottom: "2@ms" },
  milk: { fontFamily: "Poppins_600SemiBold", fontWeight: "600", color: "#F63E4C" },
  learn: { marginTop: "10@ms", fontFamily: "Poppins_400Regular", color: "#75748E", fontWeight: "400", lineHeight: "20@ms" },
  keystore: { marginTop: "25@ms", borderWidth: 1, borderColor: "#E2E2E2", padding: "12@ms", borderRadius: "10@ms", backgroundColor: "#F9F9F9" },
  keystores: { marginTop: "25@ms", padding: "12@ms", borderRadius: "10@ms" },
  headers: { fontFamily: "Poppins_600SemiBold", fontSize: "16@ms", fontWeight: "600", color: "#1B1919", marginBottom: "10@ms" },
  appears: { fontFamily: "Poppins_400Regular", color: "#75748E", fontSize: "14@ms", lineHeight: "27@ms", marginBottom: "10@ms" },
  keys: { flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", paddingVertical: "4@ms", marginBottom: "5@ms" },
  icon: { width: "13@ms", height: "18@ms", marginTop: "2@ms", marginRight: "8@ms", padding: "5@ms", tintColor: "#F63E4C" },
  icons: { width: "18@ms", marginTop: "2@ms", height: "18@ms", marginRight: "8@ms", tintColor: "#F63E4C" },
  first: { flexShrink: 1, fontFamily: "Poppins_500Medium", fontWeight: "500", fontSize: "14@ms", color: "#000", lineHeight: "20@ms" },
  second: { fontFamily: "Poppins_400Regular", fontWeight: "400", fontSize: "14@ms", color: "#75748E" },
  firsts: { fontFamily: "Poppins_400Regular", color: "#75748E", fontSize: "14@ms" },
  bottom: { fontFamily: "Poppins_400Regular", fontWeight: "400", fontSize: "14@ms", color: "#75748E", marginTop: "2@ms" },
  scrollContainer: { paddingBottom: "30@ms" ,backgroundColor:"#fff"},
  containers: { padding: "1@ms", marginTop: "20@ms" },
});
