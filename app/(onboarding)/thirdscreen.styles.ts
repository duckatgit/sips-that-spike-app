import { Dimensions } from "react-native";
import { ScaledSheet } from "react-native-size-matters";



const { width, height } = Dimensions.get("window");
const W = (n:any) => (width / 375) * n;
const H = (n:any) => (height / 812) * n;
export const styles = ScaledSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF6F1",
  },

  container: {
    flex: 1,
  },

  /* TOP SECTION */
  topSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: H(10),
    paddingBottom: 0,
  },

  photo: {
     width: "90%",
    height: "100%",
    marginRight: "-25%",
  },

  /* FOOTER SECTION */
  footerWrapper: {
     height: H(340),
    width: "100%",
  },

  footerBg: {
  flex: 1,
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: H(40),
    alignItems: "center",
    zIndex:20,
    marginTop:H(-60)
  },

  textWrapper: {
       marginTop: H(40),
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
   fontFamily: "Poppins_600SemiBold",
    fontSize: W(36),
    lineHeight: H(45),
    textAlign: "center",
    fontWeight: "600",
    marginTop: H(50),
  },

  description: {
    marginTop: H(18),
    fontFamily: "Poppins_500Medium",
    color: "#615253",
    fontSize: W(16),
    lineHeight: H(24),
    textAlign: "center"
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  btn: {
    backgroundColor: "#F03745",
    borderRadius: W(30),
    height: H(50),
    width: W(300),
    justifyContent: "center",
    alignItems: "center",
    marginTop: H(20),
  },

  btnText: {
     fontFamily: "Poppins_600SemiBold",
    fontSize: W(16),
    color: "#fff",
  },

  skipBtn: {
   position: "absolute",
    top: H(0),
    right: W(20),
    zIndex: 20,
  },

  skipText: {
    fontSize: W(14),
    fontWeight: "600",
    color: "#F03745",
  },
});