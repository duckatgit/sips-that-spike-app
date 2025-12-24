
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { GetDataById } from "@/service/Api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { styles } from "./article.styles";
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


