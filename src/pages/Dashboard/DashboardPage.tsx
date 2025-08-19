import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";



const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const firstname = sessionStorage.getItem("name")?.split(" ")[0] || ""
  const [name, setName] = useState(sessionStorage.getItem("name")|| "")
  const [fname, setFName] = useState(firstname)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-indigo-700 text-white flex flex-col transform transition-transform duration-300 z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}
      >
        <div className="p-6 text-2xl font-bold border-b border-indigo-600">
          My Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <a onClick={()=>{
            navigate("/dashboard")
            setIsSidebarOpen(false)
          }} href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-600">
            <FaTachometerAlt /> Overview
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-600">
            <FaUsers /> Users
          </a>
          <a 
          onClick={()=>{
            navigate("/dashboard/products")
            setIsSidebarOpen(false)
          }}
          href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-600">
            <FaBoxOpen /> Products
          </a>
          <a
          onClick={()=>{
            navigate("/dashboard/distribution")
            setIsSidebarOpen(false)
          }}
          href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-600">
            <FaChartLine /> Distribution
          </a>
        </nav>
        <button className="flex items-center gap-2 p-4 border-t border-indigo-600 hover:bg-indigo-600">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top bar */}
        <header className="flex justify-between items-center bg-white p-4 shadow sticky top-0 z-20">
          {/* Hamburger button on mobile */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <h1 className="text-xl font-bold text-gray-700">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">Hello, {fname} 👋</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 space-y-6">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
