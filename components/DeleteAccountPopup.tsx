import Theme from "@/data/constant";
import React from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";

export default function DeleteAccount({ visible,isLoading, onCancel, onConfirm }: { visible: any,isLoading:boolean, onCancel: any, onConfirm: any }) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>Confirm Delete Account?</Text>
                    <Text style={styles.msg}>
                        Are you sure you want to delete your account?
                        
                    </Text>
                    <Text style={styles.msg}>
                        This action will deactivate your profile and you will lose access to your data.
                    </Text>

                    <View style={styles.btnRow}>
                        <TouchableOpacity disabled={isLoading} style={styles.cancelBtn} onPress={onCancel}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity disabled={isLoading} style={styles.signoutBtn} onPress={onConfirm}>
                            <Text style={styles.signoutText}>{isLoading ? 'Deleting...' : 'Delete'}</Text>
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
