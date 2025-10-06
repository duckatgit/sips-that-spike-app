import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

export default function SignInScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Navigate to modal or handle sign in logic
    console.log("Sign in pressed");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            {/* <Text style={styles.desc}>
              Sign in to your Sips That Spike account
            </Text> */}
            {/* <Text style={styles.signinWith}>Sign in with</Text>
            <View style={styles.switchContainer}>
              <LinearGradient
                colors={["#D82370", "#D21D2B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.switchBackground}
              >
                <View style={styles.switchRow}>
                  <TouchableOpacity
                    style={styles.switchButton}
                    onPress={() => setMethod("email")}
                    activeOpacity={1}
                  >
                    <View style={styles.tabWrapper}>
                      {method === "email" && (
                        <View style={styles.selectedTabOverlay} />
                      )}
                      <View style={styles.tabContent}>
                        <Ionicons name="mail-outline" size={20} color="#fff" />
                        <Text style={styles.switchText}>Email</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.switchButton}
                    onPress={() => setMethod("phone")}
                    activeOpacity={1}
                  >
                    <View style={styles.tabWrapper}>
                      {method === "phone" && (
                        <View style={styles.selectedTabOverlay} />
                      )}
                      <View style={styles.tabContent}>
                        <Ionicons name="call-outline" size={20} color="#fff" />
                        <Text style={styles.switchText}>Phone</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View> */}

            {method === "email" ? (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#9C7A7D"
                  />
                  <Ionicons name="mail-outline" size={20} color="#F2AFA9" />
                </View>
                <Text style={styles.inputHint}>
                  We'll send you a verification code
                </Text>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholderTextColor="#9C7A7D"
                  />
                  <Ionicons name="call-outline" size={20} color="#F2AFA9" />
                </View>
                <Text style={styles.inputHint}>
                  We'll send you a verification code
                </Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity
                  onPress={() => console.log("Forgot password pressed")}
                >
                  <Text style={styles.forgot}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9C7A7D"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#F2AFA9"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rememberRow}>
              <TouchableOpacity
                style={[
                  styles.customToggle,
                  { backgroundColor: rememberMe ? "#D82370" : "#E0E0E0" },
                ]}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.customToggleThumb,
                    {
                      transform: [{ translateX: rememberMe ? 16 : 2 }],
                      backgroundColor: "#FFFFFF",
                    },
                  ]}
                />
              </TouchableOpacity>
              <Text style={styles.rememberText}>Remember me</Text>
            </View>

            <LinearGradient
              colors={["#D82370", "#D21D2B"]}
              style={styles.signinBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity
                style={styles.signInButton}
                onPress={handleSignIn}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </LinearGradient>

            {/* <Text style={styles.signupText}>
              Don't have account?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => console.log("Sign up pressed")}
              >
                Sign Up Now !
              </Text>
            </Text> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F7F6F8",
    fontFamily: "Poppins_400Regular",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#38242D",
    fontFamily: "Poppins_700Bold",
    marginTop: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#191014",
    fontFamily: "Poppins_700Bold",
    marginBottom: 20,
  },
  desc: {
    fontSize: 15,
    color: "#86747E",
    fontFamily: "Poppins_400Regular",
    marginBottom: 12,
  },
  signinWith: {
    fontSize: 15,
    color: "#2F1A23",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    marginTop: 16,
    marginBottom: 8,
  },
  switchContainer: {
    marginBottom: 16,
    borderRadius: 4,
    overflow: "hidden",
  },
  switchBackground: {
    borderRadius: 4,
    padding: 2,
  },
  switchRow: {
    flexDirection: "row",
    borderRadius: 4,
    overflow: "hidden",
  },
  switchButton: {
    flex: 1,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  tabWrapper: {
    position: "relative",
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  tabHighlight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 32,
    backgroundColor: "transparent",
    borderRadius: 4,
    gap: 8,
  },
  selectedTabOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff44",
    borderRadius: 4,
    zIndex: 1,
    height: 32,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 2,
  },
  switchText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    marginLeft: 6,
  },
  activeSwitchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 15,
    color: "#38242D",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
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
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#38242D",
  },
  inputHint: {
    fontSize: 12,
    color: "#BE9490",
    marginBottom: 4,
    fontFamily: "Poppins_400Regular",
  },
  passwordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  forgot: {
    color: "#D82370",
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  rememberText: {
    fontSize: 14,
    color: "#D82370",
    fontFamily: "Poppins_500Medium",
    marginLeft: 8,
  },
  signInButton: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
  },
  signInText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  signupText: {
    textAlign: "center",
    fontSize: 14,
    color: "#866F7C",
    fontFamily: "Poppins_400Regular",
    marginTop: 16,
  },
  signupLink: {
    color: "#D21E30",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  signinBtn: {
    borderRadius: 8,
    marginBottom: 18,
  },
  customToggle: {
    width: 36,
    height: 20,
    borderRadius: 2,
    justifyContent: "center",
    position: "relative",
  },
  customToggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 1,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
