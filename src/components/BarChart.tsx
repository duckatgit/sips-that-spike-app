// import { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import { singleton } from "../API/backapi";

// interface IProduct {
//   name: string;
//   productname: string;
//   qty: number;
//   price: number;
//   stockPrice: number;
//   category?: string;
// }



// export const BarChartPage = () => {
//   const [products, setProducts] = useState<IProduct[]>([]);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalStock, setTotalStock] = useState(0);
//   const [lowStock, setLowStock] = useState(0);

//   const [barData, setBarData] = useState<number[]>([]);
//   const [barLabels, setBarLabels] = useState<string[]>([]);
//   const [pieData, setPieData] = useState<number[]>([]);
//   const [pieLabels, setPieLabels] = useState<string[]>([]);
//   const [lineData, setLineData] = useState<number[]>([]);
//   const [lineLabels, setLineLabels] = useState<string[]>([]);

//   useEffect(() => {
//     const authString = localStorage.getItem("isAuth");
//     const isAuth = authString ? JSON.parse(authString) : {};
//     const fetchproduct = async () => {
//       // const storedProducts = localStorage.getItem("products");

//       if (isAuth.role == "admin") {
//         const value = await singleton();
//         console.log("value of single data", value.data.data);
//         const storedProducts = value.data.data;

//         if (storedProducts) {
//           // const parsed: IProduct[] = JSON.parse(storedProducts);
//           const parsed: IProduct[] = storedProducts;
//           // setProducts(parsed);
//           setProducts(storedProducts);
//           setTotalProducts(parsed.length);
//           setTotalStock(
//             parsed.reduce((acc, p) => acc + (p.stockPrice ?? 0), 0)
//           );
//           setLowStock(parsed.filter((p) => p.stockPrice < 20).length);

//           setBarLabels(parsed.map((p) => p.productname ?? "Unknown"));
//           setBarData(parsed.map((p) => Number(p.qty ?? 0)));

//           const categoryCount: Record<string, number> = {};
//           parsed.forEach((p) => {
//             const cat = p.category ?? "Uncategorized";
//             categoryCount[cat] = (categoryCount[cat] || 0) + 1;
//           });
//           setPieLabels(Object.keys(categoryCount));
//           setPieData(Object.values(categoryCount));

//           setLineLabels(parsed.map((p) => p.productname ?? "Unknown"));
//           setLineData(parsed.map((p) => Number(p.stockPrice ?? 0)));
//         }
//       } else {
//         const value = await singleton();
//         console.log("value of single data", value.data.data);
//         const storedProducts = value.data.data;

//         if (storedProducts) {
//           // const parsed: IProduct[] = JSON.parse(storedProducts);
//           const parsed: IProduct[] = storedProducts;
//           // setProducts(parsed);
//           setProducts(storedProducts);
//           setTotalProducts(parsed.length);
//           setTotalStock(
//             parsed.reduce((acc, p) => acc + (p.stockPrice ?? 0), 0)
//           );
//           setLowStock(parsed.filter((p) => p.stockPrice < 20).length);

//           setBarLabels(parsed.map((p) => p.productname ?? "Unknown"));
//           setBarData(parsed.map((p) => Number(p.qty ?? 0)));

//           const categoryCount: Record<string, number> = {};
//           parsed.forEach((p) => {
//             const cat = p.category ?? "Uncategorized";
//             categoryCount[cat] = (categoryCount[cat] || 0) + 1;
//           });
//           setPieLabels(Object.keys(categoryCount));
//           setPieData(Object.values(categoryCount));

//           setLineLabels(parsed.map((p) => p.productname ?? "Unknown"));
//           setLineData(parsed.map((p) => Number(p.stockPrice ?? 0)));
//         }
//       }
//     };

//     fetchproduct();
//   }, []);
//   if (products.length == 0) {
//     return (
//       <div className="text-center text-gray-500 mt-10 text-lg font-medium">
//         {"🗂️ No products found."}
//       </div>
//     );
//   }
//   return (
//     <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <div className="p-5 rounded-2xl shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
//           <p className="text-lg font-semibold">Total Products</p>
//           <p className="text-3xl font-bold mt-2">{totalProducts}</p>
//         </div>

//         <div className="p-5 rounded-2xl shadow-md bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
//           <p className="text-lg font-semibold">Total Stock </p>
//           <p className="text-3xl font-bold mt-2">{products.length}</p>
//         </div>

//         <div className="p-5 rounded-2xl shadow-md bg-gradient-to-r from-rose-500 to-orange-500 text-white">
//           <p className="text-lg font-semibold">Low Stock Items</p>
//           <p className="text-3xl font-bold mt-2">{lowStock}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//           <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
//             📦 Product Quantity Overview
//           </h2>
//           <Chart
//             options={{
//               chart: { id: "bar-chart", toolbar: { show: false } },
//               xaxis: {
//                 categories: barLabels,
//                 labels: { style: { colors: "#6b7280" } },
//               },
//               yaxis: { labels: { style: { colors: "#6b7280" } } },
//               grid: { borderColor: "#e5e7eb" },
//               colors: ["#6366f1"],
//               plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
//             }}
//             series={[{ name: "Quantity", data: barData }]}
//             type="bar"
//             height={350}
//           />
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//           <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
//             🏷️ Products by Category
//           </h2>
//           <Chart
//             options={{
//               labels: pieLabels,
//               legend: { position: "bottom" },
//               colors: ["#4f46e5", "#22c55e", "#f97316", "#06b6d4", "#e11d48"],
//             }}
//             series={pieData}
//             type="donut"
//             height={350}
//           />
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 lg:col-span-2">
//           <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
//             📈 Stock Price Trends
//           </h2>
//           <Chart
//             options={{
//               chart: { id: "line-chart", toolbar: { show: false } },
//               xaxis: {
//                 categories: lineLabels,
//                 labels: { style: { colors: "#6b7280" } },
//               },
//               yaxis: { labels: { style: { colors: "#6b7280" } } },
//               grid: { borderColor: "#e5e7eb" },
//               stroke: { curve: "smooth", width: 3 },
//               colors: ["#8b5cf6"],
//             }}
//             series={[{ name: "Stock Price", data: lineData }]}
//             type="area"
//             height={350}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
