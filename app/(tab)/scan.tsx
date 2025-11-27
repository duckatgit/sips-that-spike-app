

import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaledSheet } from "react-native-size-matters";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { EvilIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import { addProductByManually } from "@/service/Api";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useFocusEffect } from "expo-router";
import { useToast } from "@/utils/useToastHook";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "Enter a valid drink name",
    }),

  brand: z
    .string()
    .nonempty("Brand is required")
    .refine((val) => /^[A-Za-z0-9\s]+$/.test(val), {
      message: "Enter a valid brand name",
    }),

  category: z.string().nonempty("Category is required"),

  sugar: z
  .string()
  .nonempty("Sugar is required")
  .refine(
    (val) => /^(\d{1,3})(\.\d{1,2})?$/.test(val),{
      message: "Enter valid sugar value (max 3 digits, optional . with 2 decimals)"
    }
    
  ),

  calories: z
    .string()
    .nonempty("Calories are required")
    .refine(
      (val) =>/^(\d{1,3})(\.\d{1,2})?$/.test(val), {
      message: "Enter valid calories value (max 3 digits, optional . with 2 decimals)",
    }),

  servingSize: z
    .string()
    .nonempty("Serving Size is required")
    .refine( (val) =>/^(\d{1,3})(\.\d{1,2})?$/.test(val), {
      message: "Enter valid servingSize value (max 3 digits, optional . with 2 decimals)",
    }),
    image: z
  .string()
  .nonempty("Image is required"),

});


export default function Scan() {

  const [activeButton, setActiveButton] = useState<string>("cane");
const[loading,setloading]=useState<boolean>(false);
  // Image picker state
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [imageOptionsVisible, setImageOptionsVisible] = useState(false);
  
const { showToast } = useToast();
  // Dropdown mock data

  
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
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


  
  const handleScanPress = (buttonName: string) => {
    console.log("buttonname",buttonName);
    setActiveButton(buttonName);
    if(buttonName === "drink") {
      router.push("/(tab)/scanner")
    }
  };
const showToastNotification = (type: string, msg: string) => {
    console.log("EEERERERERERE", type);
//  showToast(type, msg);

 showToast(type, msg)
 
  };
  // ---------------- IMAGE PICKER (gallery + camera via bottom sheet) ----------------
  const openImageOptions = () => setImageOptionsVisible(true);
  const closeImageOptions = () => setImageOptionsVisible(false);

  const pickFromGallery = async () => {
    closeImageOptions();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        showToastNotification("Permission required",  "Please allow access to your gallery.");
    
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length) {
        const uri = result.assets[0].uri;
  setPickedImage(uri);
  setValue("image", uri, { shouldValidate: true });
        // setPickedImage(result.assets[0].uri);
        
      }
    } catch (err) {
      console.log("Gallery pick error:", err);
    }
  };

  const takePhoto = async () => {
    closeImageOptions();
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
       showToastNotification("Permission required",  "Please allow camera access to your gallery.");
  
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length) {
        // setPickedImage(result.assets[0].uri);
          const uri = result.assets[0].uri;
  setPickedImage(uri);
  setValue("image", uri, { shouldValidate: true });   // <-- ADD
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
      return;    // EXIT
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
      showToastNotification("success", response.message || "Product added successfully!");

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
      showToastNotification("error", response.message || "Something went wrong.");
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
    setPickedImage(null)
  }, [])
);
console.log("loading",loading);
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
              style={[styles.scanButton, activeButton === "drink" && styles.scanButtonActive]}
              onPress={() => handleScanPress("drink")}
            >
              <AntDesign
                name="scan"
                size={14}
                color={activeButton === "drink" ? "#fff" : "#636363"}
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
              style={[styles.scanButton, activeButton === "cane" && styles.scanButtonActive]}
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
              <Text style={styles.manualsub}>Enter drink information manually</Text>
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
              {
                !pickedImage && <Text style={styles.label}>Tap to add photo</Text> 
              }
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
                   <Input value={value} onChangeText={onChange} keyboardType="string" placeholder="Select category" />
                )}
              />
              {errors.drinkName && <Text style={styles.error}>{errors.drinkName.message}</Text>}

              {/* MANUAL DRINK NAME - this writes to same field (overrides or is overridden by dropdown) */}
             

              {/* BRAND */}
              <Text style={styles.label}>Brand *</Text>
              <Controller
                control={control}
                name="brand"
                render={({ field: { value, onChange } }) => (
                  <Input value={value} onChangeText={onChange} placeholder="Enter Brand" />
                )}
              />
              {errors.brand && <Text style={styles.error}>{errors.brand.message}</Text>}

              {/* CATEGORY (dropdown inline with chevron) */}
              <Text style={styles.label}>Category *</Text>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                   <Input value={value} onChangeText={onChange} keyboardType="string" placeholder="Select category" />
                )}
              />
              {errors.category && <Text style={styles.error}>{errors.category.message}</Text>}

              {/* SUGAR */}
              <Text style={styles.label}>Sugar (g/8 oz) *</Text>
              <Controller
                control={control}
                name="sugar"
                render={({ field: { onChange, value } }) => (
                  <Input value={value} onChangeText={onChange} keyboardType="numeric" placeholder="Enter Sugar" />
                )}
              />
              {errors.sugar && <Text style={styles.error}>{errors.sugar.message}</Text>}

              {/* CALORIES */}
              <Text style={styles.label}>Calories (per 8 oz) *</Text>
              <Controller
                control={control}
                name="calories"
                render={({ field: { onChange, value } }) => (
                  <Input value={value} onChangeText={onChange} keyboardType="numeric" placeholder="Enter Calories" />
                )}
              />
              {errors.calories && <Text style={styles.error}>{errors.calories.message}</Text>}

              {/* SERVING SIZE */}
              <Text style={styles.label}>Serving Size (oz) *</Text>
              <Controller
                control={control}
                name="servingSize"
                render={({ field: { onChange, value } }) => (
                  <Input value={value} onChangeText={onChange} keyboardType="numeric" placeholder="Enter Serving Size" />
                )}
              />
              {errors.servingSize && (
                <Text style={styles.error}>{errors.servingSize.message}</Text>
              )}

              


              <TouchableOpacity
  style={[
    styles.submitBtn,
  ]}

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
          <TouchableOpacity style={styles.sheetItem} onPress={takePhoto}>
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetItem} onPress={pickFromGallery}>
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.sheetItem, styles.sheetCancel]} onPress={closeImageOptions}>
            <Text style={[styles.cancelText, { fontWeight: "600" }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
        
      </Modal>

  

    {/* </SafeAreaView> */}
    </>
  );
}

// ---------------- REUSABLE COMPONENTS ----------------

// simple Input wrapper
const Input = ({ ...props }: any) => (
  <TextInput
    {...props}
    style={styles.input}
    placeholderTextColor="#999"
  />
);








const styles = ScaledSheet.create({
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
