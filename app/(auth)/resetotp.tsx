import { forgotPaswordOtp } from "@/service/Api";
import { useToast } from "@/utils/useToastHook";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { z } from "zod";
import { styles } from "./resetotp.styles";
const schema = z.object({
  email: z.string()
  .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});


export default function ForgotPassword() {
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });
  const showToastNotification = (type: string, msg: string) => {
    console.log("EEERERERERERE", type);
    //  showToast(type, msg);

    showToast(type, msg);
  };
  const onSubmit = async (data: any) => {
    console.log("resetotpmail", data);
    setloading(true);

    try {
      const response = await forgotPaswordOtp(data);


      console.log("response", response);
      if (response.success === true) {
        showToastNotification("success", response.message);
        console.log("its work");
        reset();
        // showToastNotification("success", "Password reset email sent!");
        router.push("/signin");
      } else {
        console.log("its not work");
        showToastNotification("error", response.message);
      }
    } catch (err: any) {
      showToastNotification("error", err?.message || "Something went wrong!");
    } finally {
      setloading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
           Enter your registered email, and we'll send you a link to reset your password.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <Controller
                control={control}
                name="email"
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
                <Text style={{ color: "red" }}>{errors.email.message}</Text>
              )}
            </View>

            <LinearGradient
              colors={["#D82370", "#D21D2B"]}
              style={styles.signinBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity
                style={styles.signInButton}
                onPress={handleSubmit(onSubmit)}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.signInText}>Submit</Text>
                )}
                {/* // <Text style={styles.signInText}>Send OTP</Text> */}
              </TouchableOpacity>
            </LinearGradient>

               <Text style={styles.signupText}>
                        Remembered your password?{" "}
                          <Text
                            style={styles.signupLink}
                            onPress={() => router.push("/signin")}
                          >
                            Sign In Now!
                          </Text>
                        </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


