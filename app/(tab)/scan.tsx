import AIConsentModal, { checkAIConsent } from "@/components/Aiconsentmodal";
import { addProductByManually } from "@/service/Api";
import { useToast } from "@/utils/useToastHook";
import { EvilIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { z } from "zod";
import { styles } from "./scan.styles";

const Theme = {
  color: {
    primaryColor: "#F63E4C",
  },
};
type FormValues = {
  drinkName: string;
  brand: string;
  category: string;
  sugar: string;
  calories: string;
  servingSize: string;
  image: string;
};

// ---------------- ZOD SCHEMA ----------------
const formSchema = z.object({
  drinkName: z
    .string()
    .nonempty("Drink Name is required")
    // .refine((val) => /^[A-Za-z\s]+$/.test(val), {
    //   message: "Enter a valid drink name",
    // })
    .min(1, "Minimum 1 characters required")
    .max(40, "Maximum 40 characters allowed")
    .refine((val) => /^\S.*$/.test(val), "Cannot start with a space")
    .refine((val) => !/ {4,}/.test(val), "Only up to 3 spaces allowed")
    .refine(
      (val) => /^[A-Za-z ]+$/.test(val),
      "Only alphabets and spaces are allowed",
    ),

  brand: z
    .string()
    .nonempty("Brand is required")
    // .refine((val) => /^[A-Za-z0-9\s]+$/.test(val), {
    //   message: "Enter a valid brand name",
    // })
    .min(1, "Minimum 1 characters required")
    .max(40, "Maximum 40 characters allowed")
    .refine((val) => /^\S.*$/.test(val), "Cannot start with a space")
    .refine((val) => !/ {4,}/.test(val), "Only up to 3 spaces allowed")
    .refine(
      (val) => /^[A-Za-z ]+$/.test(val),
      "Only alphabets and spaces are allowed",
    ),

  category: z
    .string()
    .nonempty("Category is required")
    .min(1, "Minimum 1 characters required")
    .max(40, "Maximum 40 characters allowed")
    .refine((val) => /^\S.*$/.test(val), "Cannot start with a space")
    .refine((val) => !/ {4,}/.test(val), "Only up to 3 spaces allowed")
    .refine(
      (val) => /^[A-Za-z ]+$/.test(val),
      "Only alphabets and spaces are allowed",
    ),

  sugar: z
    .string()
    .nonempty("Sugar is required")
    .refine((val) => /^(\d{1,3})(\.\d{1,2})?$/.test(val), {
      message:
        "Enter valid sugar value (max 3 digits, optional . with 2 decimals)",
    }),

  calories: z
    .string()
    .nonempty("Calories are required")
    .refine((val) => /^(\d{1,3})(\.\d{1,2})?$/.test(val), {
      message:
        "Enter valid calories value (max 3 digits, optional . with 2 decimals)",
    }),

  servingSize: z
    .string()
    .nonempty("Serving Size is required")
    .refine((val) => /^(\d{1,3})(\.\d{1,2})?$/.test(val), {
      message:
        "Enter valid servingSize value (max 3 digits, optional . with 2 decimals)",
    }),
  image: z.string().nonempty("Image is required"),
});

export default function Scan() {
  const [activeButton, setActiveButton] = useState<string>("cane");
  const [loading, setloading] = useState<boolean>(false);
  // Image picker state
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [imageOptionsVisible, setImageOptionsVisible] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const { showToast } = useToast();
  // Dropdown mock data

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      drinkName: "",
      brand: "",
      category: "",
      sugar: "",
      calories: "",
      servingSize: "",
      image: "",
    },
  });

  const handleScanPress = async (buttonName: string) => {
    setActiveButton(buttonName);
    if (buttonName === "drink") {
      const alreadyConsented = await checkAIConsent();
      if (alreadyConsented) {
        router.push("/(tab)/scanner");
      } else {
        setShowConsent(true);
      }
    }
  };

  const showToastNotification = (type: string, msg: string) => {
    showToast(type, msg);
  };
  // ---------------- IMAGE PICKER (gallery + camera via bottom sheet) ----------------
  const openImageOptions = () => setImageOptionsVisible(true);
  const closeImageOptions = () => setImageOptionsVisible(false);

  const pickFromGallery = async () => {
    console.log("its hit inside");
    closeImageOptions();
    console.log("above function call");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("status", status);
    if (!status.granted) {
      return showToastNotification(
        "Permission required",
        "Please allow access to your gallery.",
      );
    }
    console.log(" reach result");
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    console.log("result of Gallary", result);

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setPickedImage(uri);
      setValue("image", uri, { shouldValidate: true });
    }
  };

  const takePhoto = async () => {
    console.log("inside photo");
    // closeImageOptions();
    console.log("inside above function call");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log("status", status);
    if (status !== "granted") {
      showToastNotification("error", "Please allow camera access ");

      return;
    }
    try {
      console.log(" reach result in camera");
      const result = await ImagePicker?.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      console.log("result of camera", result);
      if (!result.canceled) {
        const uri = result?.assets[0]?.uri;
        setPickedImage(uri);
        setValue("image", uri, { shouldValidate: true }); // <-- ADD
      }
    } catch (err) {
      console.log("Camera error:", err);
    }
  };

  const onSubmit = async (data: any) => {
    setloading(true);

    try {
      if (!pickedImage) {
        showToastNotification("error", "Please select an image.");
        return; // EXIT
      }

      const formData = new FormData();
      formData.append("productName", data.drinkName);
      formData.append("brands", data.brand);
      formData.append("category", data.category);
      formData.append("sugars", data.sugar);
      formData.append("calories", data.calories);
      formData.append("servingSize", data.servingSize);

      const fileType = pickedImage.split(".").pop();
      formData.append("image", {
        uri: pickedImage,
        name: `product.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      let response = await addProductByManually(formData);

      if (response.status === true) {
        showToastNotification(
          "success",
          response.message || "Product added successfully!",
        );

        reset();
        setPickedImage(null);

        router.push({
          pathname: "/(tab)/scannedata",
          params: {
            data: JSON.stringify(response),
            key: Date.now().toString(),
          },
        });
      } else {
        showToastNotification(
          "error",
          response.message || "Something went wrong.",
        );
      }
    } catch (err: any) {
      console.log("Submit error:", err.message);
      showToastNotification("error", err.message);
    } finally {
      // ALWAYS TURN LOADING OFF
      setloading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setActiveButton("cane");
      reset();
      setPickedImage(null);
    }, []),
  );
  console.log("loading", loading);
  return (
    <>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraScrollHeight={80}
        extraHeight={120}
        contentContainerStyle={{
          paddingBottom: 135,
          backgroundColor: "#fff",
          flexGrow: 1,
        }}
      >
        <View style={styles.scannerButtonWrapper}>
          <Pressable
            style={[
              styles.scanButton,
              activeButton === "drink" && styles.scanButtonActive,
            ]}
            onPress={() => handleScanPress("drink")}
          >
            <AntDesign
              name="scan"
              size={14}
              color={activeButton === "drink" ? "#fff" : "#960909ff"}
            />
            <Text
              style={[
                styles.scanButtonText,
                { color: activeButton === "drink" ? "#fff" : "#636363" },
              ]}
            >
              AI Camera Scan
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.scanButton,
              activeButton === "cane" && styles.scanButtonActive,
            ]}
            onPress={() => handleScanPress("cane")}
          >
            <Feather
              name="edit-3"
              size={24}
              color={activeButton === "cane" ? "#fff" : "#636363"}
            />
            <Text
              style={[
                styles.scanButtonText,
                { color: activeButton === "cane" ? "#fff" : "#636363" },
              ]}
            >
              Manual Entry
            </Text>
          </Pressable>
        </View>

        {/* MAIN AREA */}
        <View style={styles.main}>
          <View style={styles.manual}>
            <Text style={styles.manualText}>Manual Entry</Text>
            <Text style={styles.manualsub}>
              Enter drink information manually
            </Text>
          </View>

          {/* CAMERA CIRCLE (tap to open bottom sheet options) */}
          <View style={styles.second}>
            <TouchableOpacity style={styles.third} onPress={openImageOptions}>
              {pickedImage ? (
                <Image
                  source={{ uri: pickedImage }}
                  style={{ width: "100%", height: "100%", borderRadius: 100 }}
                />
              ) : (
                <EvilIcons name="camera" size={100} color="#F03745" />
              )}
            </TouchableOpacity>
            {!pickedImage && <Text style={styles.label}>Tap to add photo</Text>}
            {errors.image && (
              <Text style={styles.error}>{errors.image.message}</Text>
            )}
          </View>

          {/* ---------------- FORM START ---------------- */}
          <View style={{ width: "100%", marginTop: 30 }}>
            {/* DRINK NAME (dropdown inline with chevron) */}
            <Text style={styles.label}>Drink Name *</Text>
            <Controller
              control={control}
              name="drinkName"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  keyboardType="string"
                  placeholder="Select category"
                />
              )}
            />
            {errors.drinkName && (
              <Text style={styles.error}>{errors.drinkName.message}</Text>
            )}

            {/* MANUAL DRINK NAME - this writes to same field (overrides or is overridden by dropdown) */}

            {/* BRAND */}
            <Text style={styles.label}>Brand *</Text>
            <Controller
              control={control}
              name="brand"
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter Brand"
                />
              )}
            />
            {errors.brand && (
              <Text style={styles.error}>{errors.brand.message}</Text>
            )}

            {/* CATEGORY (dropdown inline with chevron) */}
            <Text style={styles.label}>Category *</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  keyboardType="string"
                  placeholder="Select category"
                />
              )}
            />
            {errors.category && (
              <Text style={styles.error}>{errors.category.message}</Text>
            )}

            {/* SUGAR */}
            <Text style={styles.label}>Sugar (g/8 oz) *</Text>
            <Controller
              control={control}
              name="sugar"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  placeholder="Enter Sugar"
                />
              )}
            />
            {errors.sugar && (
              <Text style={styles.error}>{errors.sugar.message}</Text>
            )}

            {/* CALORIES */}
            <Text style={styles.label}>Calories (per 8 oz) *</Text>
            <Controller
              control={control}
              name="calories"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  placeholder="Enter Calories"
                />
              )}
            />
            {errors.calories && (
              <Text style={styles.error}>{errors.calories.message}</Text>
            )}

            {/* SERVING SIZE */}
            <Text style={styles.label}>Serving Size (oz) *</Text>
            <Controller
              control={control}
              name="servingSize"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  placeholder="Enter Serving Size"
                />
              )}
            />
            {errors.servingSize && (
              <Text style={styles.error}>{errors.servingSize.message}</Text>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, { opacity: isValid ? 1 : 0.6 }]}
              disabled={!isValid}
              onPress={handleSubmit(onSubmit)}
            >
              {loading ? (
                <ActivityIndicator size="small" color="red" />
              ) : (
                <Text style={styles.submitBtnText}>Analyze Drink</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {/* </ScrollView>
      </KeyboardAvoidingView> */}

      {/* ----------------- IMAGE OPTIONS BOTTOM SHEET ----------------- */}
      <Modal
        visible={imageOptionsVisible}
        animationType="fade"
        transparent
        // backgroundColor="#fff"
        onRequestClose={closeImageOptions}
      >
        <TouchableWithoutFeedback onPress={closeImageOptions}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.sheetItem}
            onPress={() => {
              closeImageOptions();
              setTimeout(() => {
                takePhoto();
              }, 300);
            }}
          >
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sheetItem}
            onPress={() => {
              closeImageOptions();
              setTimeout(() => {
                pickFromGallery();
              }, 300);
            }}
          >
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sheetItem, styles.sheetCancel]}
            onPress={closeImageOptions}
          >
            <Text style={[styles.cancelText, { fontWeight: "600" }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <AIConsentModal
        visible={showConsent}
        onAllow={() => {
          setShowConsent(false);
          router.push("/(tab)/scanner");
        }}
        onDecline={() => {
          setShowConsent(false);
           handleScanPress("cane")
        }}
      />
    </>
  );
}

// ---------------- REUSABLE COMPONENTS ----------------

// simple Input wrapper
const Input = ({ ...props }: any) => (
  <TextInput {...props} style={styles.input} placeholderTextColor="#999" />
);
