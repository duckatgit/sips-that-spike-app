import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
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