// import React from "react";
// import { useForm } from "react-hook-form";
// import { forgeturl } from "../API/backapi";
// import { forgetotp } from "../API/backapi";
// import { useNavigate } from "react-router-dom";
// interface ForgotPasswordForm {
//   email: string;
// }

// export const Forget: React.FC = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({ mode: "onChange", });
// const navigate=useNavigate();
//   const onSubmit =async (data: ForgotPasswordForm) => {
//     console.log("Forgot password email:", data.email);
//     let response=await forgetotp({email:data.email});
//     console.log("response of forgetotp",response);
    
//        alert("otp sent !!");
//        navigate('/otp',{state:{email:data.email}});
//         //  let final= await forgeturl(data);
//         //  console.log("final",final);
// //  alert(final.data.message || "Email Sent!!");
//     // You can call your backend API here, for example:
//     // await forgotPassword({ email: data.email });
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm"
//       >
//         <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>

//         <div className="mb-4">
//           <label htmlFor="email" className="block text-gray-700 mb-1">
//             Email Address
//           </label>
//           <input
//             id="email"
//             type="email"
//             placeholder="Enter your email"
//             {...register("email", { required: "Email is required", pattern: {
//   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
//   message: "Enter a valid email address",
// }, })}
//             className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
//         >
//           Forget
//         </button>
//       </form>
//     </div>
//   );
// };
