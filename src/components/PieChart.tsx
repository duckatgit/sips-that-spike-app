// import React, { useEffect, useState } from "react";
// import { singleton, showProduct } from "../API/backapi";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// interface IProduct {
//   name: string;
//   qty: number;
//   price: number;
//   stock: number;
//   category: string;
// }

// const COLORS = [
//   "#6366F1",
//   "#10B981",
//   "#F59E0B",
//   "#EC4899",
//   "#06B6D4",
//   "#8B5CF6",
//   "#F43F5E",
// ];

// export const PieChartPage = () => {
//   const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const authString = localStorage.getItem("isAuth");
//         const isAuth = authString ? JSON.parse(authString) : {};

//         let responseData: IProduct[] = [];

//         if (isAuth?.role === "admin") {
//           const res = await singleton();
         
//           responseData = Array.isArray(res.data)
//             ? res.data
//             : res.data?.data || [];
//         } else {
//           const res = await showProduct();
//           responseData = Array.isArray(res.data)
//             ? res.data
//             : res.data?.data || [];
//         }

//         if (!responseData || responseData.length === 0) {
//           setPieData([]);
//           setError("No product data found.");
//           return;
//         }

//         // ✅ Build category counts
//         const categoryCounts: Record<string, number> = {};
//         responseData.forEach((p) => {
//           const cat = p.category || "Uncategorized";
//           categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
//         });

       
//         setPieData(
//           Object.entries(categoryCounts).map(([name, value]) => ({
//             name,
//             value,
//           }))
//         );
//       } catch (err) {
//         console.error("Error fetching pie chart data:", err);
//         setError("⚠️ Failed to load product data.");
//         setPieData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center mt-16 text-gray-400 text-lg">
//         Loading product data...
//       </div>
//     );
//   }

  
//   if (error || pieData.length === 0) {
//     return (
//       <div className="text-center mt-16 text-gray-400 text-lg">
//         {error || "No product data found."}
//       </div>
//     );
//   }


//   return (
//     <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-5xl mx-auto mt-10 border border-gray-700">
//       <h2 className="text-3xl font-extrabold text-center mb-2 text-white tracking-wide">
//         Product Distribution
//       </h2>
//       <p className="text-center text-gray-400 mb-8">
//         Insights by{" "}
//         <span className="text-indigo-400 font-medium">Category</span>
//       </p>

//       <div className="h-[420px] w-full">
//         <ResponsiveContainer>
//           <PieChart>
//             <defs>
//               <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
//                 <feDropShadow
//                   dx="0"
//                   dy="2"
//                   stdDeviation="4"
//                   floodColor="#000000"
//                   floodOpacity="0.3"
//                 />
//               </filter>
//             </defs>

//             <Pie
//               data={pieData}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={140}
//               innerRadius={70}
//               paddingAngle={5}
//               labelLine={false}
//               label={({ name, percent }) =>
//                 `${name} ${((percent as number) * 100).toFixed(1)}%`
//               }
//               filter="url(#shadow)"
//             >
//               {pieData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                   stroke="#0f172a"
//                   strokeWidth={2}
//                 />
//               ))}
//             </Pie>

//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#1f2937",
//                 borderRadius: "8px",
//                 border: "1px solid #374151",
//                 color: "#f9fafb",
//               }}
//               itemStyle={{ color: "#f9fafb" }}
//             />
//             <Legend
//               verticalAlign="bottom"
//               height={36}
//               iconType="circle"
//               wrapperStyle={{
//                 color: "#e5e7eb",
//                 fontSize: "14px",
//                 paddingTop: "20px",
//               }}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };
