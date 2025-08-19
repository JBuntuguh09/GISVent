import { useState } from "react";
import { push, ref, getDatabase } from "firebase/database";
import { motion } from "framer-motion";
import { currentDate } from "../../../utils/ShortCut";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categories = ["Electronics", "Clothing", "Books", "Furniture"];

const CreateProduct: React.FC = () => {
  const db = getDatabase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    category: "",
    price: "",
    stock: "",
    status: "",
  });

  // ✅ Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Manual validation
  const validateForm = () => {
    if (!formData.name) return "Product name is required";
    if (!formData.quantity || Number(formData.quantity) <= 0) return "Quantity must be positive";
    if (!formData.category) return "Category is required";
    if (!formData.price) return "Price is required";
    if (!formData.stock || Number(formData.stock) <= 0) return "Stock must be positive";
    if (!formData.status) return "Status is required";
    if (!formData.description) return "Description is required";
    return null;
  };

  // ✅ Submit handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("vvvvvvvvvvvvvvv")
    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);
    // try {
    //   const productsRef = ref(db, "products");
    //   await push(productsRef, {
    //     ...formData,
    //     quantity: Number(formData.quantity),
    //     stock: Number(formData.stock),
    //     createdDate: currentDate(),
    //     createdBy: sessionStorage.getItem("userId") || "user",
    //   });
    //   toast.success("Product added successfully! 🎉");

    //   // reset form
    //   setFormData({
    //     name: "",
    //     description: "",
    //     quantity: "",
    //     category: "",
    //     price: "",
    //     stock: "",
    //     status: "",
    //   });
    // } catch (error) {
    //   console.error("Error adding product:", error);
    //   toast.error("Failed to add product ❌");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 border rounded-2xl shadow-md bg-white"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Product</h2>

        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="$0.00"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>

          {/* Description Full Width */}
          <div className="mt-6 md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              rows={3}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
           
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </motion.button>
        </form>
      </motion.div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default CreateProduct;
