import { ResetOtp, VerfiyOtp } from "@/service/Api";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { z } from "zod";

import { useToast } from "@/utils/useToastHook";
import { styles } from './otpVerifyScreen.styles';
// ----------------------
// Zod Schema
// ----------------------
const otpSchema = z.object({
  otp: z
    .string()
    .min(4, "OTP must be 4 digits")
    .max(4, "OTP must be 4 digits")
    .regex(/^\d{4}$/, "OTP must be numeric"),
});

type FormData = z.infer<typeof otpSchema>;

export default function OtpVerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
const { showToast } = useToast();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });
const showToastNotification = (type: string, msg: string) => {
    console.log("EEERERERERERE", type);
//  showToast(type, msg);

 showToast(type, msg)
 
  };

  // ----------------------
  // Timer for Resend OTP
  // ----------------------
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0 && !resending) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer, resending]);

  // ----------------------
  // Handle Verify OTP
  // ----------------------
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await VerfiyOtp({ email, otp: data.otp });
      if (response.status === true) {
        

        showToastNotification("success", "OTP verified successfully!");
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      } else {
       
        showToastNotification("error", response.message || "Invalid OTP");
      }
    } catch (error: any) {
     
      showToastNotification("error", error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // Handle Resend OTP
  // ----------------------
  const handleResendOtp = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      const response = await ResetOtp({ email });
      if (response.status === true) {
        showToastNotification("success", "OTP resent successfully!");
        
        setTimer(30); // reset timer
      } else {
showToastNotification("error", response.message||"Could not resend OTP");
       
      }
    } catch (error: any) {
showToastNotification("error", error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F7F6F8" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the 4-digit OTP sent to:</Text>
        <Text style={styles.email}>{email}</Text>

        {/* OTP Input */}
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWrapper}>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                maxLength={4}
                style={[styles.input, errors.otp && styles.inputError]}
              />
              <Ionicons name="key-outline" size={20} color="#D82370" />
            </View>
          )}
        />
        {errors.otp && <Text style={styles.error}>{errors.otp.message}</Text>}

        {/* Verify Button */}
        <LinearGradient
          colors={["#D82370", "#D21D2B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.buttonInner}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>

        {/* Resend OTP */}
        <TouchableOpacity
          style={[styles.resendButton, (resending || timer > 0) && { opacity: 0.6 }]}
          onPress={handleResendOtp}
          disabled={resending || timer > 0}
        >
          {resending ? (
            <ActivityIndicator color="#D82370" />
          ) : (
            <Text style={styles.resendText}>
              Resend OTP {timer > 0 ? `in ${timer}s` : ""}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

