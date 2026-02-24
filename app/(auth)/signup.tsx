import { Signup } from "@/service/Api";
import { useToast } from "@/utils/useToastHook";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker, { Country } from "react-native-country-picker-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { styles } from "./signup.styles";
// ----------------------
// ZOD VALIDATION
// ----------------------
export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(40, "Name must be less than 40 characters")
    .refine((val) => /^\S.*$/.test(val), "Cannot start with a space")
    .refine(
      (val) => /^[A-Za-z ]+$/.test(val),
      "Only alphabets and spaces are allowed",
    ),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(40, "Last name must be less than 40 characters")
    .refine((val) => /^\S.*$/.test(val), "Cannot start with a space")
    .refine(
      (val) => /^[A-Za-z ]+$/.test(val),
      "Only alphabets and spaces are allowed",
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .refine((val) => !val.startsWith(" "), "Cannot start with a space"),
  phone: z
    .union([z.string(), z.undefined()])
    .transform((val) => (val === "" ? undefined : val))
    .refine((val) => !val || val.length >= 8, "Not less than 8 digits")
    .refine((val) => !val || val.length <= 15, "Not more than 15 digits")
    .refine(
      (val) => !val || /^[0-9]{8,15}$/.test(val),
      "Enter a valid phone number",
    ),
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
      "Password must include uppercase, number, and special character",
    ),
  callingCode: z.string().optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms and Privacy Policy",
  }),
});

type SignUpData = z.infer<typeof signUpSchema>;

// ----------------------
// Phone Input Component
// ----------------------
function PhoneInput({ value, onChange, onCallingCodeChange }: any) {
  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [localPhone, setLocalPhone] = useState(value || "");
  const [showPicker, setShowPicker] = useState(false);
  const [didType, setDidType] = useState(false);
  const onSelect = (country: Country) => {
    const code = country.callingCode[0] || "";
    console.log("code", code);
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0] || "");
    onCallingCodeChange(code);
    setShowPicker(false);
  };

  useEffect(() => {
    if (!didType) return;

    const digitsOnly = localPhone.replace(/\D/g, "");

    onChange(digitsOnly);
  }, [localPhone]);

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
          setDidType(true); // 🔥 now start validation only after typing
          setLocalPhone(t.replace(/\D/g, ""));
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",

      phone: undefined,
      password: "",
      callingCode: "91",
      agreedToTerms: false,
    },
  });
  const showToastNotification = (type: string, msg: string) => {
    console.log("EEERERERERERE", type);
    //  showToast(type, msg);

    showToast(type, msg);
  };

  const onSubmit = async (data: SignUpData) => {
    console.log("data", data);
    const { callingCode, phone, ...rest } = data;
    setLoading(true);
    const payload: any = { ...rest };
    if (phone && phone.trim().length > 0) {
      payload.phone = `+${callingCode}-${phone}`;
    }
    console.log("payload", payload);
    try {
      const result = await Signup(payload);
      console.log("result", result);
      setLoading(false);
      (reset(),
        showToastNotification(
          "success",
          result.message ? result.message : "Account Created Successfully!",
        ));
      setTimeout(() => {
        router.replace({
          pathname: "/otpVerifyScreen",
          params: { email: data.email },
        });
      }, 500);
    } catch (err: any) {
      console.log("err satyam", err);
      setLoading(false);
      showToastNotification("error", err?.message || "signup failed");
    }
  };
  const agreedToTerms = watch("agreedToTerms");
  const handleOpenTerms = () => {
    router.push("/terms-conditions");
  };

  const handleOpenPrivacy = () => {
    router.push("/privacy-policy");
  };

  const trimStart = (t: string) => t.trimStart();
  console.log("errors", errors);

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
            <Text style={styles.label}>
              Last Name <Text style={styles.star}>*</Text>
            </Text>
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
              Phone Number{" "}
              <Text
                style={{ fontSize: 13, color: "#9C7A7D", fontWeight: "400" }}
              >
                (Optional)
              </Text>
            </Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { value, onChange } }) => (
                <PhoneInput
                  value={value}
                  onChange={onChange}
                  onCallingCodeChange={(code: string) =>
                    setValue("callingCode", code)
                  }
                />
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

          <View style={styles.termsContainer}>
            <Controller
              control={control}
              name="agreedToTerms"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => onChange(!value)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[styles.checkbox, value && styles.checkboxChecked]}
                  >
                    {value && (
                      <Ionicons name="checkmark" size={16} color="#FFF" />
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the{" "}
                    <Text
                      style={styles.termsLink}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleOpenTerms();
                      }}
                    >
                      Terms & Conditions
                    </Text>{" "}
                    and{" "}
                    <Text
                      style={styles.termsLink}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleOpenPrivacy();
                      }}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.agreedToTerms && (
              <Text style={styles.error}>{errors.agreedToTerms.message}</Text>
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
