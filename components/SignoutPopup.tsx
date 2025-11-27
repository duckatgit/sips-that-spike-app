import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import Theme from "@/data/constant";

export default function SignoutPopup({ visible, onCancel, onConfirm }:{visible:any, onCancel:any, onConfirm:any}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Confirm Sign Out</Text>
          <Text style={styles.msg}>
            Are you sure you want to sign out?
          </Text>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signoutBtn} onPress={onConfirm}>
              <Text style={styles.signoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = ScaledSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "320@ms",
    padding: "20@ms",
    backgroundColor: "#fff",
    borderRadius: "18@ms",
    alignItems: "center",
  },
  title: {
    fontSize: "20@ms",
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    color: "#000",
  },
  msg: {
    marginTop: "10@ms",
    fontSize: "14@ms",
    textAlign: "center",
    color: "#565656",
    fontFamily: "Poppins_400Regular",
  },
  btnRow: {
    flexDirection: "row",
    marginTop: "25@ms",
    width: "100%",
    justifyContent: "space-between",
  },
  cancelBtn: {
    width: "45%",
    paddingVertical: "12@ms",
    backgroundColor: "#E5E5E5",
    borderRadius: "30@ms",
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontFamily: "Poppins_500Medium",
    fontSize: "14@ms",
  },
  signoutBtn: {
    width: "45%",
    paddingVertical: "12@ms",
    backgroundColor: Theme.color.secondaryColor,
    borderRadius: "30@ms",
    alignItems: "center",
  },
  signoutText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: "14@ms",
  },
});
