import { useEffect, useState } from "react";
import { ref, getDatabase, set, onValue, DataSnapshot } from "firebase/database";
import { motion } from "framer-motion";
import { currentDate } from "../../../utils/ShortCut";

interface Product {
  name: string;
  quantity: number;
  id: number;
  [key: string]: any;
}

interface FormState {
  id: string;
  productName: string;
  productId: number;
  description: string;
  quantity: number;
  distributedTo: string;
  distributedQuantity: number;
  createdDate: string;
  createdBy: string;
  createdByName: string;
}

const INITIAL_FORM: FormState = {
  id: "",
  productName: "",
  productId: 0,
  description: "",
  quantity: 0,
  distributedTo: "",
  distributedQuantity: 0,
  createdDate: "",
  createdBy: "",
  createdByName: "",
};

const CreateDistribution: React.FC = () => {
  const db = getDatabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "distributedQuantity"
          ? Number(value)
          : value,
    }));
  };

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      setProducts(data ? Object.values(data) : []);
    });

    return () => unsubscribe();
  }, [db]);

  const handleProductSelect = (productName: string) => {
    const product = products.find((p) => p.name === productName) || null;
    setSelectedProduct(product);
    setForm((prev) => ({
      ...prev,
      productName,
      quantity: product?.quantity ?? 0,
      productId: product?.id ?? 0,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.productName) newErrors.productName = "Product is required";
    if (!form.distributedTo.trim()) newErrors.distributedTo = "Receiver name is required";
    if (form.distributedQuantity <= 0)
      newErrors.distributedQuantity = "Quantity must be greater than 0";
    if (form.distributedQuantity > (selectedProduct?.quantity ?? 0))
      newErrors.distributedQuantity = "Quantity exceeds available stock";

    return newErrors;
  };

  const handleAddProduct = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const id = `DP-${Date.now()}`;
    const distRef = ref(db, `distribution/${form.productId}/${id}`);
    const createdByName = sessionStorage.getItem("name") || "unknown";
    const createdBy = sessionStorage.getItem("userId") || "unknown";

    const payload: FormState = {
      ...form,
      id,
      createdDate: currentDate(),
      createdByName,
      createdBy,
    };

    set(distRef, payload).then(() => {
      const newQty = form.quantity - form.distributedQuantity;
      const prodPath = ref(db, `products/${form.productId}/quantity`);
      set(prodPath, newQty);
      setForm({ ...INITIAL_FORM });
      setSelectedProduct(null);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 border rounded-2xl shadow-md bg-white"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Add New Distribution
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Select */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Product Name
          </label>
          <select
            name="productName"
            value={form.productName}
            onChange={(e) => handleProductSelect(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
              errors.productName ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Product</option>
            {products.map((prod, idx) => (
              <option key={idx} value={prod.name}>
                {prod.name}
              </option>
            ))}
          </select>
          {errors.productName && (
            <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
          )}
        </div>

        {/* Available Quantity */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Available Quantity
          </label>
          <div className="w-full p-2 border rounded-lg bg-gray-100">
            {selectedProduct?.quantity ?? "—"}
          </div>
        </div>

        {/* Receiver */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Receiver Name
          </label>
          <input
            type="text"
            name="distributedTo"
            value={form.distributedTo}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
              errors.distributedTo ? "border-red-500" : ""
            }`}
          />
          {errors.distributedTo && (
            <p className="text-red-500 text-sm mt-1">{errors.distributedTo}</p>
          )}
        </div>

        {/* Distributed Quantity */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Quantity Distributed
          </label>
          <input
            type="number"
            name="distributedQuantity"
            value={form.distributedQuantity}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
              errors.distributedQuantity ? "border-red-500" : ""
            }`}
          />
          {errors.distributedQuantity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.distributedQuantity}
            </p>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Comments
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter description..."
          rows={3}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAddProduct}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg shadow-md"
      >
        Add Distribution
      </motion.button>
    </motion.div>
  );
};

export default CreateDistribution;
