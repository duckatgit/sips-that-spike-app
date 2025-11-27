import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

export const useToast = () => {
  const showToast = (type: string , msg: string, duration = 3000) => {
    Toast.show({
      type: type,
      text1: msg,
      position: "top",
      visibilityTime: duration,
      autoHide: true,
      topOffset: 50,
    });
  };

  return { showToast };
};
