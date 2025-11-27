
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  RefreshControl,
  Platform,
  UIManager,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { GetData, GETALLFAQ } from "@/service/Api";
import { router, useRouter } from "expo-router";

// Enable smooth animations on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --------------------- CARD COMPONENT ---------------------
const Card = ({ item }: any) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <Pressable style={styles.button}>
        <Text
          style={styles.readMore}
          onPress={() =>
            router.push({
              pathname: "/(tab)/article",
              params: { id: item._id },
            })
          }
        >
          Read More
        </Text>
      </Pressable>
    </View>
  );
};



// --------------------- FAQ CARD COMPONENT ---------------------
const FaqCard = ({ item, expandedId, setExpandedId }: any) => {
  const isExpanded = expandedId === item._id;
  const animation = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isExpanded ? contentHeight : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isExpanded, contentHeight]);

  const rotate = animation.interpolate({
    inputRange: [0, contentHeight],
    outputRange: ["0deg", "180deg"],
  });

  const toggleExpand = () => {
    setExpandedId(isExpanded ? null : item._id);
  };

  return (
    <View style={styles.faqCard}>
      <TouchableOpacity activeOpacity={0.8} style={styles.faqHeader} onPress={toggleExpand}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Animated.View
          style={[
            styles.iconCircle,
            isExpanded && styles.iconCircleActive,
            { transform: [{ rotate }] },
          ]}
        >
          <Ionicons
            name={isExpanded ? "remove" : "add"}
            size={30}
            color={isExpanded ? "#fff" : "#1B1919"}
            style={{ fontWeight: "400" }}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.faqAnswerContainer,
          {
            height: animation,
            opacity: animation.interpolate({
              inputRange: [0, 10],
              outputRange: [0, 1],
            }),
            overflow: "hidden",
          },
        ]}
      >
        {isExpanded && (
          <View
            style={{ position: "absolute", top: 0, left: 0, right: 0 }}
            onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
          >
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

// --------------------- MAIN LEARN SCREEN ---------------------
export default function Learn() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [expandedId, setExpandedId] = useState(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [FAQS, setFAQS] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );
const scroll = useRef<ScrollView>(null);

useFocusEffect(
  React.useCallback(() => {
    // Reset scroll to top
    scroll.current?.scrollTo({ y: 0, animated: false });

    // Re-fetch data every time the screen comes into focus
    fetchArticles();

    return () => {}; // optional cleanup
  }, [])
);
  const fetchArticles = async () => {
    try {
      if (!refreshing) setLoading(true);

      const data = await GetData();
      const FAQ = await GETALLFAQ();

      const articlesArray = data?.getAllArticle.articles.map((article: any) => {
        let imageUrl = article.image;
        if (!imageUrl.startsWith("http")) {
          imageUrl = `https://sipsthatspike.s3.eu-north-1.amazonaws.com/articles/${imageUrl}`;
        }

        const keyNumbers = article.keyNumbers?.map((kn: any) => {
          let knImage = kn.image;
          if (!knImage.startsWith("http")) {
            knImage = `https://sipsthatspike.s3.eu-north-1.amazonaws.com/keynumbers/${knImage}`;
          }
          return { ...kn, image: knImage };
        });

        return { ...article, image: imageUrl, keyNumbers };
      });

      setArticles(articlesArray || []);
      setFAQS(FAQ?.faqs?.faqs || []);
    } catch (error) {
      // console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchArticles();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F63E4C" />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  return (
    // <SafeAreaView style={styles.safeArea}>
      <ScrollView
      style={{flex:1,backgroundColor:"#fff"}}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F63E4C"]}
            tintColor="#F63E4C"
          />
        }
      >
        {/* <View style={styles.container}>
          {Array.isArray(articles) && articles.length > 0 ? (
            articles.map((item) => <Card key={item._id} item={item} />)
          ) : (
            <Text>No articles found</Text>
          )}

          <Text style={styles.sectionTitle}>FAQ</Text>
          <View style={styles.faqContainer}>
            {FAQS.map((item) => (
              <FaqCard
                key={item._id}
                item={item}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
              />
            ))}
          </View>
        </View> */}

<View style={styles.container}>
  {/* Articles Section */}
  {Array.isArray(articles) && articles.length > 0 ? (
    articles.map((item) => <Card key={item._id} item={item} />)
  ) : (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyTitle}>No Articles Available</Text>
      <Text style={styles.emptySub}>
        We couldn't find any articles right now. Please check back later.
      </Text>
    </View>
  )}

  {/* FAQ Section */}
  <Text style={styles.sectionTitle}>FAQ</Text>
  <View style={styles.faqContainer}>
    {Array.isArray(FAQS) && FAQS.length > 0 ? (
      FAQS.map((item) => (
        <FaqCard
          key={item._id}
          item={item}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />
      ))
    ) : (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyTitle}>No FAQs Available</Text>
        <Text style={styles.emptySub}>
          FAQ section is currently empty. We'll update it soon!
        </Text>
      </View>
    )}
  </View>
</View>

      </ScrollView>
    // </SafeAreaView>
  );
}

// --------------------- STYLES ---------------------
const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: "74@ms",
  },
  emptyBox: {
    marginTop:"40%",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 20,
},
emptyTitle: {
  fontSize: 16,
  fontWeight: "600",
  color: "#444",
},
emptySub: {
  fontSize: 14,
  color: "#777",
  marginTop: 5,
  textAlign: "center",
  width: "80%",
},

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
  container: {
    flex: 1,
    height:"90%",
    padding: "10@s",
    // borderWidth:1,
    // borderColor:"black",
    // paddingBottom: "30@s",
    backgroundColor: "#fff",
    paddingBottom: "120@ms",
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: "10@s",
    padding: "12@s",
    marginBottom: "15@vs",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: "6@s",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "180@vs",
    borderRadius: "10@s",
    marginBottom: "10@vs",
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: "18@ms",
    color: "#1B1919",
    lineHeight: "28@ms",
    marginBottom: "6@vs",
  },
  description: {
    fontFamily: "Poppins_400Medium",
    fontSize: "15@ms",
    lineHeight: "22@ms",
    color: "#75748E",
  },
  button: {
    marginTop: "18@vs",
    width: "158@ms",
    height: "42@ms",
    borderRadius: "30@ms",
    backgroundColor: "#F63E4C",
    justifyContent: "center",
    alignItems: "center",
  },
  readMore: {
    fontFamily: "Poppins_500Medium",
    fontWeight: "700",
    fontSize: "16@ms",
    color: "#FFFFFF",
  },
  sectionTitle: {
    marginLeft: "10@ms",
    fontFamily: "Poppins_600SemiBold",
    fontSize: "20@ms",
    color: "#1B1919",
    marginVertical: "10@vs",
  },
  faqContainer: {},
  faqCard: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDF2",
    paddingVertical: "5@vs",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "10@vs",
    paddingHorizontal: "5@s",
    marginTop: "10@vs",
  },
  faqQuestion: {
    fontFamily: "Poppins_500Medium",
    fontSize: "16@ms",
    color: "#1B1919",
    flex: 1,
  },
  iconCircle: {
    width: "28@ms",
    height: "28@ms",
    borderRadius: "14@ms",
    borderWidth: 1,
    borderColor: "#E8E8FF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7FF",
  },
  iconCircleActive: {
    backgroundColor: "#F63E4C",
    borderColor: "#F63E4C",
  },
  faqAnswerContainer: {
    paddingHorizontal: "5@s",
    paddingBottom: "10@vs",
  },
  faqAnswer: {
    fontFamily: "Poppins_400Regular",
    fontSize: "13@ms",
    lineHeight: "20@ms",
    color: "#75748E",
    paddingBottom: "10@vs",
  },
});























