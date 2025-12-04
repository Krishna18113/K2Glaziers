// import { useEffect, useState } from "react";
// import { db } from "../firebase/config";
// import { logChange } from "../utils/logChange";
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
//   addDoc,
// } from "firebase/firestore";

// export default function Return() {
//   const [products, setProducts] = useState([]);
//   const [selected, setSelected] = useState("");
//   const [qty, setQty] = useState("");
//   const [customerName, setCustomerName] = useState("");

//   useEffect(() => {
//     loadInventory();
//   }, []);

//   async function loadInventory() {
//     const snap = await getDocs(collection(db, "inventory"));
//     setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//   }

//   async function handleReturn() {
//     if (!selected) return alert("Select a product!");
//     if (qty <= 0) return alert("Enter valid return quantity!");

//     const product = products.find((p) => p.id === selected);

//     const updatedStock = product.stock + Number(qty);

//     // Save return record
//     await addDoc(collection(db, "returns"), {
//       productId: product.id,
//       productName: product.name,
//       returnedQty: Number(qty),
//       customerName: customerName || "Unknown",
//       date: new Date(),
//       previousStock: product.stock,
//       updatedStock,
//     });

//     // Update stock
//     await updateDoc(doc(db, "inventory", product.id), {
//       stock: updatedStock,
//     });

//     // 🛑 MISSING: Add logChange call here!
//     logChange({
//       productId: product.id,
//       productName: product.name,
//       field: "stock",
//       oldValue: product.stock,
//       newValue: updatedStock,
//       reason: `Stock returned by ${customerName || "Unknown"}`,
//     });
//     // -------------------------------------

//     alert("Return recorded successfully!");
//     setQty("");
//     setCustomerName("");
//     loadInventory();
//   }

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Return Product</h1>

//       {/* Select product */}
//       <select
//         className="border p-2 w-full mb-3"
//         value={selected}
//         onChange={(e) => setSelected(e.target.value)}
//       >
//         <option value="">Select Product</option>
//         {products.map((p) => (
//           <option key={p.id} value={p.id}>
//             {p.name} (Stock: {p.stock})
//           </option>
//         ))}
//       </select>

//       {/* Quantity */}
//       <input
//         type="number"
//         className="border p-2 w-full mb-3"
//         placeholder="Return Quantity"
//         value={qty}
//         onChange={(e) => setQty(e.target.value)}
//       />

//       {/* Customer */}
//       <input
//         className="border p-2 w-full mb-3"
//         placeholder="Customer Name (optional)"
//         value={customerName}
//         onChange={(e) => setCustomerName(e.target.value)}
//       />

//       <button
//         onClick={handleReturn}
//         className="bg-blue-600 text-white px-4 py-2 w-full"
//       >
//         Submit Return
//       </button>
//     </div>
//   );
// }
