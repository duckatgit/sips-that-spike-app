

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Signup } from "@/service/Api";
import CountryPicker, { Country } from "react-native-country-picker-modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {useToast} from '../utils/useToastHook';
// ----------------------
// ZOD VALIDATION
// ----------------------
export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(40, "Name must be less than 40 characters")
    .refine((val) => /^\S.*$/.test(val), "Cannot start with a space"),
  lastName: z
    .string()
    .max(40, "Last name must be less than 40 characters")
    
    .refine((val) => !val || !val.startsWith(" "), "Cannot start with a space"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .refine((val) => !val.startsWith(" "), "Cannot start with a space"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{10,15}$/, "Enter a valid phone number"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Minimum 8 characters")
    .max(20, "Maximum 20 characters")
    .refine(
      (val) =>
        !val.startsWith(" ") &&
        /[A-Z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      "Password must include uppercase, number, and special character"
    ),
});

type SignUpData = z.infer<typeof signUpSchema>;

// ----------------------
// Phone Input Component
// ----------------------
function PhoneInput({ value, onChange }: any) {
  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [localPhone, setLocalPhone] = useState(value || "");
  const [showPicker, setShowPicker] = useState(false);
const [didType, setDidType] = useState(false);
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0] || "");
    setShowPicker(false);
  };

  useEffect(() => {
      if (!didType) return; 
    const full = localPhone.trim()
      ? `+${callingCode}${localPhone.trim()}`
      : "";
    onChange(full);
  }, [localPhone, callingCode]);

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
          //@ts-ignore
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
        // onChangeText={setLocalPhone}
        onChangeText={(t) => {
          setDidType(true);   // 🔥 now start validation only after typing
          setLocalPhone(t);
        }}
        keyboardType="phone-pad"
        placeholderTextColor="#88767F"
      />

      <Ionicons name="call-outline" size={20} color="#6B2D4C" />
    </View>
  );
}

// ----------------------
// SIGNUP SCREEN
// ----------------------
export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const { showToast } = useToast();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });
  const showToastNotification = (type: string, msg: string) => {
    console.log("EEERERERERERE", type);
//  showToast(type, msg);

 showToast(type, msg)
 
  };




  const onSubmit = async (data: SignUpData) => {
  setLoading(true);
  try {
    const result = await Signup(data);
    console.log("result", result);
    setLoading(false);

    if (result.status === true) {
      // Show success toast
      reset(),
      showToastNotification(
        "success",
        result.message ? result.message : "Account Created Successfully!"
      );

      // Navigate after a small delay so toast is visible
      setTimeout(() => {
        router.push({
          pathname: "/otpVerifyScreen",
          params: { email: data.email },
        });
      }, 500); // 500ms delay (adjust if needed)
    } else {
      // Show error toast
      showToastNotification(
        "error",
        result.message ? result.message : "Signup failed!"
      );
    }
  } catch (err: any) {
    setLoading(false);
    showToastNotification(
      "error",
      err?.response?.data?.message || "Something went wrong!"
    );
  }
};

  const trimStart = (t: string) => t.trimStart();
console.log("errors",errors);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F8" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
         
        enableOnAndroid
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>
            Create your Sips That Spike account!
          </Text>

          {/* FIRST NAME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              First Name <Text style={styles.star}>*</Text>
            </Text>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter first name"
                    value={value}
                    onChangeText={(t) => onChange(trimStart(t))}
                    placeholderTextColor="#9C7A7D"
                  />
                  <Ionicons name="person-outline" size={20} color="#F2AFA9" />
                </View>
              )}
            />
            {errors.firstName && (
              <Text style={styles.error}>{errors.firstName.message}</Text>
            )}
          </View>

          {/* LAST NAME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <Controller
              name="lastName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter last name"
                    value={value}
                    onChangeText={(t) => onChange(trimStart(t))}
                    placeholderTextColor="#9C7A7D"
                  />
                  <Ionicons name="person-outline" size={20} color="#F2AFA9" />
                </View>
              )}
            />
             {errors.lastName && (
              <Text style={styles.error}>{errors.lastName.message}</Text>
            )}
          </View>

          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email <Text style={styles.star}>*</Text>
            </Text>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(t) => onChange(t.trim())}
                    placeholderTextColor="#9C7A7D"
                  />
                  <Ionicons name="mail-outline" size={20} color="#F2AFA9" />
                </View>
              )}
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
          </View>

          {/* PHONE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone Number <Text style={styles.star}>*</Text>
            </Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { value, onChange } }) => (
                <PhoneInput value={value} onChange={onChange} />
              )}
            />
            {errors.phone && (
              <Text style={styles.error}>{errors.phone.message}</Text>
            )}
          </View>

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Password <Text style={styles.star}>*</Text>
            </Text>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#9C7A7D"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={!showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#F2AFA9"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
          </View>

          {/* SUBMIT */}
          <LinearGradient
            colors={["#D82370", "#D21D2B"]}
            style={styles.signinBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              style={styles.signBtn}
              onPress={handleSubmit(onSubmit)}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.signText}>Sign Up</Text>
              )}
            </TouchableOpacity>

                          </LinearGradient>
              <Text style={styles.signupText}>
                          Already have an account?{" "}
                          <Text
                            style={styles.signupLink}
                            onPress={() => router.push("/signin")}
                          >
                            Sign In
                          </Text>
                        </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

// ----------------------
// STYLES
// ----------------------
const styles = StyleSheet.create({
   signupText: { textAlign: "center", fontSize: 14, color: "#866F7C", marginTop: 16 },
  signupLink: { color: "#D21E30", fontWeight: "bold" },

  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F7F6F8",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#38242D",
    marginTop: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#191014",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#38242D",
  },
  star: { color: "red" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EDE6EF",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#38242D",
  },
  phoneContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: "#EDE6EF",
    borderRadius: 8,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  flagBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  callingText: {
    fontSize: 15,
    color: "#38242D",
    fontWeight: "700",
    marginLeft: 4,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: "#38242D",
  },
  signinBtn: {
    borderRadius: 8,
    marginTop: 20,
  },
  signBtn: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
  },
  signText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
  },
});
