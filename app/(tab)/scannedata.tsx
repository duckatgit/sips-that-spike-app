
import { Addtomylog, GetDetailFromBarcode, GetDetailFromBarcodeById } from "@/service/Api";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { useToast } from "@/utils/useToastHook";
import { styles } from "./scandata.styles";
export default function ScannedData() {
  const navigation = useNavigation();
  const router = useRouter();
  const { showToast } = useToast();
  const { data } = useLocalSearchParams(); // data is a string (JSON) coming from router params
  const parsedData = data && typeof data === "string" ? JSON.parse(data) : null;

 
  const barcodeFromParams =
    parsedData?.barcode ||
    parsedData?._id || // in case you passed id directly
    parsedData?.savedArticle?._id || // older shape
    null;

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [logged, setLogged] = useState(false);

  // --------------------------------------------------------------
  // Header Setup
  // --------------------------------------------------------------
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
          onPress={() => router.push("/scan")}
          style={{ marginLeft: 16, marginTop: -3 }}
        >
          <Ionicons name="chevron-back-outline" size={26} color="#1B1919" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const showToastNotification = (type: string, msg: string) => {
    showToast(type, msg);
  };

  // ---------------- Fetch helper ----------------
  const fetchProductByBarcode = async (barcode: string | null) => {
    if (!barcode) return;

    try {
      if (!refreshing) setLoading(true);

      // Use GetDetailFromBarcode (by barcode) if available.
      // If your API provides an endpoint that expects barcode -> use it.
      // Fallback: if you only have GetDetailFromBarcodeById, you might need to call the "by id" endpoint.
      // Here we try barcode-first, then id fallback.
      let response: any = null;

      // Try fetching by barcode
      try {
        response = await GetDetailFromBarcode(barcode);
      } catch (e) {
        // swallow here; we'll try by id fallback below if needed
        response = null;
      }

      // If API returned a wrapper that contains the product as getProductById or savedArticle, normalize it
      let fetchedProduct = null;

      if (response?.getProductById) {
        fetchedProduct = response.getProductById;
      } else if (response?.savedArticle) {
        fetchedProduct = response.savedArticle;
      } else if (response?.product) {
        fetchedProduct = response.product;
      } else if (response && response.status === true && response.data) {
        // some APIs return { status: true, data: {...} }
        fetchedProduct = response.data;
      } else if (response && response.status === true && response.getProduct) {
        fetchedProduct = response.getProduct;
      } else if (response && response.status === true && response.getProductById) {
        fetchedProduct = response.getProductById;
      }

      // If nothing from barcode call, try the "by id" endpoint if barcode is actually an id
      if (!fetchedProduct) {
        // sometimes the param is actually an _id — try by id endpoint
        try {
          const maybeById = await GetDetailFromBarcodeById(barcode);
          if (maybeById?.getProductById) fetchedProduct = maybeById.getProductById;
          else if (maybeById?.data) fetchedProduct = maybeById.data;
        } catch (e) {
          // ignore
        }
      }

      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setLogged(fetchedProduct?.log === true);
      } else {
        setProduct(null);
        setLogged(false);
        showToastNotification("error", "Product not found.");
      }
    } catch (error: any) {
      setProduct(null);
      setLogged(false);
      showToastNotification("error", error?.message || "Product not found.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ---------------- effect: run whenever barcodeFromParams changes ----------------
  useEffect(() => {
    let mounted = true;
    const barcode = barcodeFromParams;

    if (!barcode) {
      // nothing to fetch
      setProduct(null);
      setLogged(false);
      return;
    }

    // fetch fresh product for this barcode
    (async () => {
      if (!mounted) return;
      await fetchProductByBarcode(barcode);
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodeFromParams]); // re-run when param changes (new scan)

  // ---------------- refresh handler ----------------
  const onRefresh = () => {
    const barcode = barcodeFromParams;
    if (!barcode) {
      showToastNotification("error", "No product to refresh.");
      return;
    }
    setRefreshing(true);
    fetchProductByBarcode(barcode);
  };

  // ---------------- Add to My Log ----------------
  const handleAddToLog = async (id: any) => {
    try {
      const response = await Addtomylog(id);
console.log("response",response);
      if (response?.updateProduct?.log === true) {
        setLogged(true);
        showToastNotification("success", "This item is added to your log.");
        return;
      }

      if (response.status === true) {
        setLogged(true);
        showToastNotification("success", response.message || "Your log has been saved.");
      } else {
        showToastNotification("error", response.message || "Something went wrong!");
      }
    } catch (error: any) {
      showToastNotification("error", error?.message || "Something went wrong!");
    }
  };

  // ---------------- UI states ----------------
  if (loading && !refreshing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loadingText}>No product data found.</Text>
      </View>
    );
  }

  // Sugar Logic
  const sugar = product?.nutrition?.sugars ?? 0;
  const sugarLevel = sugar > 10 ? "High" : sugar > 5 ? "Moderate" : "Low";
  const fill = sugar > 10 ? 90 : sugar > 5 ? 60 : 30;
  const color = sugar > 10 ? "#e74c3c" : sugar > 5 ? "#f39c12" : "#2ecc71";

  const productImage = product?.image_url ? { uri: product.image_url } : require("../../assets/images/Mango.png");

  return (
    
  
      <ScrollView
        contentContainerStyle={{ backgroundColor:"white",paddingHorizontal:25 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6347"]} tintColor="#FF6347" />}
      >
        

       
        {/* Product Card */}
        <View style={styles.container}>
          <View style={styles.image}>
            <Image source={productImage} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
          </View>

          <View style={styles.imgbtm}>
            <Text style={styles.first}>{product?.product_name || "Unknown"}</Text>
            <Text style={styles.second}>{product?.brands || ""}</Text>
          </View>
        </View>

        {/* Sugar Details */}
        <View style={styles.containersecond}>
          <View style={styles.firstinside}>
            <View style={styles.thirdinside}>
              <AnimatedCircularProgress size={100} width={10} fill={fill} tintColor={color} backgroundColor="#eee" rotation={0} lineCap="round" duration={1000}>
                {() => (
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ fontWeight: "700", fontSize: 14, color }}>{sugarLevel}</Text>
                    <Text style={{ fontSize: 12, color: "#555" }}> {parseFloat(sugar).toFixed(2)}g</Text>
                  </View>
                )}
              </AnimatedCircularProgress>
            </View>

            <View style={styles.insidetext}>
              <Text style={styles.oneTW}>{sugar > 10 ? "High Spike Risk" : sugar > 5 ? "Moderate Spike Risk" : "Low Spike Risk"}</Text>
            </View>
          </View>

          <View style={styles.secondinside}>
            <View style={styles.one}>
              <Text style={styles.oneT}>{sugar.toFixed(2)} g</Text>
              <Text style={styles.oneTW}>Sugar per {product?.sugar_per_oz} oz</Text>
            </View>
            <View style={styles.one}>
              <Text style={styles.oneT}>{(product?.nutrition?.energy_kcal ?? 0).toFixed(2)} kcal</Text>
              <Text style={styles.oneTW}>Calories per {product?.calories_per_oz} oz</Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.containerthird}>
          <View style={styles.containerfourth}>
            <View style={styles.firsttop}>
              <Feather name="info" size={24} color="black" />
              <Text>{sugar > 10 ? "High Sugar Content" : sugar > 5 ? "Moderate Sugar Content" : "Low Sugar Content"}</Text>
            </View>

            <View style={styles.containerfifth}>
              <Text style={styles.internaltext}>
                {sugar > 10
                  ? "This drink may cause a significant glucose spike. Consider alternatives like water or unsweetened tea."
                  : sugar > 5
                  ? "This drink has moderate sugar. Consume in moderation for stable glucose levels."
                  : "This drink has low sugar, safer for glucose stability."}
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.containerthirds}>
          <Pressable
            style={[styles.scanButtons, logged && { backgroundColor: "#BFBFBF", borderColor: "#BFBFBF" }]}
            disabled={logged}
            onPress={() => handleAddToLog(product._id)}
          >
            <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.scanButtonTexts}>{logged ? "Already Added" : "Add to My Log"}</Text>
          </Pressable>

          <Pressable style={styles.scanButton} onPress={() => router.push("/scanner")}>
            <AntDesign name="scan" size={20} color="#F63E4C" />
            <Text style={styles.scanButtonText}> Scan Another</Text>
          </Pressable>
        </View>

        
      </ScrollView>

  );
}










