// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import { resetWotp } from "../API/backapi";

// interface ResetFormInputs {
//   password: string;
//   confirmPassword: string;
// }

// export const ResetWotp = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location.state?.email || "";

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [backendError, setBackendError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<ResetFormInputs>({ mode: "onChange", });

//   const onSubmit = async (data: ResetFormInputs) => {
//     setBackendError("");
//     setLoading(true);

//     const payload = {
//       email: email,
//       password: data.password,
//     };

//     try {
//       const response = await resetWotp(payload);
//       console.log("response", response);

//       if (response.data.success) {
//         navigate("/login");
//       } else {
//         setBackendError(response.data.message || "Failed to reset password");
//       }
//     } catch (err: any) {
//       setBackendError(
//         err.response?.data?.message || "Something went wrong. Try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-2xl rounded-2xl max-w-md w-full p-8">
//         <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
//           🔑 Reset Password
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//           {/* New Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="New Password"
//               {...register("password", {
//                 required: "Password is required",
//                 minLength: { value: 6, message: "At least 6 characters" },
//                 pattern: {
//                   value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
//                   message:
//                     "Include uppercase letter, number, and special character",
//                 },
//               })}
//               className="w-full focus:outline-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg pr-10"
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3 text-gray-500 cursor-pointer"
//             >
//               <FontAwesomeIcon
//                 icon={showPassword ? faEye : faEyeSlash}
//                 size="lg"
//               />
//             </span>
//             {errors.password && (
//               <p className="text-red-600 text-sm mt-1 text-center">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="Confirm Password"
//               {...register("confirmPassword", {
//                 required: "Confirm Password is required",
//                 validate: (value) =>
//                   value === watch("password") || "Passwords do not match",
//               })}
//               className="w-full px-4 py-3 border border-gray-300 focus:outline-none rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg pr-10"
//             />
//             <span
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-3 text-gray-500 cursor-pointer"
//             >
//               <FontAwesomeIcon style={{border:"none"}}
//                 icon={showConfirmPassword ? faEye : faEyeSlash}
//                 size="lg"
//               />
//             </span>
//             {errors.confirmPassword && (
//               <p className="text-red-600 text-sm mt-1 text-center">
//                 {errors.confirmPassword.message}
//               </p>
//             )}
//           </div>

//           {backendError && (
//             <p className="text-red-600 text-sm text-center">{backendError}</p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
//               loading
//                 ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//                 : "bg-indigo-600 hover:bg-indigo-700 text-white"
//             }`}
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
