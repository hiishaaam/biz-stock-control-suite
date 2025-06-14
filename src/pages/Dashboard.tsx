
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import DashboardMain from '../components/dashboard/Dashboard';
import ProductsPage from '../components/products/ProductsPage';
import CategoriesPage from '../components/categories/CategoriesPage';
import SuppliersPage from '../components/suppliers/SuppliersPage';
import InventoryPage from '../components/inventory/InventoryPage';
import ReportsPage from '../components/reports/ReportsPage';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<DashboardMain />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
