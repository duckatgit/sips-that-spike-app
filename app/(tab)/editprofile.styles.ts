import { Platform } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
export const styles = ScaledSheet.create({
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: "6@ms",
  },

  backText: {
    fontSize: "16@ms",
    fontFamily: "Poppins_600SemiBold",
    color: "#636363",
  },
    inputGroup: {
    marginBottom: 12,
  },

    star: { color: "red" },

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: "10@ms",
  },

  scrollContainer: {
    paddingBottom: "300@ms",
    minHeight: "80%",
    backgroundColor: "white",
  },

  backbtn: {
    width: "28@ms",
    height: "28@ms",
    borderRadius: "10@ms",
    justifyContent: "center",
    alignItems: "center", // ❗ fixed (use alignItems vs alignContent)
    borderWidth: 1,
    borderColor: "#FFEAEA",
  },

  container: {
    width: "147@ms",
    height: "147@ms",
    borderWidth: 2,
    borderColor: "#F03745",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "100@ms",
    backgroundColor: "#F8F8FF",
  },

  box: {
    width: "360@ms",
    height: "190@ms",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginLeft: "7@ms",
    marginTop: "20@ms",
    gap: "10@ms",
  },

  text: {
    marginTop: "20@ms",
    fontFamily: "Poppins_600SemiBold",
    fontSize: "21@ms",
    color: "#1B1919",
    textTransform: "capitalize",
    marginLeft: "10@ms",
  },

  texts: {
    fontFamily: "Poppins_500Medium",
    fontSize: "14@ms",
    color: "#1B1919",
    textTransform: "capitalize",
  },

  formContainer: {
    paddingHorizontal: "15@ms",
    marginTop: "15@ms",
  },

  label: {
    fontFamily: "Poppins_500Medium",
    fontSize: "13@ms",
    color: "#7E7E7E",
    marginBottom: "5@ms",
    marginTop: "10@ms",
  },

  inputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: "6@ms",
    paddingHorizontal: "10@ms",
    paddingVertical: Platform.OS === "ios" ? "10@ms" : "5@ms",
    marginBottom: "3@ms",
  },

  input: {
    flex: 1,
    fontSize: "13@ms",
    color: "#1B1919",
    fontFamily: "Poppins_500Medium",
  },

  phoneContainer: {
    height: "50@ms",
    borderWidth: 1,
    borderColor: "#EDE6EF",
    borderRadius: "8@ms",
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "12@ms",
  },

  flagBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "8@ms",
  },

  callingText: {
    fontSize: "15@ms",
    color: "#38242D",
    fontWeight: "700",
    marginLeft: "4@ms",
  },

  phoneInput: {
    flex: 1,
    fontSize: "15@ms",
    color: "#38242D",
  },

  error: {
    color: "#F03745",
    fontSize: "12@ms",
    marginTop: "2@ms",
    fontFamily: "Poppins_500Medium",
  },

  btn: {
    backgroundColor: "#F03745",
    borderRadius: "50@ms",
    paddingVertical: "15@ms",
    alignItems: "center",
    marginTop: "50@ms",
    marginBottom: "40@ms",

    // iOS Shadow
    shadowColor: "#000",        // fixed
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    // Android
    elevation: 6,
  },

  btnText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium", // fixed extra spaces
    fontSize: "22@ms",
    lineHeight: "22@ms",
  },

  // --------- BOTTOM SHEET ----------
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sheetBox: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: "20@ms",
    borderTopRightRadius: "20@ms",
    paddingVertical: "15@ms",
    paddingBottom: "25@ms",
  },

  optionBtn: {
    paddingVertical: "15@ms",
  },

  optionText: {
    fontSize: "17@ms",
    textAlign: "center",
    color: "#007AFF",
    fontFamily: "Poppins_500Medium",
  },

  cancelBtn: {
    marginTop: "10@ms",
    paddingVertical: "15@ms",
    backgroundColor: "#f2f2f2",
  },

  cancelText: {
    fontSize: "17@ms",
    textAlign: "center",
    color: "red",
    fontFamily: "Poppins_500Medium",
  },
});