import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
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