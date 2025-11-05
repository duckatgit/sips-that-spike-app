// import React from "react";
// import { useForm } from "react-hook-form";
// import { useParams, useNavigate } from "react-router-dom";
// import { reseturl } from "../API/backapi";
// import axios from "axios";

// interface IResetForm {
//   password: string;
//   confirmPassword: string;
// }

// export const Reset = () => {
//   const { token } = useParams<{ token: string }>();
//   const navigate = useNavigate();
//   const { register, handleSubmit, watch, formState: { errors } } = useForm<IResetForm>({ mode: "onChange", });

//   const onSubmit = async (data: IResetForm) => {
//     if (data.password !== data.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }


//     let datas={
//       token:token,
//     newPassword:data.password
//     }

//     try {
//       const response = await reseturl(datas);
//       console.log("response",response);

//       alert(response.data.message || "Password reset successful!");
//       navigate("/login"); 
//     } catch (error: any) {
//       console.error(error);
//       alert(error.response?.data?.message || "Something went wrong!");
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-[400px]">
//         <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//           <div>
//             <label className="block mb-1 text-gray-600">New Password</label>
//             <input
//               type="password"
//               {...register("password", { required: true, minLength: 6, pattern: {
//   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
//   message: "Enter a valid email address",
// }, })}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2"
//               placeholder="Enter new password"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
//             )}
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-600">Confirm Password</label>
//             <input
//               type="password"
//               {...register("confirmPassword", { required: true , minLength: 6, pattern: {
//   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
//   message: "Enter a valid email address",
// },})}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2"
//               placeholder="Confirm new password"
//             />
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm mt-1">Please confirm your password</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
