// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { createTask } from "../API/backapi";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";

// interface IUser {
//   name?: string;
//   productname: string;
//   qty: number;
//   price: number;
//   stockPrice: number;
//   category: string;
//   description?: string;
// }

// export const Create = () => {
//   const [products, setProducts] = useState<IUser[]>([]);
//   const authentication: any = localStorage.getItem("isAuth");
//   const isAuth = JSON.parse(authentication);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//   } = useForm<IUser>();

//   useEffect(() => {
//     const storedProducts = localStorage.getItem("products");
//     if (storedProducts) setProducts(JSON.parse(storedProducts));
//   }, []);

//   const onSubmit = async (data: IUser) => {
//     console.log("formdata", data);
//     const Idata = { userId: isAuth.userId, name: isAuth.name, ...data };

//     const taskCreated = await createTask(Idata);
//     console.log("taskCreated", taskCreated);

//     const updatedProducts = [...products, Idata];
//     setProducts(updatedProducts);
//     localStorage.setItem("products", JSON.stringify(updatedProducts));
//     reset();
//   };

 
//   const quillModules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ color: [] }, { background: [] }], 
//       [{ align: [] }], 
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["blockquote", "code-block"],
//       ["link", "image", "video"],
//       ["clean"], 
//     ],
//   };

//   const quillFormats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "color",
//     "background",
//     "align",
//     "list",
//     "bullet",
//     "blockquote",
//     "code-block",
//     "link",
//     "image",
//     "video",
//   ];

//   return (
//     <div className="max-w-6xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
//       <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
//         🛍️ Create Product
//       </h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
   
//         <div className="grid grid-cols-2 gap-8">
      
//           <div className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium text-gray-700">
//                 Product Name
//               </label>
//               <input
//                 {...register("productname", { required: true })}
//                 placeholder="Enter product name"
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//               />
//               {errors.productname && (
//                 <p className="text-red-500 text-sm">Product name is required.</p>
//               )}
//             </div>

//             <div>
//               <label className="block mb-1 font-medium text-gray-700">
//                 Category
//               </label>
//               <select
//                 {...register("category", { required: true })}
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white"
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
//               {errors.category && (
//                 <p className="text-red-500 text-sm">Category is required.</p>
//               )}
//             </div>

//             <div>
//               <label className="block mb-1 font-medium text-gray-700">
//                 Quantity
//               </label>
//               <input
//                 type="number"
//                 {...register("qty", { required: true })}
//                 placeholder="Enter quantity"
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//               />
//               {errors.qty && (
//                 <p className="text-red-500 text-sm">Quantity is required.</p>
//               )}
//             </div>
//           </div>

       
//           <div className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium text-gray-700">
//                 Price
//               </label>
//               <input
//                 type="number"
//                 {...register("price", { required: true })}
//                 placeholder="Enter price"
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//               />
//               {errors.price && (
//                 <p className="text-red-500 text-sm">Price is required.</p>
//               )}
//             </div>

//             <div>
//               <label className="block mb-1 font-medium text-gray-700">
//                 Stock Price
//               </label>
//               <input
//                 type="number"
//                 {...register("stockPrice", { required: true })}
//                 placeholder="Enter stock price"
//                 className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//               />
//               {errors.stockPrice && (
//                 <p className="text-red-500 text-sm">Stock price is required.</p>
//               )}
//             </div>
//           </div>
//         </div>

      
//         <div>
//           <label className="block mb-1 font-medium text-gray-700 text-lg">
//             Product Description / Feedback (Optional)
//           </label>
//           <ReactQuill
//             theme="snow"
//             placeholder="Enter detailed description, features, or notes..."
//             modules={quillModules}
//             formats={quillFormats}
//             onChange={(value) => setValue("description", value)}
//             className="bg-white rounded-lg border border-gray-300 mt-2 min-h-full"
//           />
//         </div>

 
//         <div className="text-center pt-4">
//           <button
//             type="submit"
//             className="w-1/3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition"
//           >
//              Create Product
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
