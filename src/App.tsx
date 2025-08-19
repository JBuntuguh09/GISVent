import { useState } from 'react'
import Auth from './pages/Auth/Auth'
import DashboardPage from './pages/Dashboard/DashboardPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dash from './pages/Dashboard/Dash';
import Products from './pages/Dashboard/Products/Products';
import AddProduct from './pages/Dashboard/Products/AddProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateDistribution from './pages/Dashboard/Products/CreateDistribution';
import Distribution from './pages/Dashboard/Products/Distribution';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<DashboardPage />} >
          <Route path="" element={<Dash/>} />
          <Route path="products" element={<Products/>} />
          <Route path="add-product" element={<AddProduct/>} />
          <Route path="distribution" element={<Distribution/>} />
          <Route path="distribute-product" element={<CreateDistribution/>} />
        </Route>  
      </Routes>
    </BrowserRouter>
    <ToastContainer position="bottom-center" 
    newestOnTop={false}
    closeOnClick
    pauseOnHover
    draggable
    autoClose={3000}/>
    </>
  )
}

export default App
