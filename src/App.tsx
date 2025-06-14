
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppDataProvider } from "./contexts/AppDataContext";
import { SupabaseDataProvider } from "./contexts/SupabaseDataContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RBACProvider } from "./contexts/RBACContext";
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
import LoginPage from "./components/auth/LoginPage";
import SignUpPage from "./components/auth/SignUpPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SupabaseDataProvider>
        <AppDataProvider>
          <RBACProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
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
          </RBACProvider>
        </AppDataProvider>
      </SupabaseDataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
