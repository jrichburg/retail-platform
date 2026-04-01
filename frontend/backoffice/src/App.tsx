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
import { PosLayout } from '@/pages/pos/PosLayout';
import { PosTransactionPage } from '@/pages/pos/PosTransactionPage';
import { PosTenderPage } from '@/pages/pos/PosTenderPage';
import { PosReceiptPage } from '@/pages/pos/PosReceiptPage';
import { CustomersPage } from '@/pages/customers/CustomersPage';
import { CustomerFormPage } from '@/pages/customers/CustomerFormPage';
import { CustomerDetailPage } from '@/pages/customers/CustomerDetailPage';
import { WorkOrdersPage } from '@/pages/work-orders/WorkOrdersPage';
import { WorkOrderFormPage } from '@/pages/work-orders/WorkOrderFormPage';
import { WorkOrderDetailPage } from '@/pages/work-orders/WorkOrderDetailPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { UsersPage } from '@/pages/settings/UsersPage';
import { ArDashboardPage } from '@/pages/accounts-receivable/ArDashboardPage';
import { InvoicesPage } from '@/pages/accounts-receivable/InvoicesPage';
import { InvoiceFormPage } from '@/pages/accounts-receivable/InvoiceFormPage';
import { InvoiceDetailPage } from '@/pages/accounts-receivable/InvoiceDetailPage';
import { TransfersPage } from '@/pages/inventory/TransfersPage';
import { TransferFormPage } from '@/pages/inventory/TransferFormPage';
import { TransferDetailPage } from '@/pages/inventory/TransferDetailPage';
import { TenantsPage } from '@/pages/platform/TenantsPage';
import { CreateTenantPage } from '@/pages/platform/CreateTenantPage';
import { TenantDetailPage } from '@/pages/platform/TenantDetailPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pos" element={<PosLayout />}>
          <Route index element={<PosTransactionPage />} />
          <Route path="tender" element={<PosTenderPage />} />
          <Route path="receipt" element={<PosReceiptPage />} />
        </Route>
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
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/new" element={<CustomerFormPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="customers/:id/edit" element={<CustomerFormPage />} />
          <Route path="work-orders" element={<WorkOrdersPage />} />
          <Route path="work-orders/new" element={<WorkOrderFormPage />} />
          <Route path="work-orders/:id" element={<WorkOrderDetailPage />} />
          <Route path="work-orders/:id/edit" element={<WorkOrderFormPage />} />
          <Route path="ar" element={<ArDashboardPage />} />
          <Route path="ar/invoices" element={<InvoicesPage />} />
          <Route path="ar/invoices/new" element={<InvoiceFormPage />} />
          <Route path="ar/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="inventory/transfers" element={<TransfersPage />} />
          <Route path="inventory/transfers/new" element={<TransferFormPage />} />
          <Route path="inventory/transfers/:id" element={<TransferDetailPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="sales/:id" element={<SaleDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/users" element={<UsersPage />} />
          <Route path="platform/tenants" element={<TenantsPage />} />
          <Route path="platform/tenants/new" element={<CreateTenantPage />} />
          <Route path="platform/tenants/:id" element={<TenantDetailPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
