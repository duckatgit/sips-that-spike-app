// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { editProduct } from "../API/backapi";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";

// interface IUser {
//   name: string;
//   productname: string;
//   qty: number;
//   price: number;
//   stockPrice: number;
//   category?: string;
//   description?: string;
// }

// interface IData {
//   data: IUser | null;
//   onClose: () => void;
// }

// export const Edit: React.FC<IData> = ({ data, onClose }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     watch,
//   } = useForm<IUser>({
//     defaultValues: data ?? undefined,
//   });

//   const descriptionValue = watch("description");

//   useEffect(() => {
//   if (data) {
//     reset(data);
//     setValue("description", data.description || "");
//   }
// }, [data, reset, setValue]);


//   const onSubmit = async (values: IUser) => {
//     console.log("Edited values:", values);
//     const response = await editProduct(values);
//     console.log("response", response);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-fuchsia-50 bg-opacity-40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl relative">
 
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
//         >
//           ✖
//         </button>

//         <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
//           ✏️ Edit Product
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
   
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Product Name
//               </label>
//               <input
//                 {...register("productname", { required: "Product name is required" })}
//                 className="w-full border px-3 py-2 rounded-lg"
//               />
//               {errors.productname && (
//                 <p className="text-red-500 text-sm">{errors.productname.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Admin Name
//               </label>
//               <input
//                 {...register("name", { required: "Admin name is required" })}
//                 className="w-full border px-3 py-2 rounded-lg"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-sm">{errors.name.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Quantity</label>
//               <input
//                 type="number"
//                 {...register("qty", { required: true, min: 1 })}
//                 className="w-full border px-3 py-2 rounded-lg"
//               />
//               {errors.qty && (
//                 <p className="text-red-500 text-sm">Quantity must be at least 1</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Price</label>
//               <input
//                 type="number"
//                 {...register("price", { required: true, min: 0 })}
//                 className="w-full border px-3 py-2 rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Stock</label>
//               <input
//                 type="number"
//                 {...register("stockPrice", { required: true, min: 0 })}
//                 className="w-full border px-3 py-2 rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Category</label>
//               <select
//                 {...register("category", { required: true })}
//                 className="w-full border px-3 py-2 rounded-lg"
//               >
//                 <option value="">Select category</option>
//                 <option value="Electronics">Electronics</option>
//                 <option value="Clothing">Clothing</option>
//                 <option value="Home & Kitchen">Home & Kitchen</option>
//                 <option value="Beauty & Personal Care">
//                   Beauty & Personal Care
//                 </option>
//                 <option value="Grocery & Food">Grocery & Food</option>
//               </select>
//             </div>
//           </div>

       
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Description / Feedback
//             </label>
//             <ReactQuill
//               theme="snow"
//               value={descriptionValue || ""}
//               onChange={(value) => setValue("description", value)}
//               className="bg-white rounded-lg border border-gray-300"
//               modules={{
//                 toolbar: [
//                   [{ header: [1, 2, 3, false] }],
//                   ["bold", "italic", "underline", "strike"],
//                   [{ color: [] }, { background: [] }],
//                   [{ list: "ordered" }, { list: "bullet" }],
//                   ["link", "image", "video"],
//                   ["blockquote", "code-block"],
//                   ["clean"],
//                 ],
//               }}
//             />
//           </div>

        
//           <div className="flex justify-between mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
