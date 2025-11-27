
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useToast} from '../utils/useToastHook';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Login } from "@/service/Api";
import Toast from "react-native-toast-message";

// ----------------------
// Zod Validation Schema
// ----------------------
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type SignInData = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const [loading, setLoading] = useState(false); // button loader
  const [pageLoading, setPageLoading] = useState(true); // full screen loader
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
    setTimeout(() => {
      setPageLoading(false);
      reset();
    }, 1200); // show splash-like loader for ~1s
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
        router.push("/(tab)/home");
      } else {
        showToastNotification("error", response.message);
      }
    } catch (err: any) {
        showToastNotification("error", err?.message || "Something went wrong!");

    }

    setLoading(false);
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
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F7F6F8" },

  // Loader
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#75748E",
  },

  title: { fontSize: 32, fontWeight: "bold", color: "#38242D", marginTop: 32 },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#191014",
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 12 },
  inputLabel: {
    fontSize: 15,
    color: "#38242D",
    fontWeight: "bold",
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EDE6EF",
    paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#38242D" },
  passwordLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  forgot: { color: "#D82370", fontSize: 12 },

  signinBtn: { borderRadius: 8, marginTop: 16 },
  signInButton: { paddingVertical: 14, alignItems: "center", borderRadius: 8 },
  signInText: { fontSize: 17, color: "#FFFFFF", fontWeight: "bold" },

  signupText: {
    textAlign: "center",
    fontSize: 14,
    color: "#866F7C",
    marginTop: 16,
  },
  signupLink: { color: "#D21E30", fontWeight: "bold" },

  error: { color: "red", marginTop: 4, fontSize: 13 },
});
