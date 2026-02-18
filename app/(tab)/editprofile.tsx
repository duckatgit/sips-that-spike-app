
import { getuserbyid, updateUser } from "@/service/Api";
import { userEvent } from "@/utils/events";
import { useToast } from "@/utils/useToastHook";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  ActivityIndicator,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import CountryPicker, { Country, CountryCode, FlagType, getAllCountries } from "react-native-country-picker-modal";
import { z } from "zod";
import { styles } from "./editprofile.styles";

/* --------------------- Schema --------------------- */
const schema = z.object({
  firstName: z
    .string()
    .nonempty("First Name is required")
    .min(3, "Minimum 3 characters required")
    .max(40, "Maximum 40 characters allowed")
    .refine((val) => /^\S.*$/.test(val), "Cannot start with a space")
    .refine((val) => !/ {4,}/.test(val), "Only up to 3 spaces allowed")
    .refine((val) => /^[A-Za-z ]+$/.test(val), "Only alphabets and spaces are allowed"),
  lastName: z
    .string()
    .nonempty("Last Name is required")
    .min(3, "Minimum 3 characters required")
    .max(40, "Maximum 40 characters allowed")
    .refine((val) => /^\S.*$/.test(val), "Cannot start with a space")
    .refine((val) => !/ {4,}/.test(val), "Only up to 3 spaces allowed")
    .refine((val) => /^[A-Za-z ]+$/.test(val), "Only alphabets and spaces are allowed"),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val.length === 0 || val.length >= 8,
      "Not less than 8 digits"
    )
    .refine(
      (val) => !val || val.length === 0 || val.length <= 15,
      "Not more than 15 digits"
    )
    .refine(
      (val) => !val || val.length === 0 || /^[0-9]{8,15}$/.test(val),
      "Enter a valid phone number"
    ),
});

type FormValues = z.infer<typeof schema>;

/* --------------------- Phone Input --------------------- */
type PhoneInputProps = {
  value: string | undefined;
  onChange: (val: string) => void;
  countryCode: CountryCode;
  callingCode: string;
  onCountryChange: (country: CountryCode, code: string) => void;
};

const PhoneInput = ({ value, onChange, countryCode, callingCode, onCountryChange }: PhoneInputProps) => {
  const [localPhone, setLocalPhone] = useState(value || "");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setLocalPhone(value || "");
  }, [value]);

  const handleSelect = (country: Country) => {
    const code = country.callingCode[0] || "1";
    onCountryChange(country.cca2, code);
    setShowPicker(false);
  };

  return (
    <View style={[styles.phoneContainer, { flexDirection: "row", alignItems: "center" }]}>
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }} onPress={() => setShowPicker(true)}>
        <CountryPicker
          visible={showPicker}
          withFlag
          withFilter
          withEmoji
          countryCode={countryCode}
          onSelect={handleSelect}
          onClose={() => setShowPicker(false)}
        />
        <Text style={styles.callingText}>+{callingCode}</Text>
        <Ionicons name="chevron-down" size={18} color="#38242D" style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      <TextInput
        style={[styles.phoneInput, { flex: 1 }]}
        placeholder="Enter Phone Number"
        value={localPhone}
        keyboardType="phone-pad"
        onChangeText={(text) => {
          const digits = text.replace(/\D/g, "");
          setLocalPhone(digits);
          // Pass "" when empty so optional schema accepts it
          onChange(digits);
        }}
      />

      <Ionicons name="call-outline" size={20} color="#6B2D4C" style={{ marginLeft: 8 }} />
    </View>
  );
};

/* --------------------- Get country by calling code --------------------- */
const getCountryCodeFromCallingCode = async (callingCode: string): Promise<{ countryCode: CountryCode }> => {
  const allCountries = await getAllCountries(FlagType.FLAT);
  const country = allCountries?.find((c) => c.callingCode?.includes(callingCode));
  return { countryCode: country?.cca2 ?? "US" };
};




/* --------------------- Main Component --------------------- */
export default function EditProfile() {
  const navigation = useNavigation();
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');

  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = useState("91");

  const originalRef = useRef({
    firstName: "",
    lastName: "",
    phone: "",
    callingCode: "91",
    image: "",
  });

  const { control, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { firstName: "", lastName: "", phone: "" },
  });

  const isModified =
    watch("firstName") !== originalRef.current.firstName ||
    watch("lastName") !== originalRef.current.lastName ||
    watch("phone") !== originalRef.current.phone ||
    callingCode !== originalRef.current.callingCode ||
    profileImage !== originalRef.current.image;

  /* --------------------- Android Bottom Sheet --------------------- */
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [showSheet, setShowSheet] = useState(false);

  const openSheet = () => {
    console.log("open sheet ======")
    setShowSheet(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 230,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    console.log("close sheet ======")

    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowSheet(false));
  };


  /* --------------------- Header --------------------- */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "",
      headerTitleAlign: "left",
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
  }, []);

  /* --------------------- Fetch Profile --------------------- */
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res: any = await getuserbyid();
      const user = res?.data?.getUserById;
      if (!user) return;

      const [code, number] = user.phone?.replace("+", "").split("-") || ["91", ""];
      const countryIso = await getCountryCodeFromCallingCode(code);

      setCountryCode(countryIso?.countryCode);
      setCallingCode(code || "91");
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("phone", number || "");
      setProfileImage(user.image || "");

      originalRef.current = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: number || "",
        callingCode: code || "91",
        image: user.image || "",
      };
    } catch {
      showToast("error", "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);
  useFocusEffect(useCallback(() => { fetchProfile(); }, []));

  /* --------------------- Image Picker --------------------- */
  const pickFromCamera = async () => {
    // const perm = await ImagePicker.requestCameraPermissionsAsync();


    await new Promise(resolve => setTimeout(resolve, 500));
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log("permpermperm === ", status)
    if (status !== "granted") {
      return showToast("error", "Camera permission is required");


    }

    // if (!perm.granted) return showToast("error", "Camera access needed");
    console.log("CACCSACACAS before break === ")
    try {
      const result = await ImagePicker?.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
      console.log("CACCSACACAS === ", result)
      if (!result.canceled) setProfileImage(result?.assets[0]?.uri);
    }
    catch (err) {
      console.log("Camera error:", err);
    }

  };

  const pickFromGallery = async () => {
    console.log("its inside enter")
    await new Promise(resolve => setTimeout(resolve, 500));
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("permission given or run", perm);
    if (!perm.granted) return showToast("error", "Gallery access Required");

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const openImagePickerOptions = () => {
    openSheet();
  };

  /* --------------------- Submit --------------------- */

  const onSubmit = async (data: FormValues) => {
    if (!isModified) return showToast("info", "No changes detected");

    setUpdating(true);
    const safeImage = profileImage ?? "";
    try {
      const phone = data.phone && data.phone.trim().length > 0
        ? `+${callingCode}-${data.phone}`
        : "";
      await updateUser({ ...data, phone, image: profileImage });
      showToast("success", "Profile updated");

      originalRef.current = { ...data, phone: data.phone || "", callingCode, image: profileImage };


      userEvent.emit("profileUpdated", { name: `${data.firstName} ${data.lastName}`, image: profileImage });
    } catch {
      showToast("error", "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#F63E4C" style={{ flex: 1 }} />;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.text}>Edit Profile</Text>

          <TouchableOpacity onPress={openImagePickerOptions}>
            <View style={styles.box}>
              <View style={styles.container}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 100 }} />
                ) : (
                  <EvilIcons name="camera" size={100} color="#F03745" />
                )}
              </View>
              <Text style={styles.texts}>Update your profile picture</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <Text style={styles.label}>First Name</Text>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { value, onChange, onBlur } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput value={value} onChangeText={onChange} onBlur={onBlur} style={styles.input} />
                  <EvilIcons name="user" size={22} color="#A9A9A9" />
                </View>
              )}
            />
            {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}

            <Text style={styles.label}>Last Name</Text>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { value, onChange, onBlur } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput value={value} onChangeText={onChange} onBlur={onBlur} style={styles.input} />
                  <EvilIcons name="user" size={22} color="#A9A9A9" />
                </View>
              )}
            />

            {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}
            <Text style={styles.label}>
              Phone Number{" "}
              <Text style={{ fontSize: 13, color: "#9C7A7D", fontWeight: "400" }}>(Optional)</Text>
            </Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { value, onChange } }) => (
                <PhoneInput
                  value={value}
                  onChange={onChange}
                  countryCode={countryCode}
                  callingCode={callingCode}
                  onCountryChange={(c, code) => {
                    setCountryCode(c);
                    setCallingCode(code);
                  }}
                />
              )}
            />
            {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

            <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={!isModified || updating} style={[styles.btn, (!isModified || updating) && { opacity: 0.5 }]}>
              {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Update</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* --------------------- Android Bottom Sheet --------------------- */}
      <Modal visible={showSheet} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={closeSheet} />

        <Animated.View
          style={[styles.sheetBox, { transform: [{ translateY: slideAnim }] }]}
        >
          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => {
              closeSheet();
              setTimeout(() => {
                pickFromCamera();
              }, 300);

            }}
          >
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => {
              closeSheet();
              setTimeout(() => {
                pickFromGallery();
              }, 300);

            }}
          >
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </KeyboardAvoidingView>
  );
}





