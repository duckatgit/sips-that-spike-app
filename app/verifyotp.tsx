import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerfiyOtp } from "@/service/Api";
import { useToast } from "@/utils/useToastHook";
import {
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

// ✅ Zod Schema for validation
const schema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z
    .string()
    .min(4, "OTP must be 4 digits")
    .max(4, "OTP must be 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only numbers"),
});

export default function VerifyOtp() {
  const router = useRouter();
const { showToast } = useToast();

const showToastNotification = (type: string, msg: string) => {
    console.log("EEERERERERERE", type);
//  showToast(type, msg);

 showToast(type, msg)
 
  };
  // ✅ Enable validation while typing
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange", // <-- ✅ Real-time validation
    defaultValues: { email: "", otp: "" },
  });

  const onSubmit = async(data: any) => {
    const response=await VerfiyOtp(data);
    console.log("result",response);

    if(response.status==true){
        reset(),
       showToastNotification("success", "OTP Verified Successfully!");

setTimeout(() => {
  router.push("/signin");
}, 1200);

    }else{

      showToastNotification("error", "OTP Verification Failed!");

setTimeout(() => {
  router.push("/verifyotp");
}, 1200);

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
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 4-digit code sent to your email.
            </Text>

            {/* Email Field */}
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
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* OTP Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>OTP</Text>
              <Controller
                control={control}
                name="otp"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 4-digit OTP"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      maxLength={4}
                      placeholderTextColor="#9C7A7D"
                    />
                    <Ionicons name="keypad-outline" size={20} color="#F2AFA9" />
                  </View>
                )}
              />
              {errors.otp && (
                <Text style={styles.errorText}>{errors.otp.message}</Text>
              )}
            </View>

            {/* Submit Button */}
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
                <Text style={styles.signInText}>Verify</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ✅ Reuse same SignIn-style UI
const styles = StyleSheet.create({
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
    fontWeight: "500",
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
    marginBottom: 4,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#38242D" },
  signinBtn: { borderRadius: 8, marginTop: 18 },
  signInButton: { paddingVertical: 14, alignItems: "center", borderRadius: 8 },
  signInText: { fontSize: 17, color: "#FFFFFF", fontWeight: "bold" },
  errorText: { color: "red", marginTop: 2, marginBottom: 4 },
});
