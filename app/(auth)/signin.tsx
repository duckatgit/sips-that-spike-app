
import { useToast } from "@/utils/useToastHook";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Login } from "@/service/Api";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./signin.styles";
// ----------------------
// Zod Validation Schema
// ----------------------
const signInSchema = z.object({
  email: z
  
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address"),
 
  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
  //  .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?!.*\s).+$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, one special character, and no spaces"
  // )
  // .refine(
  //     (val) =>
  //       !val.startsWith(" ") &&
  //       /[A-Z]/.test(val) &&
  //       /[0-9]/.test(val) &&
  //       /[^A-Za-z0-9]/.test(val),
  //     "Password must include uppercase, number, and special character"
  //   ),
});

type SignInData = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const [loading, setLoading] = useState(false); // button loader
  const [pageLoading, setPageLoading] = useState(false); // full screen loader
  const [showPassword, setShowPassword] = useState(false);
const { showToast } = useToast();
  const router = useRouter();

  const showToastNotification = (type: string, msg: string) => {
    console.log("EEERERERERERE", type);
//  showToast(type, msg);

 showToast(type, msg)
 
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  // -------- Full Screen Loader Simulation --------
 useEffect(() => {
   setPageLoading(true);
  const timer = setTimeout(() => {
    setPageLoading(false);
  }, 800);
  return () => clearTimeout(timer);
}, []);

  // -------- API Login --------
  const onSubmit = async (data: SignInData) => {
    setLoading(true);

    try {
      const response = await Login({
        email: data.email,
        password: data.password,
        role: "user",
      });

      if (response.status) {
        await AsyncStorage.setItem("token", response.user?.token);
        await AsyncStorage.setItem("userId", response.user?.id);
        await AsyncStorage.setItem("role", response.user?.role);
        await AsyncStorage.setItem("name", response.user?.name);
        await AsyncStorage.setItem("email", response.user?.email);


        showToastNotification("success", response.message);
        router.replace("/(tab)/home");
      } else {
        console.log("response",response);
        showToastNotification("error", response.message);
      }
    } catch (err: any) {
        showToastNotification("error", err?.message || "Something went wrong!");
   setLoading(false);
      

    }
 finally{
   setLoading(false);

 }
  };

  // -------- Full Screen Loader UI --------
  if (pageLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F63E4C" />
        {/* <Text style={styles.loadingText}>Loading content...</Text> */}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>
              Welcome Back to Sips That Spike!
            </Text>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9C7A7D"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <Ionicons name="mail-outline" size={20} color="#F2AFA9" />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity onPress={() => router.push("/resetotp")}>
                  <Text style={styles.forgot}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Password"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#9C7A7D"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={!showPassword ? "eye-outline" : "eye-off-outline"}
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

            {/* Sign In Button */}
            <LinearGradient
              colors={["#D82370", "#D21D2B"]}
              style={styles.signinBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity
                style={styles.signInButton}
                disabled={loading}
                onPress={handleSubmit(onSubmit)}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.signInText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>

            {/* Redirect */}
            <Text style={styles.signupText}>
              Don’t have an account?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => router.push("/signup")}
              >
                Sign Up Now!
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============ STYLES ============
