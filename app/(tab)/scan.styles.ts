import Theme from "@/data/constant";
import { ScaledSheet } from "react-native-size-matters";

export const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: "10@ms",
  },

  /* ---------------- SCAN BUTTON WRAPPER ---------------- */
  scannerButtonWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginHorizontal: "10@ms",
    marginTop: "20@ms",
    backgroundColor: "#FFF6F1",
    borderWidth: 2,
    borderColor: "#FFEBDF",
    borderRadius: "50@ms",
    padding: "4@ms",
    transform: [{ translateY: -4 }],

    /* iOS Shadow */
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    /* Android Shadow */
    elevation: 8,
  },

  scanButton: {
    width: "160@ms",
    height: "40@ms",
    borderRadius: "50@ms",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#FFF6F1",
  },

  scanButtonActive: {
    backgroundColor: Theme.color.primaryColor,
  },

  scanButtonText: {
    fontSize: "10@ms",
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },

  /* ---------------- MAIN BODY ---------------- */
  main: {
    flex: 1,
    alignItems: "center",
    padding: "10@ms",
  },

  manual: {
    width: "100%",
    height: "60@ms",
  },

  manualText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: "20@ms",
    color: "#1B1919",
  },

  manualsub: {
    fontFamily: "Poppins_400Regular",
    fontSize: "14@ms",
    color: "#615253",
  },

  /* ---------------- IMAGE / SCAN BOX ---------------- */
  second: {
    marginTop: "30@ms",
    width: "147@ms",
    height: "147@ms",
    justifyContent: "center",
    alignItems: "center",
  },

  third: {
    width: "147@ms",
    height: "147@ms",
    borderWidth: 2,
    borderColor: "#E6E6FF",
    borderRadius: "100@ms",
    backgroundColor: "#F8F8FF",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------------- INPUT FIELDS ---------------- */
  label: {
    marginTop: "10@ms",
    marginBottom: "5@ms",
    fontSize: "14@ms",
    fontFamily: "Poppins_600SemiBold",
    color: "#000",
  },

  input: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: "10@ms",
    paddingVertical: "12@ms",
    paddingHorizontal: "12@ms",
    marginBottom: "5@ms",
    backgroundColor: "#fff",
    fontSize: "14@ms",
  },

  /* ---------------- DROPDOWN ---------------- */
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: "10@ms",
    elevation: 4,
    marginBottom: "10@ms",
    marginTop: "-5@ms",
    overflow: "hidden",
  },

  dropdownItem: {
    padding: "12@ms",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  error: {
    color: "#F03745",
    fontSize: "12@ms",
    marginTop: "2@ms",
    fontFamily: "Poppins_500Medium",
  },

  /* ---------------- SUBMIT BUTTON ---------------- */
  submitBtn: {
  width: "100%",
  paddingVertical: "14@ms",
  borderRadius: "50@ms",
  backgroundColor: "#fff",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "25@ms",
  borderColor:"#F63E4C",
borderWidth:1,
  // iOS shadow
  // shadowColor: "#000",
  // shadowOffset: { width: 0, height: 4 },
  // shadowOpacity: 0.15,
  // shadowRadius: 8,

  // Android
  // elevation: 5,
},

submitBtnText: {
  color: "#F63E4C",
  fontSize: "18@ms",
  fontFamily: "Poppins_600SemiBold",
},


  /* ---------------- BOTTOM SHEET ---------------- */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  bottomSheet: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: "15@ms",
    borderTopLeftRadius: "20@ms",
    borderTopRightRadius: "20@ms",
    paddingBottom: "25@ms",
    position: "absolute",
    bottom: 0,
  },

  sheetItem: {
    paddingVertical: "14@ms",
    alignItems: "center",
  },

  sheetText: {
    fontSize: "16@ms",
    fontFamily: "Poppins_500Medium",
  },

  sheetCancel: {
    marginTop: "6@ms",
    backgroundColor: "#f2f2f2",
    width: "100%",
    paddingVertical: "14@ms",
  },

  optionText: {
    fontSize: "17@ms",
    textAlign: "center",
    color: "#007AFF",
    fontFamily: "Poppins_500Medium",
  },

  cancelText: {
    fontSize: "17@ms",
    textAlign: "center",
    color: "red",
    fontFamily: "Poppins_500Medium",
  },
});