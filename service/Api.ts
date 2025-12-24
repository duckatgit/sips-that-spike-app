
import { redirectToLogin } from "@/utils/routerHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Constants from "expo-constants";


const baseURL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
// const baseURL = "https://calista-vicinal-tamie.ngrok-free.dev";
let isLoggingOut = false;
const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
});

/* -------------------------------------------
   REQUEST INTERCEPTOR
-------------------------------------------- */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("token");

    if (token && config.headers) {
      (config.headers as any).accesstoken = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------------------------------
   RESPONSE INTERCEPTOR
-------------------------------------------- */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    const status = error?.response?.status;

    if ((status === 401 || status === 403) && !isLoggingOut) {
      isLoggingOut = true;

      await AsyncStorage.multiRemove(["token",
        "userId",
        "role",
        "name",
        "email",]);

      redirectToLogin();

      setTimeout(() => {
        isLoggingOut = false;
      }, 1000);
    }

    console.log("errors check", error);
    return Promise.reject(error);
  }
);

/* -------------------------------------------
   COMMON GET
-------------------------------------------- */
export const get = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return apiClient.get<T>(url, config);
};

/* -------------------------------------------
   ADMIN APIs
-------------------------------------------- */

export const GetData = async () => {
  try {
    const response = await apiClient.get(`/api/admin/getAllArticle`);
    return response.data;
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const GetDataById = async (id: string) => {
  try {
    const response = await apiClient.get(
      `/api/admin/getArticleById?articleId=${id}`
    );
    return response.data;
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const GETALLFAQ = async () => {
  try {
    const response = await apiClient.get(`/api/admin/getAllFaq`);
    return response.data;
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const GetDetailFromBarcode = async (barcode: string) => {
  try {
    const response = await apiClient.get(
      `/api/admin/getDetailFromBarcode?barcode=${barcode}`
    );
    return response.data;
  } catch (err: any) {
    return null;
  }
};

export const GetDetailFromBarcodeById = async (productId: string) => {
  try {
    const response = await apiClient.get(
      `/api/admin/getProductById?productId=${productId}`
    );
    return response.data;
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const Addtomylog = async (id: any) => {
  try {
    const response = await apiClient.get(
      `/api/admin/addToMyLog?productId=${id}`
    );
    return response.data;
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const productLogByUserId = async (day: string) => {
  try {
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      return { success: false, message: "User ID not found", data: null };
    }

    const response = await apiClient.get(
      `/api/admin/productLogByUserId?time=${day}&userId=${userId}`
    );

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, message: err.message, data: null };
  }
};

export const getAllScansDataByUsers = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      return { success: false, message: "User ID not found", data: null };
    }

    const response = await apiClient.get(
      `/api/auth/getAllScansByUsers?userId=${userId}`
    );

    return response.data;
  } catch (err: any) {
    return { success: false, message: err.message, data: null };
  }
};

export const addProductByManually = async (formData: FormData) => {
  try {
    const response = await apiClient.post(
      "/api/admin/addProductByManually",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (err: any) {
    return { success: false, message: err.message, data: null };
  }
};

/* -------------------------------------------
   AUTH APIs
-------------------------------------------- */

export const Signup = async (data: any) => {
  try {
    const response = await apiClient.post(`/api/auth/signup`, data);
    console.log("response", response);
    return response.data;
  } catch (err: any) {
    console.log("err", err);
    if (err.response) return err.response.data;
    return { success: false, message: err.message };
  }
};

export const ResetOtp = async (data: any) => {
  try {
    const response = await apiClient.post(`/api/auth/resendOtp`, data);
    return response.data;
  } catch (err: any) {
    if (err.response) return err.response.data;
    return { success: false, message: err.message };
  }
};

export const forgotPaswordOtp = async (data: any) => {
  try {
    const response = await apiClient.post(`/api/auth/forgotPassword`, data);
    return response.data;
  } catch (err: any) {
    if (err.response) return err.response.data;
    return { success: false, message: err.message };
  }
};

export const VerfiyOtp = async (data: any) => {
  try {
    const response = await apiClient.post(`/api/auth/otpVerify`, data);
    return response.data;
  } catch (err: any) {
    if (err.response) return err.response.data;
    return { success: false, message: err.message };
  }
};

export const Login = async (data: any) => {
  try {
    const response = await apiClient.post("/api/auth/login", data);
    return response.data;
  } catch (err: any) {
    if (err.response) return err.response.data;
    return { success: false, message: err.message };
  }
};

export const getuserbyid = async () => {
  try {
    const response = await apiClient.get(`/api/auth/getUserById`);

    console.log("resonse of update user",response);
    return response;
  } catch (err: any) {
    if (err.response) return err.response.data;
    return { success: false, message: err.message };
  }
};

export const updateUser = async (data: any) => {

  try {
    const userId = await AsyncStorage.getItem("userId");
    
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("phone", data.phone);

    if (data.image) {
      const ext = data.image.split(".").pop();
      formData.append("image", {
        uri: data.image,
        name: `profile.${ext}`,
        type: ext === "png" ? "image/png" : "image/jpeg",
      } as any);
    }

    const response = await apiClient.put(
      `/api/auth/updateUser?userId=${userId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (err: any) {
    if (err.response) return err.response.data;
    return { success: false, message: err.message };
  }
};

/* -------------------------------------------
   RECOMMENDED DRINK (TEMP)
-------------------------------------------- */
export const recommendeddrink = async () => {
  try {
    const response = "data"; // Your backend not ready
    return response;
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};
