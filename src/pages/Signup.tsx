// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { Singupurl } from "../API/backapi";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// interface ISignupForm {
//   username: string;
//   email: string;
//   password: string;
//   role: "user" | "admin";
// }

// export const Signup = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//     reset,
//   } = useForm<ISignupForm>({
//     mode: "onChange", 
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [alluser, setAlluser] = useState<ISignupForm[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUsers = localStorage.getItem("userInfo");
//     if (storedUsers) setAlluser(JSON.parse(storedUsers));
//   }, []);

//   const onSubmit = async (data: ISignupForm) => {
//     console.log("Signup Data:", data);
//     const res = await Singupurl(data);
//     console.log("Signup Response:", res);

//     const updatedUsers = [...alluser, data];
//     setAlluser(updatedUsers);
//     localStorage.setItem("userInfo", JSON.stringify(updatedUsers));
//     navigate("/login");
//     reset();
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
//       <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
//         Signup
//       </h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
//         <div>
//           <label className="block mb-1 font-medium text-gray-700">Username</label>
//           <input
//             type="text"
//             {...register("username", {
//               required: "Username is required",
//               minLength: { value: 3, message: "At least 3 characters & number" },
//               pattern: {
//                 value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]+$/,
//                 message: "Username must contain letters and numbers only",
//               },
//             })}
//             className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
//             placeholder="Enter username"
//           />
//           {errors.username && (
//             <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
//           )}
//         </div>

        
//         <div>
//           <label className="block mb-1 font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             {...register("email", {
//               required: "Email is required",
//             pattern: {
//   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
//   message: "Enter a valid email address",
// },
//             })}
//             className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
//             placeholder="Enter email"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//           )}
//         </div>

       
//         <div className="relative">
//           <label className="block mb-1 font-medium text-gray-700">Password</label>
//           <input
//             type={showPassword ? "text" : "password"}
//             {...register("password", {
//               required: "Password is required",
//               minLength: { value: 6, message: "Min 6 characters" },
//               pattern: {
//                 value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
//                 message:
//                   "Include uppercase letter, number, and special character",
//               },
//             })}
//             className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition pr-10"
//             placeholder="Enter password"
//           />
//           <span
//             className="absolute right-3 top-9 cursor-pointer text-gray-500"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? <FontAwesomeIcon icon={faEye} style={{color: "#0c0d0e",}} />: <FontAwesomeIcon icon={faEyeSlash} style={{color: "#0c0d0e",}} />}
//           </span>
//           {errors.password && (
//             <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//           )}
//         </div>

     
//         <div>
//           <label className="block mb-1 font-medium text-gray-700">Role</label>
//           <select
//             {...register("role", { required: "Role is required" })}
//             className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
//           >
//             <option value="">Select Role</option>
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//           {errors.role && (
//             <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={!isValid} 
//           className={`w-full py-3 rounded-lg font-semibold shadow-lg transition ${
//             isValid
//               ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           Signup
//         </button>
//       </form>
//     </div>
//   );
// };
