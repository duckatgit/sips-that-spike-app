

// import { Privicydata } from "@/utils/Privicy";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { router } from "expo-router";
// import React, { useLayoutEffect, useState } from "react";
// import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// export default function Notification() {
//   const navigation = useNavigation();
//   const [expandedIndex, setExpandedIndex] = useState(null);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerShown: true,
//       headerTitle: "Privacy & Security",
//       headerTitleAlign: "left",
//       headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
//       headerTitleStyle: {
//         fontFamily: "Poppins_600SemiBold",
//         fontSize: 18,
//         color: "#636363",
//       },
//       headerLeft: () => (
//         <TouchableOpacity
//           onPress={() => router.push("/profile")}
//           style={{ marginLeft: 16 }}
//         >
//           <View
//             style={{
//               width: 28,
//               height: 28,
//               alignItems: "center",
//               justifyContent: "center",
//               borderRadius: 10,
//               borderWidth: 1,
//               borderColor: "#FFEAEA",
//             }}
//           >
//             <Ionicons name="chevron-back-outline" size={26} color="#636363" />
//           </View>
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation]);

//   return (
//     <View style={{ flex: 1, padding: 16,backgroundColor:"#fff",marginBottom:70}}>
//      <ScrollView
//     style={{ flex: 1 }}
//     contentContainerStyle={{ padding: 16 }}
//     showsVerticalScrollIndicator={false}
//   >
//   <Text
//   style={{
//     textAlign: "center",
//     fontFamily: "Poppins_600SemiBold",
//     fontSize: 18,
//     marginBottom: 16,
//     color: "#222",
//   }}
// >
//   Privacy Policy
// </Text>
//     {Array.isArray(Privicydata) && Privicydata.length > 0 ? (
//       Privicydata.map((item, index) => {
//         const question = Object.values(item)[0];
//         const answer = Object.values(item)[1];
//         const isOpen = expandedIndex === index;

//         return (
//           <View
//             key={index}
//             style={{
//               borderWidth: 1,
//               borderColor: "#eee",
//               borderRadius: 8,
//               marginBottom: 12,
//               padding: 12,
//             }}
//           >
//             <TouchableOpacity
//               onPress={() =>
//                 setExpandedIndex(isOpen ? null : index)
//               }
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Text style={{ fontFamily: "Poppins_600SemiBold", flex: 1 }}>
//                 {question}
//               </Text>
//               <Ionicons
//                 name={isOpen ? "chevron-up" : "chevron-down"}
//                 size={20}
//               />
//             </TouchableOpacity>

//             {isOpen && (
//               <Text
//                 style={{
//                   marginTop: 10,
//                   color: "#666",
//                   lineHeight: 20,
//                 }}
//               >
//                 {answer}
//               </Text>
//             )}
//           </View>
//         );
//       })
//     ) : (
//       <Text>No Privacy Data Available</Text>
//     )}
//   </ScrollView>
//     </View>
//   );
// }






import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
export default function Notification() {
  const navigation = useNavigation();
const router=useRouter()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Terms & Conditions",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
      headerTitleStyle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 18,
        color: "#636363",
        marginleft:"10@ms"
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={{ marginLeft: 16, marginTop: -3 }}
        >
          <View style={{width:28,height:28,alignItems:"center",justifyContent:"center",borderRadius:"10",borderWidth:1,borderColor:"#FFEAEA"}}>

          <Ionicons name="chevron-back-outline" size={26} color="#636363" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
const currentYear = new Date().getFullYear();
  return (
   <View style={{ flex: 1, padding: 16 ,backgroundColor:"#fff"}}>
  <Text
    style={{
      fontSize: 14,
      lineHeight: 22,
      color: "#444",
      textAlign: "left",
      fontFamily: "Poppins_400Regular",
    }}
  >
    <Text
      style={{
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        color: "#222",
      }}
    >
    TERMS OF USE AGREEMENT, PRIVACY POLICY, and INFORMED CONSENT
      {"\n\n"}
    </Text>

    This Agreement governs the use of all products, software, services,
    applications, websites, and related content provided by Sips that Spike
    MD, LLC (“Sips that Spike,” “we,” “us,” or “our”). By clicking “Agree” or
    using the Service, you confirm that you have read, understood, and
    accepted these Terms of Use, the Privacy Policy, and the Informed Consent
    document. If you do not agree, you must not create an account or use the
    Service.
    {"\n\n"}
    The Service is not intended for medical emergencies. If you experience a
    medical emergency or believe one may exist, seek immediate in-person care
    or dial 911.
    {"\n\n"}
    The Service and all related information are provided “as is” and “as
    available,” without warranties of any kind.
    {"\n\n"}
  </Text>

  <Text
    style={{
      marginTop: 24,
      fontSize: 12,
      color: "#888",
      textAlign: "center",
      fontFamily: "Poppins_400Regular",
    }}
  >
    © Sips that Spike {currentYear}. All rights reserved.
  </Text>
</View>

  );
}

