import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { InternalAxiosRequestConfig } from "axios";

import Constants from "expo-constants";

const baseURL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
});


apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("token");
    console.log(" Token in frontend:", token);

    if (token && config.headers) {
      //  Backend expects: req.headers.accesstoken
      (config.headers as any).accesstoken = token;
      console.log(" accessToken Header Set:", token);
    }

    const fullUrl = apiClient.getUri(config);
    const method = config.method?.toUpperCase() || "UNKNOWN";
    console.log(` Request Method: ${method}, URL: ${fullUrl}`);

    return config;
  },
  (error) => Promise.reject(error)
);



apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    console.log(error, "errorrrrr");
    if (error?.response?.status === 403) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      console.log("Redirect to login or register screen after 403");
    }
    return Promise.reject(error);
  }
);


export const get = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return apiClient.get<T>(url, config);
};


export const GetData = async () => {
  const response = await apiClient.get(`/api/admin/getAllArticle`);
  console.log("response data", response.data);
  return response.data;
};


export const GetDataById = async (id: string) => {
  const response = await apiClient.get(`/api/admin/getArticleById?articleId=${id}`);
  
  console.log("response data by id", response.data);
  return response.data;
};



export const GETALLFAQ = async () => {
  const response = await apiClient.get(`/api/admin/getAllFaq`);
  console.log("response data", response.data);
  return response.data;
};



export const GetDetailFromBarcode = async (barcode: string) => {
  try {
    console.log("🔹 Barcode Number:", barcode);

    const response = await apiClient.get(
      `/api/admin/getDetailFromBarcode?barcode=${barcode}`
    );

    console.log("✅ Response Data (By Barcode):", response.data);
    return response.data;

  } catch (error: any) {
    if (error.response) {
      console.log(" API Error Response:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.log(" No Response from Server:", error.request);
    } else {
      console.log(" Error Message:", error.message);
    }

    // Show custom alert, suppress Expo error box
   
    return null; //  do NOT throw — return null instead
  }
};

export const GetDetailFromBarcodeById = async (productId: string) => {
  console.log("productid",productId);
  const response = await apiClient.get(`/api/admin/getProductById?productId=${productId}`);
  
  console.log("response data by id", response.data);
  return response.data;
};





//authentication auth

export const Signup=async(data:any)=>{
const response = await apiClient.post(`/api/auth/signup`,data);
console.log("response data",response);
return response.data;
}


export const ResetOtp=async(data:any)=>{
  console.log("resetotpdata",data);
const response = await apiClient.post(`/api/auth/resendOtp`,data);
console.log("response of reset otp data",response);
return response.data;
}

export const forgotPaswordOtp=async(data:any)=>{
  console.log("data",data);
const response = await apiClient.post(`/api/auth/forgotPassword`,data);
return response.data;
}




export const VerfiyOtp=async(data:any)=>{
  console.log("verifyotp",data);
const response = await apiClient.post(`/api/auth/otpVerify`,data);
console.log("response data",response);
return response.data;
}






export const Login = async (data:any) => {
  try {
    console.log("login data", data);
    const response = await apiClient.post("/api/auth/login", data);
    console.log("response data", response.data);
    return response.data;
  } catch (error:any) {
    if (error.response) {
      console.log("Error Response:", error.response.status, error.response.data);
      return error.response.data
    } else {
      console.log("Network or Axios error:", error.message);
    }
    return error;
  }
};




export const  getuserbyid=async()=>{
  const response =await  apiClient.get(`/api/auth/getUserById`);
  console.log("response data",  response?.data);
  return response;
}





export const updateUser = async (data: any) => {
  try {
    const userId = await AsyncStorage.getItem("userId");

    const formData = new FormData();

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("phone", data.phone);

    // only append image if user selected one
    if (data.image) {
      const uriParts = data.image.split(".");
      const ext = uriParts[uriParts.length - 1];

      formData.append("image", {
        uri: data.image,
        name: `profile.${ext}`,
        type: ext === "png" ? "image/png" : "image/jpeg",
      } as any);
    }

    const response = await apiClient.put(
      `/api/auth/updateUser?userId=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Response from update API:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("Error in updateUser:", error.response?.data || error.message);
    throw error;
  }
};
export const Addtomylog = async (id:any) => {
  console.log("id to that log",id);
  const response = await apiClient.get(`/api/admin/addToMyLog?productId=${id}`);
  console.log("response",response);
  return response.data;
};













export const productLogByUserId = async (day: string) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      return {
        success: false,
        message: "User ID not found in storage",
        data: null,
      };
    }

    const response = await apiClient.get(
      `/api/admin/productLogByUserId?time=${day}&userId=${userId}`
    );
    console.log("response of log", JSON.stringify(response.data, null, 2));

    return {
      success: true,
      message: "Data fetched successfully",
      data: response.data,
    };
  } catch (error: any) {
    let errorMessage = "Unknown error occurred";

    if (error.response) {
      // Request made and server responded
      errorMessage = `Server responded with status ${error.response.status}: ${error.response.data?.message || JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      // Request made but no response received
      errorMessage = "No response received from server. Please check your network connection.";
    } else {
      // Something happened while setting up the request
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};



export const getAllScansDataByUsers=async()=>{


  try{
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      return {
        success: false,
        message: "User ID not found in storage",
        data: null,
      };
    }

    const response = await apiClient.get(
      `/api/auth/getAllScansByUsers?userId=${userId}`
    );
    console.log("response of log", response.data);
    return response.data

  }

catch(err:any){
return {
      success: false,
      message: err.message,
      data: null,
    };
}
}






export const addProductByManually = async (formData: FormData) => {
  console.log("formdata enter in the api",formData);
  try {
    const response = await apiClient.post('/api/admin/addProductByManually', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("response of formdata",response.data);
    return response.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
      data: null,
    };
  }
};


 //its hit when backend recommendation api is ready
export const recommendeddrink=async()=>{

  try{
    //its hit when backend recommendation api is ready
    // const response = await apiClient.get('/api/admin/recommendeddrink');
    const response="data";
    console.log("response of recommended drink",response);
    return response;
  }catch(err:any){
    return {
      success: false,
      message: err.message,
      data: null,
    };
  }
}