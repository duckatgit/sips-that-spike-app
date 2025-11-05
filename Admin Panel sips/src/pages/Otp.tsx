// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { forgetotp, verifyotp } from "../API/backapi";

// interface OtpFormInputs {
//   otp: string;
// }

// export const Otp = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location.state?.email || "";
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<OtpFormInputs>();


//   const onSubmit=async(data:any)=> {
//     console.log("data",data);
//     setLoading(true);
//     setError("");

// let data1={
//   email:email,
//   otp:data.otp,
// }
// console.log("data1",data1);
//     try {
   
//       const response = await verifyotp(data1);
//         console.log("response of otp math or not",response);
 
//       if (response.data.success) {
//         navigate("/resetotp", { state: { email } });
//       } else {
//         setError(response.data.message || "Invalid OTP");
//       }
//     } catch (err: any) {
//       setError(
//         err.response?.data?.message || "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <div className="bg-white shadow-2xl rounded-2xl max-w-md w-full p-8">
//         <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
//           🔒 Verify OTP
//         </h2>
//         <p className="text-center text-gray-500 mb-6">
//           Enter the OTP sent to{" "}
//           <span className="font-medium text-indigo-600">{email}</span>
//         </p>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             {...register("otp", {
//               required: "OTP is required",
//               pattern: {
//                 value: /^\d{4,6}$/, 
//                 message: "OTP must be 4 to 6 digits",
//               },
//             })}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
//           />
//           {errors.otp && (
//             <p className="text-red-600 text-sm font-medium text-center">
//               {errors.otp.message}
//             </p>
//           )}

//           {error && (
//             <p className="text-red-600 text-sm font-medium text-center">
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>

//         <p className="text-center text-gray-400 text-sm mt-6">
//           Didn't receive the OTP?{" "}
//           <span
//             className="text-indigo-600 cursor-pointer hover:underline"
//             onClick={async () => {
//               try {
//                 setLoading(true);
//                await forgetotp({email:email});
//                 alert("OTP resent successfully!");
//               } catch {
//                 alert("Failed to resend OTP. Try again.");
//               } finally {
//                 setLoading(false);
//               }
//             }}
//           >
//             Resend
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };
