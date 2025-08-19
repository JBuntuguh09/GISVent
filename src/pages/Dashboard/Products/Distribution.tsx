import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Spinner = () => (
  <motion.div
    style={{
      width: 50,
      height: 50,
      border: "5px solid #ccc",
      borderTopColor: "#1d4ed8",
      borderRadius: "50%",
    }}
    animate={{ rotate: 360 }}
    transition={{
      loop: Infinity,
      ease: "linear",
      duration: 1,
    }}
  />
);

export default function Distribution() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = getDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    const distributeRef = ref(db, "distribution");
    const unsubscribe = onValue(distributeRef, (snapshot) => {
      const d = snapshot.val() || {};
    
      const allRecords = Object.entries(d).flatMap(
        ([productId, distributions]) =>
          Object.entries(distributions).map(
            ([distId, record]) => ({ productId, distId, ...record })
          )
      );
    
      setData(allRecords);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [db]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Distribution</h1>
      <button
        onClick={() => navigate("/dashboard/distribute-product")}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Distribute Product
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
                <th className="px-4 py-2 text-left">Distributed To</th>
                <th className="px-4 py-2 text-left">Distributed By</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody>
                {data.map((p, i) => (
                  <motion.tr
                    key={p.sku || i}
                    className="border-t"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-4 py-2">{p.productName}</td>
                    <td className="px-4 py-2">{p.distributedQuantity || 0}</td>
                    <td className="px-4 py-2">{p.distributedTo}</td>
                    <td className="px-4 py-2">{p.createdByName}</td>
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
