

import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ActionSheetIOS,
  Modal,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import CountryPicker, { Country } from "react-native-country-picker-modal";
import * as ImagePicker from "expo-image-picker";
import { getuserbyid, updateUser } from "@/service/Api";
import { userEvent } from "@/utils/events";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useToast } from "@/utils/useToastHook";
import type { CountryCode } from "react-native-country-picker-modal";
// -------------------------
// Validation Schema
// -------------------------
const schema = z.object({
  firstName: z
    .string()
    .nonempty("First Name is required")
    .max(40, "Maximum 40 characters allowed")
    .refine((val) => /^\S.*$/.test(val), "Cannot start with a space")
    .refine((val) => !/ {4,}/.test(val), "Only up to 3 spaces allowed"),
  lastName: z
    .string()
    .nonempty("Last Name is required")
    .max(40, "Maximum 40 characters allowed")
    .refine((val) => /^\S.*$/.test(val), "Cannot start with a space")
    .refine((val) => !/ {4,}/.test(val), "Only up to 3 spaces allowed"),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .max(15, "Not more than 15 digits")
    .regex(/^[0-9]{6,15}$/, "Enter a valid phone number without special chars"),
});

// -------------------------
// Phone Input Component
// -------------------------
const ProfilePhoneInput = ({ value, onChange }: any) => {
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [localPhone, setLocalPhone] = useState(value || "");
  const [showPicker, setShowPicker] = useState(false);


  useEffect(() => {
    onChange(localPhone.trim());
  }, [localPhone]);

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0] || "");
    setShowPicker(false);
  };

  return (
    <View style={styles.phoneContainer}>
      <TouchableOpacity
        style={styles.flagBtn}
        onPress={() => setShowPicker(true)}
      >
        <CountryPicker
          visible={showPicker}
          withFlag
          withFilter
          withEmoji
          countryCode={countryCode}
          onSelect={onSelect}
          onClose={() => setShowPicker(false)}
        />
        <Text style={styles.callingText}>+{callingCode}</Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color="#38242D"
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>

      <TextInput
        style={styles.phoneInput}
        placeholder="Enter Phone Number"
        value={localPhone}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, "");
          setLocalPhone(numericText);
        }}
        keyboardType="phone-pad"
        placeholderTextColor="#88767F"
        maxLength={15}
      />

      <Ionicons name="call-outline" size={20} color="#6B2D4C" />
    </View>
  );
};

// -------------------------
// EditProfile Component
// -------------------------
export default function EditProfile() {
  const navigation = useNavigation();
  const router = useRouter();
const { showToast } = useToast();
const showToastNotification = (type: string, msg: string) => {
    console.log("EEERERERERERE", type);
//  showToast(type, msg);

 showToast(type, msg)
 
  };
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [callingCode, setCallingCode] = useState("91");

  // ---------- Bottom Sheet States ----------
  const [showSheet, setShowSheet] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const openSheet = () => {
    setShowSheet(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 230,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowSheet(false));
  };
  // ----------------------------------------

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 ,borderwidth:1,},
      headerTitleStyle: { fontFamily: "Poppins_600SemiBold", fontSize: 18 },
     headerLeft: () => (
  <TouchableOpacity
    onPress={() => router.push("/(tab)/profile")}
    style={{ marginLeft: 16, marginTop: -3 }}
  >
    <View style={styles.backContainer}>
      <View style={styles.backbtn}>
      <Ionicons name="chevron-back-outline" size={26} color="#636363" />
      </View>
      <Text style={styles.backText}>Back</Text>
    </View>
  </TouchableOpacity>
),

    });
  }, [navigation]);

  const handleNoLeadingSpace = (text: string, onChange: any) =>
    onChange(text.trimStart());

  // Load user data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getuserbyid();
        const user = response.data.getUserById;

        setValue("firstName", user.firstName || "");
        setValue("lastName", user.lastName || "");
        setValue("phone", user.phone?.replace(/^\+?\d{1,3}/, "") || "");

        if (user.image) setProfileImage(user.image);

        if (user.phone) {
          const match = user.phone.match(/^\+(\d{1,3})/);
          if (match) setCallingCode(match[1]);
        }
      } catch (error) {
        showToastNotification("error", "Failed to fetch profile data");
       
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Camera + Gallery Actions
  const pickFromCamera = async () => {
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPerm.granted) {
        showToastNotification("Permission required",  "Camera access is needed.");
     
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!galleryPerm.granted) {
      showToastNotification("Permission required",  "Gallery access is needed.");
   
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  // ⬇️ UPDATE: Android bottom-sheet instead of
  const openImagePickerOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Gallery"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickFromCamera();
          if (buttonIndex === 2) pickFromGallery();
        }
      );
    } else {
      openSheet(); 
    }
  };

  // Submit Handler
  const onSubmit = async (data: any) => {
    try {
      setUpdating(true);
      const fullPhone = `+${callingCode}${data.phone}`;

      const payload = {
        ...data,
        phone: fullPhone,
        image: profileImage,
      };

      const response = await updateUser(payload);
      if(response.status===true){
        showToastNotification("error", "Profile updated successfully!");
     
      }
// showToastNotification("Success", response.message);

      userEvent.emit("profileUpdated", {
        name: `${response.updateUser.firstName} ${response.updateUser.lastName}`,
        email: response.updateUser.email || "",
        image: response.updateUser.image || "",
      });
    } catch (error: any) {
      showToastNotification("error", error?.message || "Failed to update profile!");
     
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F03745" />
      </View>
    );
  }

  return (
 
      <>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.text}>Edit Profile</Text>

            {/* Profile Pic */}
            <TouchableOpacity onPress={openImagePickerOptions}>
              <View style={styles.box}>
                <View style={styles.container}>
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={{ width: 100, height: 100, borderRadius: 100 }}
                    />
                  ) : (
                    <EvilIcons name="camera" size={100} color="#F03745" />
                  )}
                </View>
                <Text style={styles.texts}>Update your profile picture</Text>
              </View>
            </TouchableOpacity>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* First Name */}
              <Text style={styles.label}>First Name</Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      placeholder="Enter first name"
                      placeholderTextColor="#A9A9A9"
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={(text) =>
                        handleNoLeadingSpace(text, onChange)
                      }
                      value={value}
                    />
                    <EvilIcons name="user" size={22} color="#A9A9A9" />
                  </View>
                )}
              />
              {errors.firstName && (
                <Text style={styles.error}>{errors.firstName.message}</Text>
              )}

              {/* Last Name */}
              <Text style={styles.label}>Last Name</Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      placeholder="Enter last name"
                      placeholderTextColor="#A9A9A9"
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={(text) =>
                        handleNoLeadingSpace(text, onChange)
                      }
                      value={value}
                    />
                    <EvilIcons name="user" size={22} color="#A9A9A9" />
                  </View>
                )}
              />
              {errors.lastName && (
                <Text style={styles.error}>{errors.lastName.message}</Text>
              )}

              {/* Phone */}
              <Text style={styles.label}>Phone Number</Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <ProfilePhoneInput value={value} onChange={onChange} />
                )}
              />
              {errors.phone && (
                <Text style={styles.error}>{errors.phone.message}</Text>
              )}

              {/* Submit */}
              <TouchableOpacity
                style={styles.btn}
                onPress={handleSubmit(onSubmit)}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Update </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

   
      <Modal visible={showSheet} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={closeSheet} />

        <Animated.View
          style={[styles.sheetBox, { transform: [{ translateY: slideAnim }] }]}
        >
          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => {
              closeSheet();
              pickFromCamera();
            }}
          >
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => {
              closeSheet();
              pickFromGallery();
            }}
          >
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
      
   </>
  );
}



const styles = ScaledSheet.create({
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: "6@ms",
  },

  backText: {
    fontSize: "16@ms",
    fontFamily: "Poppins_600SemiBold",
    color: "#636363",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: "10@ms",
  },

  scrollContainer: {
    paddingBottom: "300@ms",
    minHeight: "80%",
    backgroundColor: "white",
  },

  backbtn: {
    width: "28@ms",
    height: "28@ms",
    borderRadius: "10@ms",
    justifyContent: "center",
    alignItems: "center", // ❗ fixed (use alignItems vs alignContent)
    borderWidth: 1,
    borderColor: "#FFEAEA",
  },

  container: {
    width: "147@ms",
    height: "147@ms",
    borderWidth: 2,
    borderColor: "#F03745",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "100@ms",
    backgroundColor: "#F8F8FF",
  },

  box: {
    width: "360@ms",
    height: "190@ms",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginLeft: "7@ms",
    marginTop: "20@ms",
    gap: "10@ms",
  },

  text: {
    marginTop: "20@ms",
    fontFamily: "Poppins_600SemiBold",
    fontSize: "21@ms",
    color: "#1B1919",
    textTransform: "capitalize",
    marginLeft: "10@ms",
  },

  texts: {
    fontFamily: "Poppins_500Medium",
    fontSize: "14@ms",
    color: "#1B1919",
    textTransform: "capitalize",
  },

  formContainer: {
    paddingHorizontal: "15@ms",
    marginTop: "15@ms",
  },

  label: {
    fontFamily: "Poppins_500Medium",
    fontSize: "13@ms",
    color: "#7E7E7E",
    marginBottom: "5@ms",
    marginTop: "10@ms",
  },

  inputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: "6@ms",
    paddingHorizontal: "10@ms",
    paddingVertical: Platform.OS === "ios" ? "10@ms" : "5@ms",
    marginBottom: "3@ms",
  },

  input: {
    flex: 1,
    fontSize: "13@ms",
    color: "#1B1919",
    fontFamily: "Poppins_500Medium",
  },

  phoneContainer: {
    height: "50@ms",
    borderWidth: 1,
    borderColor: "#EDE6EF",
    borderRadius: "8@ms",
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "12@ms",
  },

  flagBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "8@ms",
  },

  callingText: {
    fontSize: "15@ms",
    color: "#38242D",
    fontWeight: "700",
    marginLeft: "4@ms",
  },

  phoneInput: {
    flex: 1,
    fontSize: "15@ms",
    color: "#38242D",
  },

  error: {
    color: "#F03745",
    fontSize: "12@ms",
    marginTop: "2@ms",
    fontFamily: "Poppins_500Medium",
  },

  btn: {
    backgroundColor: "#F03745",
    borderRadius: "50@ms",
    paddingVertical: "15@ms",
    alignItems: "center",
    marginTop: "50@ms",
    marginBottom: "40@ms",

    // iOS Shadow
    shadowColor: "#000",        // fixed
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    // Android
    elevation: 6,
  },

  btnText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium", // fixed extra spaces
    fontSize: "22@ms",
    lineHeight: "22@ms",
  },

  // --------- BOTTOM SHEET ----------
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sheetBox: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: "20@ms",
    borderTopRightRadius: "20@ms",
    paddingVertical: "15@ms",
    paddingBottom: "25@ms",
  },

  optionBtn: {
    paddingVertical: "15@ms",
  },

  optionText: {
    fontSize: "17@ms",
    textAlign: "center",
    color: "#007AFF",
    fontFamily: "Poppins_500Medium",
  },

  cancelBtn: {
    marginTop: "10@ms",
    paddingVertical: "15@ms",
    backgroundColor: "#f2f2f2",
  },

  cancelText: {
    fontSize: "17@ms",
    textAlign: "center",
    color: "red",
    fontFamily: "Poppins_500Medium",
  },
});
