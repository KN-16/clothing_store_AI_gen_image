import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import HomePage from '../pages/HomePage';
import Products  from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import ProtectedRoute from "../components/ProtectedRoute";
import OrdersPage from "../pages/Order";
import CartPage from '../pages/Cart';
import AIGenImage from '../pages/AIGenImage';

//Layouts
import MainLayout from '../layouts/MainLayout';

//Context
import { AuthProvider } from "../context/AuthContext";

import { CartProvider } from "../context/CartContext";


const AppRoutes = () => (
  <BrowserRouter>
    <AuthProvider>
    <CartProvider>
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/products" element={<MainLayout><Products /></MainLayout>}/>
      <Route path="/products/detail" element={<MainLayout><ProductDetail /></MainLayout>} />
      <Route exact path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/cart" element={<MainLayout><CartPage /> </MainLayout>} />
      <Route path="/orders" element={<ProtectedRoute ><MainLayout><OrdersPage /> </MainLayout></ProtectedRoute>} />
      <Route path="/gen-image" element={<MainLayout><AIGenImage /> </MainLayout>} />
    </Routes>
    </CartProvider>
  </AuthProvider>
  </BrowserRouter>
);

export default AppRoutes;