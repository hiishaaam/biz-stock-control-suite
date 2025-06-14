
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppDataProvider } from "./contexts/AppDataContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import ProductsPage from "./components/products/ProductsPage";
import CategoriesPage from "./components/categories/CategoriesPage";
import InventoryPage from "./components/inventory/InventoryPage";
import SuppliersPage from "./components/suppliers/SuppliersPage";
import UsersPage from "./components/users/UsersPage";
import OrdersPage from "./components/orders/OrdersPage";
import ReportsPage from "./components/reports/ReportsPage";
import LandingPage from "./components/landing/LandingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppDataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="suppliers" element={<SuppliersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<Dashboard />} />
            </Route>
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppDataProvider>
  </QueryClientProvider>
);

export default App;
