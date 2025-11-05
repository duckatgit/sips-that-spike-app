// import { useEffect, useState } from "react";
// import { singleton } from "../API/backapi";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
// import { deleteProduct } from "../API/backapi";
// import { Edit } from "./Edit";


// interface IUser {
//   _id: string;
//   name: string;
//   productname: string;
//   qty: number;
//   price: number;
//   stockPrice: number;
//   category?: string;
// }

// export const Data = () => {
//   const [products, setProducts] = useState<IUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [sortBy, setSortBy] = useState("price");
//   const [order, setOrder] = useState("asc");
//   const [open, setOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<IUser | null>(null);

//   const itemsPerPage = 5;

//   const authentication:any = localStorage.getItem("isAuth");
//   console.log("authentication",authentication);
// const isAuth=JSON.parse(authentication);
// console.log("isAuth",isAuth);
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await singleton({
//         page: currentPage,
//         limit: itemsPerPage,
//         search,
//         category,
//         sortBy,
//         order,
//         role:isAuth.role,
//       });

//       setProducts(res.data.data || []);
//       setTotalPages(res.data.totalPages || 1);
//       setError(null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [currentPage, search, category, sortBy, order]);

  
//   const handleEditClick = (product: IUser) => {
//     setSelectedProduct(product);
//     setOpen(true);
//   };

 
//   const handleDeleteClick = async(id: string) => {
//     console.log("Delete product with ID:", id);
//       let response=await deleteProduct(id);
//       console.log("delete response",response);
//    await   fetchProducts();
//   };


//   const handleCloseEdit = () => {
//     setOpen(false);
//     setSelectedProduct(null);
//     fetchProducts(); 
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
//         🧾 Product Dashboard
//       </h2>

   
//       {open ? (
//         <Edit data={selectedProduct} onClose={handleCloseEdit} />
//       ) : (
//         <>
   
//           <div className="flex flex-wrap justify-center gap-4 mb-6">
//             <input
//               type="text"
//               placeholder="🔍 Search..."
//               className="border px-3 py-2 rounded-lg shadow-sm"
//               value={search}
//               onChange={(e) => {
//                 setCurrentPage(1);
//                 setSearch(e.target.value);
//               }}
//             />

//           <select
//   className="border px-3 py-2 rounded-lg shadow-sm"
//   value={category}
//   onChange={(e) => {
//     setCurrentPage(1);
//     setCategory(e.target.value);
//   }}
// >
//   <option value="">All Categories</option>
//   <option value="electronics">Electronics</option>
//   <option value="clothing">Clothing</option>
//   <option value="home & kitchen">Home & Kitchen</option>
//   <option value="beauty & personal care">Beauty & Personal Care</option>
//   <option value="grocery & food">Grocery & Food</option>
// </select>

//             <select
//               className="border px-3 py-2 rounded-lg shadow-sm"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="price">Sort by Price</option>
//               <option value="qty">Sort by Quantity</option>
//               <option value="stockPrice">Sort by Stock</option>
//             </select>

//             <select
//               className="border px-3 py-2 rounded-lg shadow-sm"
//               value={order}
//               onChange={(e) => setOrder(e.target.value)}
//             >
//               <option value="asc">Ascending</option>
//               <option value="desc">Descending</option>
//             </select>
//           </div>

        
//           {loading ? (
//             <div className="text-center text-gray-500">⏳ Loading...</div>
//           ) : error ? (
//             <div className="text-center text-red-500">{error}</div>
//           ) : products.length === 0 ? (
//             <p className="text-center">No products available</p>
//           ) : (
//             <table className="min-w-full bg-white border rounded-lg shadow-md overflow-hidden">
//               <thead>
//                 <tr className="bg-indigo-100 text-gray-700">
//                   <th className="px-6 py-3 text-left">Product</th>
//                   <th className="px-6 py-3 text-left">Admin</th>
//                   <th className="px-6 py-3 text-left">Qty</th>
//                   <th className="px-6 py-3 text-left">Price</th>
//                   <th className="px-6 py-3 text-left">Stock</th>
//                   <th className="px-6 py-3 text-left">Category</th>

                  
//                     {isAuth.role=="admin"?
//                     <>
//                        <th className="px-6 py-3 text-left">Edit</th>
//                   <th className="px-6 py-3 text-left">Delete</th>
//                   </>
//                   :''
// }
                    
                  
                 
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((p) => (
//                   <tr key={p._id} className="border-t hover:bg-gray-50">
//                     <td className="px-6 py-3">{p.productname}</td>
//                     <td className="px-6 py-3">{p.name}</td>
//                     <td className="px-6 py-3">{p.qty}</td>
//                     <td className="px-6 py-3">${p.price}</td>
//                     <td className="px-6 py-3">{p.stockPrice}</td>
//                     <td className="px-6 py-3">{p.category || "General"}</td>

//                       {isAuth.role=="admin"?
//                     <>
//                        <td
//                       className="px-6 py-3 text-indigo-600 cursor-pointer hover:text-indigo-800"
//                       onClick={() => handleEditClick(p)}
//                     >
//                       <FontAwesomeIcon icon={faPenToSquare} />
//                     </td>
//                     <td
//                       className="px-6 py-3 text-red-500 cursor-pointer hover:text-red-700"
//                       onClick={() => handleDeleteClick(p._id)}
//                     >
//                       <FontAwesomeIcon icon={faTrash} />
//                     </td>
//                   </>
//                   :''
// }
                    
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

          
//           {products.length > 0 && (
//             <div className="flex justify-center mt-6 space-x-2">
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`px-4 py-2 rounded-lg ${
//                     currentPage === i + 1
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };
