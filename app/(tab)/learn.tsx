import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LEARN_SECTIONS = [
  {
    id: "1",
    title: "Understanding Sugar-Sweetened Beverages (SSBs)",
    content: `Sugar-sweetened beverages (SSBs) are drinks that have sugars added during processing or preparation. These added sugars may include sucrose (table sugar), high-fructose corn syrup, honey, or other caloric sweeteners.

Examples of SSBs:
• Soda and soft drinks
• Fruit-flavored drinks (not 100% juice)
• Sweetened teas
• Energy drinks
• Sports drinks
• Flavored waters
• Sweetened coffee drinks

Not typically considered SSBs:
• 100% fruit juice
• Unsweetened beverages
• Diet sodas
• Black coffee
• Plain tea

Regular consumption of SSBs has been associated in research with outcomes such as weight gain, dental cavities, and metabolic health concerns.`,
  },
  {
    id: "2",
    title: "Calories vs. Sugar: What's the Difference?",
    content: `Calories measure the amount of energy in food or drinks. Sugar is one type of ingredient that provides calories.

All sugar contains calories, but not all calories come from sugar.

Calories per gram:
• Carbohydrates (including sugar): 4 cal/g
• Protein: 4 cal/g
• Fat: 9 cal/g
• Alcohol: 7 cal/g

Examples:
• Some foods are high in calories but contain little or no sugar (like oils).
• Some foods contain natural sugars but also fiber and nutrients (like fruit).
• Some products may be high in both sugar and calories (like candy or soda).`,
  },
  {
    id: "3",
    title: "Understanding the Glycemic Index (GI)",
    content: `The Glycemic Index (GI) is a scale (0–100) that estimates how quickly carbohydrate-containing foods or drinks raise blood sugar levels.

• Low GI foods: Tend to raise blood sugar more gradually
• High GI foods: Tend to raise blood sugar more quickly

GI does not measure overall nutrition—it only reflects how quickly carbohydrates are absorbed.

Important note:
Some foods that are not sweet (like white bread or potatoes) can still have a high GI, while some fruits have a lower GI due to fiber and other nutrients.`,
  },
  {
    id: "4",
    title: "Reading Nutrition Labels",
    content: `Nutrition labels provide helpful information about what's in a food or drink.

Key sections:
• Total Carbohydrates: Includes sugars, starches, and fiber
• Dietary Fiber: Supports digestion
• Total Sugars: Includes both natural and added sugars
• Added Sugars: Sugars added during processing

Example label:
• Total Carbohydrates: 30g
• Dietary Fiber: 5g
• Total Sugars: 10g
• Includes Added Sugars: 6g

This means the product contains a mix of fiber, sugars, and other carbohydrates.`,
  },
  {
    id: "5",
    title: "Names for Added Sugars",
    content: `Added sugars can appear under many different names on ingredient lists.

Common types:
• Words ending in "-ose" (e.g., glucose, fructose, sucrose)
• Syrups (e.g., corn syrup, maple syrup, agave)
• Other names (e.g., cane sugar, evaporated cane juice, molasses)

Ingredients are listed in order by quantity, so items near the top appear in larger amounts.`,
  },
  {
    id: "6",
    title: "General Tips for Evaluating Drinks",
    content: `When comparing beverages, people often look at:
• Amount of added sugar
• Total carbohydrates
• Ingredient list

Drinks with little or no added sugar and fewer refined ingredients are often considered different from highly sweetened beverages.`,
  },
  {
    id: "7",
    title: "GI and GL of Common Drinks",
    content: `• Water: GI 0, GL 0
• Soda: GI ~63–68, typically higher GL due to sugar content
• Orange juice (100%): GI ~50–57
• Apple juice: GI ~40–44
• Milk: Low GI (~30–34), but still affects insulin response
• Unsweetened soy milk: Low GI and low GL
• Sweet tea / fruit punch: Often higher GI and GL if sweetened
• Sports drinks: Can have high GI
• Black coffee / unsweetened tea: GI 0, GL 0

These values are estimates and can vary based on formulation and serving size.`,
  },
  {
    id: "8",
    title: "Glycemic Index vs. Insulin Index",
    content: `Glycemic Index (GI): Measures how quickly blood sugar rises.

Insulin Index (II): Measures how much insulin the body releases.

These are different measurements. Some foods may have a low GI but still produce an insulin response.`,
  },
  {
    id: "9",
    title: "About Blood Sugar and Metabolic Health",
    content: `Metabolic conditions, including prediabetes and type 2 diabetes, are being studied increasingly in children and adolescents.

Research organizations such as the Centers for Disease Control and Prevention report that a significant number of U.S. adolescents show indicators associated with prediabetes.

Studies from institutions like the Harvard T.H. Chan School of Public Health have examined links between frequent consumption of sugary beverages and changes in how the body processes sugar and insulin.

Sugary drinks can contain large amounts of added sugar—for example, a typical 12-ounce soda may contain around 39 grams.

Unlike many solid foods, beverages may be consumed quickly and may not create the same sense of fullness, which can influence total energy intake.`,
  },
];

const AccordionSection = ({
  item,
  expandedId,
  setExpandedId,
}: {
  item: (typeof LEARN_SECTIONS)[number];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) => {
  const isExpanded = expandedId === item.id;
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
    inputRange: [0, Math.max(contentHeight, 1)],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.sectionHeader}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <Animated.View
          style={[
            styles.iconCircle,
            isExpanded && styles.iconCircleActive,
            { transform: [{ rotate }] },
          ]}
        >
          <Ionicons
            name={isExpanded ? "remove" : "add"}
            size={20}
            color={isExpanded ? "#fff" : "#1B1919"}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={{
          height: animation,
          overflow: "hidden",
          opacity: animation.interpolate({
            inputRange: [0, 10],
            outputRange: [0, 1],
          }),
        }}
      >
        {isExpanded && (
          <View
            style={{ position: "absolute", top: 0, left: 0, right: 0 }}
            onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
          >
            <Text style={styles.sectionContent}>{item.content}</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default function Learn() {
  const scrollRef = useRef<ScrollView>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.intro}>
          Learn about sugar-sweetened beverages, glycemic index, and how to make
          informed choices about what you drink.
        </Text>
        {LEARN_SECTIONS.map((item) => (
          <AccordionSection
            key={item.id}
            item={item}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
        ))}

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Important Note</Text>
          <Text style={styles.noteContent}>
            This information is intended for general educational purposes only
            and does not replace guidance from qualified healthcare
            professionals. Individual nutritional needs and health
            considerations can vary.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = ScaledSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: "16@ms",
    paddingTop: "12@ms",
    paddingBottom: "120@ms",
    backgroundColor: "#fff",
  },
  intro: {
    fontFamily: "Poppins_400Regular",
    fontSize: "14@ms",
    color: "#75748E",
    lineHeight: "22@ms",
    marginBottom: "16@ms",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDF2",
    paddingVertical: "4@vs",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "12@vs",
    paddingHorizontal: "4@s",
  },
  sectionTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: "15@ms",
    color: "#1B1919",
    flex: 1,
    paddingRight: "8@ms",
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
  sectionContent: {
    fontFamily: "Poppins_400Regular",
    fontSize: "13@ms",
    lineHeight: "21@ms",
    color: "#75748E",
    paddingHorizontal: "4@s",
    paddingBottom: "14@vs",
  },
  noteCard: {
    marginTop: "20@vs",
    backgroundColor: "#FFF6F1",
    borderLeftWidth: 4,
    borderLeftColor: "#F63E4C",
    borderRadius: "8@ms",
    padding: "14@ms",
  },
  noteTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: "14@ms",
    color: "#1B1919",
    marginBottom: "6@vs",
  },
  noteContent: {
    fontFamily: "Poppins_400Regular",
    fontSize: "13@ms",
    lineHeight: "21@ms",
    color: "#75748E",
  },
});
