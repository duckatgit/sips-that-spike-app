
import { CameraView, Camera } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {
  AppState,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Overlay from "./overlay";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GetDetailFromBarcode } from "@/service/Api";
import { useIsFocused } from "@react-navigation/native";
import { useToast } from "@/utils/useToastHook";
import { Ionicons } from "@expo/vector-icons";   //  ADDED

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [scandata, setScandata] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [torchOn, setTorchOn] = useState(false);     

  const router = useRouter();
  const isFocused = useIsFocused();
  const { showToast } = useToast();

  const toggleFlash = () => {    
    setTorchOn((prev) => !prev);
  };

  // ------------------------------
  // CAMERA PERMISSION
  // ------------------------------
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // ------------------------------
  // RESET QR LOCK WHEN APP RETURNS
  // ------------------------------
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  // Toast wrapper
  const showToastNotification = (type: string, msg: string) => {
    showToast(type, msg);
  };

  // ------------------------------
  // HANDLE SCAN
  // ------------------------------
  useEffect(() => {
    if (!scandata) return;

    const currentData = scandata;
    qrLock.current = true;

    const handleScan = async () => {
      try {
        console.log(" Scanned Barcode:", currentData);

        const response = await GetDetailFromBarcode(currentData);
        console.log("API Response:", response);

        if (response && response.status === true) {
          router.push({
            pathname: "/(tab)/scannedata",
            params: {
              data: JSON.stringify(response),
              key: Date.now().toString(),
            },
          });
        } else {
          showToastNotification("error", "No product found for this barcode");
        }
      } catch (error: any) {
        console.log("Scan Error:", error);
        showToastNotification(
          "error",
          error.message ? error.message : "No product found"
        );
      } finally {
        setTimeout(() => {
          qrLock.current = false;
          setScandata(null);
        }, 1000);
      }
    };

    handleScan();
  }, [scandata]);

  const handleBarcode = ({ data }: { data: string }) => {
    if (!data) return;
    if (qrLock.current) return;

    console.log(" Detected Barcode:", data);
    qrLock.current = true;
    setScandata(data);
  };

  // ------------------------------
  // PERMISSION STATES
  // ------------------------------
  if (hasPermission === null) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          Camera access is required to scan barcodes.
        </Text>
      </SafeAreaView>
    );
  }

  // ------------------------------
  // MAIN RETURN
  // ------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black", opacity: 0.9 }}>
      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        <Stack.Screen options={{ title: "Search", headerShown: false }} />
        {Platform.OS === "android" ? <StatusBar hidden /> : null}

        {/* Only show camera when focused + permission granted */}
        {isFocused && hasPermission && (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            enableTorch={torchOn}                //  FLASHLIGHT WORKING HERE
            onBarcodeScanned={qrLock.current ? undefined : handleBarcode}
            onCameraReady={() => setCameraReady(true)}
          />
        )}

        {cameraReady && <Overlay />}

        {/*  FLASH BUTTON ADDED */}
        <TouchableOpacity
          onPress={toggleFlash}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: 15,
            borderRadius: 50,
          }}
        >
          <Ionicons
            name={torchOn ? "flashlight" : "flashlight-outline"}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
