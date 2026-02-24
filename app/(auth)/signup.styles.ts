import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  signupText: {
    textAlign: "center",
    fontSize: 14,
    color: "#866F7C",
    marginTop: 16,
  },
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
  // Add these styles to your existing styles object:

  termsContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D21E30",
    marginRight: 10,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#D21E30",
    borderColor: "#D21E30",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#38242D",
    lineHeight: 20,
  },
  termsLink: {
    color: "#D21E30",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
