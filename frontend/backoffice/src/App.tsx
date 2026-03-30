import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProductsPage } from '@/pages/catalog/ProductsPage';
import { ProductFormPage } from '@/pages/catalog/ProductFormPage';
import { DepartmentsPage } from '@/pages/catalog/DepartmentsPage';
import { SuppliersPage } from '@/pages/catalog/SuppliersPage';
import { SizeGridsPage } from '@/pages/catalog/SizeGridsPage';
import { SizeGridFormPage } from '@/pages/catalog/SizeGridFormPage';
import { StockLevelsPage } from '@/pages/inventory/StockLevelsPage';
import { ReceiveDocumentPage } from '@/pages/inventory/ReceiveDocumentPage';
import { ReceiveDocumentsListPage } from '@/pages/inventory/ReceiveDocumentsListPage';
import { ReceiveDocumentDetailPage } from '@/pages/inventory/ReceiveDocumentDetailPage';
import { PurchaseOrdersPage } from '@/pages/inventory/PurchaseOrdersPage';
import { PurchaseOrderFormPage } from '@/pages/inventory/PurchaseOrderFormPage';
import { PurchaseOrderDetailPage } from '@/pages/inventory/PurchaseOrderDetailPage';
import { ReceiveAgainstPOPage } from '@/pages/inventory/ReceiveAgainstPOPage';
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
          <Route path="catalog/suppliers" element={<SuppliersPage />} />
          <Route path="catalog/size-grids" element={<SizeGridsPage />} />
          <Route path="catalog/size-grids/new" element={<SizeGridFormPage />} />
          <Route path="catalog/size-grids/:id/edit" element={<SizeGridFormPage />} />
          <Route path="inventory" element={<StockLevelsPage />} />
          <Route path="inventory/receive" element={<ReceiveDocumentPage />} />
          <Route path="inventory/receiving" element={<ReceiveDocumentsListPage />} />
          <Route path="inventory/receiving/:id" element={<ReceiveDocumentDetailPage />} />
          <Route path="inventory/purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="inventory/purchase-orders/new" element={<PurchaseOrderFormPage />} />
          <Route path="inventory/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />
          <Route path="inventory/purchase-orders/:id/edit" element={<PurchaseOrderFormPage />} />
          <Route path="inventory/purchase-orders/:id/receive" element={<ReceiveAgainstPOPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="sales/:id" element={<SaleDetailPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
