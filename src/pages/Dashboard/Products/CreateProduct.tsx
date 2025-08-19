// CreateProduct.tsx
import { useState } from "react";
import { push, ref, getDatabase } from "firebase/database";
import { motion } from "framer-motion";
import { currentDate } from "../../../utils/ShortCut";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const categories = ["Electronics", "Clothing", "Books", "Furniture"];

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description is required"),
  quantity: Yup.number().positive("Quantity must be positive").required("Quantity is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.string().required("Price is required"),
  stock: Yup.number().positive("Stock must be positive").required("Stock is required"),
  status: Yup.string().required("Status is required"),
});

const CreateProduct: React.FC = () => {
  const db = getDatabase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleAddProduct = async (data: any) => {
    setIsSubmitting(true);
    try {
      const productsRef = ref(db, "products");
      await push(productsRef, {
        ...data,
        createdDate: currentDate(),
        createdBy: sessionStorage.getItem("userId") || "user",
      });
      // Reset form or redirect as needed
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 border rounded-2xl shadow-md bg-white"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Product</h2>

      <form onSubmit={handleSubmit(handleAddProduct)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Product Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Enter product name"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Quantity</label>
          <input
            type="number"
            {...register("quantity")}
            placeholder="0"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
          <select
            {...register("category")}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
          <input
            type="text"
            {...register("price")}
            placeholder="$0.00"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Stock</label>
          <input
            type="number"
            {...register("stock")}
            placeholder="0"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
          <select
            {...register("status")}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        {/* Description Full Width */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
          <textarea
            {...register("description")}
            placeholder="Enter product description..."
            rows={3}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg shadow-md disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Product"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateProduct;
