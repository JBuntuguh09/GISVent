import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";

const statusColor: Record<string, string> = {
  "In Stock": "text-green-600",
  "Low Stock": "text-yellow-600",
  "Out of Stock": "text-red-600",
};

const Spinner = () => {
  const spinTransition = { loop: Infinity, ease: "linear", duration: 1 };
  const circleStyle: React.CSSProperties = {
    width: 40, height: 40,
    border: "5px solid #ccc",
    borderTopColor: "#1d4ed8",
    borderRadius: "50%",
  };

  return (
    <motion.div style={circleStyle} animate={{ rotate: 360 }} transition={spinTransition} />
  );
};

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = getDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      setProducts(data ? Object.values(data) : []);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  const deleteProduct = async (id: string) => {
    const productsRef = ref(db, "products/"+id);
    onValue(productsRef, (snapshot) => {
      remove(snapshot.ref);
    }, { onlyOnce: true });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <button onClick={() => navigate("/dashboard/add-product")} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        + Add Product
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody>
                {products.map((p, i) => (
                  <motion.tr
                    key={p.sku ?? i}
                    className="border-t"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.quantity ?? 0}</td>
                    <td className="px-4 py-2">{p.category}</td>
                    <td className={`px-4 py-2 font-semibold ${statusColor[p.status] || "text-gray-600"}`}>
                      {p.status}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="text-blue-600 hover:underline">Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => deleteProduct(p.id)}>
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      )}
    </div>
  );
}
