
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  title: { fontSize: 32, fontWeight: "bold", color: "#38242D", marginBottom: 8 },
  subtitle: { fontSize: 18, color: "#191014", marginBottom: 12 },
  email: { fontSize: 16, fontWeight: "600", marginBottom: 24, color: "#38242D" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EDE6EF",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: "#38242D", textAlign: "center", letterSpacing: 4 },
  inputError: { borderColor: "red" },
  error: { color: "red", fontSize: 13, marginBottom: 4, textAlign: "center" },
  gradientButton: { borderRadius: 8, marginTop: 20 },
  buttonInner: { paddingVertical: 14, alignItems: "center", borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  resendButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D82370",
    alignItems: "center",
    marginBottom:80
  },
  resendText: { color: "#D82370", fontSize: 16, fontWeight: "600" },
});