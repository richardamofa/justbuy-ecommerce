import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { OrdersPage } from "./pages/OrdersPage";
import { CustomersPage } from "./pages/CustomersPage";
import { InventoryPage } from "./pages/InventoryPage";
import { SectionsPage } from "./pages/SectionsPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/sections" element={<SectionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
