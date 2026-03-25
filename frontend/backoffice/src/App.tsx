import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProductsPage } from '@/pages/catalog/ProductsPage';
import { ProductFormPage } from '@/pages/catalog/ProductFormPage';
import { DepartmentsPage } from '@/pages/catalog/DepartmentsPage';
import { StockLevelsPage } from '@/pages/inventory/StockLevelsPage';
import { ReceiveStockPage } from '@/pages/inventory/ReceiveStockPage';
import { SalesPage } from '@/pages/sales/SalesPage';
import { SaleDetailPage } from '@/pages/sales/SaleDetailPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="catalog/products" element={<ProductsPage />} />
          <Route path="catalog/products/new" element={<ProductFormPage />} />
          <Route path="catalog/products/:id/edit" element={<ProductFormPage />} />
          <Route path="catalog/departments" element={<DepartmentsPage />} />
          <Route path="inventory" element={<StockLevelsPage />} />
          <Route path="inventory/receive" element={<ReceiveStockPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="sales/:id" element={<SaleDetailPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
