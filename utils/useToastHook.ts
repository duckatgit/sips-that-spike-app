
import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

export const useToast = () => {
  const showToast = (type: ToastType|string, msg: string, duration = 3000) => {
    Toast.show({
      type, // must be one of "success" | "error" | "info"
      text1: msg,
      position: "top",
      visibilityTime: duration,
      autoHide: true,
      topOffset: 50,
    });
  };

  return { showToast };
};
