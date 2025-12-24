import { ScaledSheet } from "react-native-size-matters";



export const styles = ScaledSheet.create({
  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },

  loadingText: { 
    marginTop: "10@ms", 
    fontSize: "16@ms", 
    color: "#444" 
  },

  container: {
    width: "100%",
    padding: "15@ms",
    backgroundColor: "#FFF6F1",
    borderWidth: 1,
    borderColor: "#FFEBDF",
    borderRadius: "12@ms",
    alignSelf: "center",
    alignItems: "center",
    marginTop: "10@ms",
  },

  image: {
    width: "80%",
    aspectRatio: 1,      // auto responsive
    resizeMode: "contain",
  },

  imgbtm: {
    width: "100%",
    alignItems: "center",
    marginTop: "10@ms",
  },

  first: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: "17@ms",
    color: "#1B1919",
    textAlign: "center",
  },

  second: {
    fontFamily: "Poppins_400Regular",
    fontSize: "14@ms",
    color: "#615253",
    textAlign: "center",
    marginTop: "3@ms",
  },

  containersecond: {
    width: "100%",
    padding: "15@ms",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EDEDED",
    borderRadius: "12@ms",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "20@ms",
  },

  firstinside: {
    flex: 1,
    alignItems: "center",
    marginRight: "10@ms",
  },

  secondinside: {
    flex: 1,
    alignItems: "center",
    marginLeft: "10@ms",
  },

  thirdinside: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "10@ms",
  },

  insidetext: {
    width: "100%",
    padding: "10@ms",
    backgroundColor: "#FFEFEE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10@ms",
  },

  one: {
    width: "100%",
    padding: "12@ms",
    borderWidth: 2,
    borderColor: "#E6E6FF",
    backgroundColor: "#F8F8FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10@ms",
    marginBottom: "10@ms",
  },

  oneT: {
    fontSize: "16@ms",
    fontWeight: "400",
    color: "#756464",
  },

  oneTW: {
    fontSize: "14@ms",
    fontWeight: "500",
    color: "#404040",
  },

  containerthird: {
    width: "100%",
    padding: "15@ms",
    backgroundColor: "#FDFDFD",
    borderWidth: 1,
    borderColor: "#EDEDED",
    borderRadius: "12@ms",
    marginTop: "20@ms",
  },

  containerfourth: {
    width: "100%",
    justifyContent: "space-between",
  },

  containerfifth: {
    marginTop: "10@ms",
    width: "100%",
    alignItems: "center",
  },

  firsttop: {
    flexDirection: "row",
    alignItems: "center",
    gap: "10@ms",
  },

  internaltext: {
    fontFamily: "Poppins_400Regular",
    fontSize: "14@ms",
    color: "#38242D",
    lineHeight: "20@ms",
    textAlign: "left",
  },

  containerthirds: {
    width: "100%",
    alignItems: "center",
    gap: "15@ms",
    marginTop: "25@ms",
    marginBottom: "100@ms",
  },

  scanButtons: {
    width: "95%",
    paddingVertical: "15@ms",
    backgroundColor: "#F63E4C",
    borderRadius: "50@ms",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: "10@ms",
  },

  scanButton: {
    width: "95%",
    paddingVertical: "15@ms",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#F63E4C",
    borderRadius: "50@ms",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: "10@ms",
  },

  scanButtonText: {
    color: "#F63E4C",
    fontSize: "17@ms",
    fontWeight: "600",
  },

  scanButtonTexts: {
    color: "#FFFFFF",
    fontSize: "17@ms",
    fontWeight: "600",
  },
});