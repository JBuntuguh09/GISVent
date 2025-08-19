import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  import { FaUsers, FaShoppingCart, FaDollarSign, FaChartLine, FaPlus, FaCog, FaEnvelope, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
  
  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4780 },
    { month: "May", revenue: 5890 },
    { month: "Jun", revenue: 6390 },
  ];
  
  const growthData = [
    { name: "Q1", growth: 20 },
    { name: "Q2", growth: 40 },
    { name: "Q3", growth: 35 },
    { name: "Q4", growth: 50 },
  ];
  
  const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

 
  
  const Dash = () => {
    const navigate = useNavigate()
    const db = getDatabase()

    const [users, setUsers] = useState<any[]>([])
    const [producrs, setProducts] = useState<any[]>([])

    const getUsers = ()=>{
      const userRef = ref(db, "users");
      const productRef = ref(db, "products");
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUsers(data ? Object.values(data) : []);
       // setIsLoading(false);
      });

      onValue(productRef, (snapshot) => {
        const data = snapshot.val();
        setProducts(data ? Object.values(data) : []);
       // setIsLoading(false);
      });
    }

    useEffect(() => {
      getUsers()
    }, [db])
    
    return (
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full text-2xl">
              <FaUsers />
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Total Users</h2>
              <p className="text-2xl font-bold text-indigo-700">{users.length}</p>
            </div>
          </div>
  
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full text-2xl">
              <FaShoppingCart />
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Total Products</h2>
              <p className="text-2xl font-bold text-green-700">{producrs.length}</p>
            </div>
          </div>
  
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full text-2xl">
              <FaDollarSign />
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Daily Distribution</h2>
              <p className="text-2xl font-bold text-yellow-700">100</p>
            </div>
          </div>
  
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-full text-2xl">
              <FaChartLine />
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Monthly Distributio</h2>
              <p className="text-2xl font-bold text-red-700">1700</p>
            </div>
          </div>
        </div>
  
        {/* Charts + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Line Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
  
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <button 
              onClick={()=>navigate("/dashboard/distribute-product")}
              className="flex items-center justify-center gap-2 p-4 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition font-medium">
                <FaPlus /> Add Product
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition font-medium">
                <FaFileAlt /> Distribute Product
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-yellow-100 text-yellow-600 rounded-xl hover:bg-yellow-200 transition font-medium">
                <FaEnvelope /> Send Email{"\n\n     "}
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition font-medium">
                <FaCog /> Settings
              </button>
            </div>
          </div>
  
          {/* Growth Pie Chart */}
          <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Growth Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={growthData}
                  dataKey="growth"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {growthData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dash;
  