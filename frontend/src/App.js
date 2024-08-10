import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AllProduct from './components/allProduct';
import DineIn from './components/dineIn';
import FormPage from './components';
import ProtectedRoute from './components/protectRout';
import OrderPlaced from './components/order_place';

function App() {
  return (
    <Routes>
      <Route path="/:tableNumber" element={<FormPage />} />
      <Route path="/AllProduct" element={<ProtectedRoute><AllProduct /></ProtectedRoute>} />
      <Route path="/DineIn" element={<ProtectedRoute><DineIn /></ProtectedRoute>} />
      <Route path="/OrderPlaced" element={<ProtectedRoute><OrderPlaced /></ProtectedRoute>} />
      
    </Routes>
  );
}

export default App; 