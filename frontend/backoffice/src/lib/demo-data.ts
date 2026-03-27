// Demo data for UI review when no API is available

export const demoUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo@retailplatform.com',
  firstName: 'Demo',
  lastName: 'User',
  tenantNodeId: '00000000-0000-0000-0000-000000000010',
  rootTenantId: '00000000-0000-0000-0000-000000000010',
  roles: ['owner'],
  permissions: ['catalog:read', 'catalog:write', 'inventory:read', 'inventory:write', 'sales:read', 'sales:create'],
};

export const demoTenantNodes = [
  { id: '00000000-0000-0000-0000-000000000010', rootTenantId: '00000000-0000-0000-0000-000000000010', parentId: null, nodeType: 'root', name: 'Demo Retailer', code: 'DEMO', path: 'demo', depth: 0, isActive: true },
  { id: '00000000-0000-0000-0000-000000000011', rootTenantId: '00000000-0000-0000-0000-000000000010', parentId: '00000000-0000-0000-0000-000000000010', nodeType: 'store', name: 'Main Street Store', code: 'MAIN', path: 'demo.main', depth: 1, isActive: true },
  { id: '00000000-0000-0000-0000-000000000012', rootTenantId: '00000000-0000-0000-0000-000000000010', parentId: '00000000-0000-0000-0000-000000000010', nodeType: 'store', name: 'Mall Location', code: 'MALL', path: 'demo.mall', depth: 1, isActive: true },
];

export const demoDepartments = [
  {
    id: 'd1', name: "Men's Footwear", sortOrder: 1, isActive: true,
    categories: [
      { id: 'c1', name: 'Running', sortOrder: 1, isActive: true },
      { id: 'c2', name: 'Casual', sortOrder: 2, isActive: true },
    ],
  },
  {
    id: 'd2', name: "Women's Footwear", sortOrder: 2, isActive: true,
    categories: [
      { id: 'c3', name: 'Running', sortOrder: 1, isActive: true },
    ],
  },
  {
    id: 'd3', name: 'Apparel', sortOrder: 3, isActive: true,
    categories: [
      { id: 'c4', name: 'Tops', sortOrder: 1, isActive: true },
      { id: 'c5', name: 'Bottoms', sortOrder: 2, isActive: true },
    ],
  },
];

export const demoProducts = {
  items: [
    { id: 'p1', name: 'Brooks Ghost 16', sku: 'BRK-GH16-BLK-10', upc: '190340123456', categoryId: 'c1', categoryName: 'Running', departmentName: "Men's Footwear", retailPrice: 139.99, costPrice: 70.00, description: null, isActive: true },
    { id: 'p2', name: 'New Balance 990v6', sku: 'NB-990V6-GRY-10', upc: '194768234567', categoryId: 'c1', categoryName: 'Running', departmentName: "Men's Footwear", retailPrice: 199.99, costPrice: 100.00, description: null, isActive: true },
    { id: 'p3', name: 'ASICS Gel-Kayano 30', sku: 'ASC-KAY30-BLK-9', upc: '168987654321', categoryId: 'c1', categoryName: 'Running', departmentName: "Men's Footwear", retailPrice: 159.99, costPrice: 80.00, description: null, isActive: true },
    { id: 'p4', name: 'Hey Dude Wally', sku: 'HD-WALLY-TAN-10', upc: '845678901234', categoryId: 'c2', categoryName: 'Casual', departmentName: "Men's Footwear", retailPrice: 59.99, costPrice: 30.00, description: null, isActive: true },
    { id: 'p5', name: 'Birkenstock Arizona', sku: 'BRK-ARIZ-BRN-42', upc: '886543210987', categoryId: 'c2', categoryName: 'Casual', departmentName: "Men's Footwear", retailPrice: 109.99, costPrice: 55.00, description: null, isActive: true },
    { id: 'p6', name: 'Brooks Glycerin 21 W', sku: 'BRK-GLY21W-PNK-8', upc: '190340234567', categoryId: 'c3', categoryName: 'Running', departmentName: "Women's Footwear", retailPrice: 159.99, costPrice: 80.00, description: null, isActive: true },
    { id: 'p7', name: 'Nike Dri-FIT Tee', sku: 'NK-DRFT-BLK-M', upc: '195230123456', categoryId: 'c4', categoryName: 'Tops', departmentName: 'Apparel', retailPrice: 34.99, costPrice: 17.50, description: null, isActive: true },
    { id: 'p8', name: 'Nike Tempo Short', sku: 'NK-TMPO-BLK-M', upc: '195230234567', categoryId: 'c5', categoryName: 'Bottoms', departmentName: 'Apparel', retailPrice: 39.99, costPrice: 20.00, description: null, isActive: true },
  ],
  totalCount: 8, page: 1, pageSize: 25, totalPages: 1,
};

export const demoStockLevels = {
  items: [
    { id: 's1', productId: 'p1', productName: 'Brooks Ghost 16', sku: 'BRK-GH16-BLK-10', quantityOnHand: 12, quantityReserved: 0, availableQuantity: 12, reorderPoint: 5 },
    { id: 's2', productId: 'p2', productName: 'New Balance 990v6', sku: 'NB-990V6-GRY-10', quantityOnHand: 8, quantityReserved: 0, availableQuantity: 8, reorderPoint: 3 },
    { id: 's3', productId: 'p3', productName: 'ASICS Gel-Kayano 30', sku: 'ASC-KAY30-BLK-9', quantityOnHand: 6, quantityReserved: 0, availableQuantity: 6, reorderPoint: 3 },
    { id: 's4', productId: 'p4', productName: 'Hey Dude Wally', sku: 'HD-WALLY-TAN-10', quantityOnHand: 20, quantityReserved: 0, availableQuantity: 20, reorderPoint: 8 },
    { id: 's5', productId: 'p5', productName: 'Birkenstock Arizona', sku: 'BRK-ARIZ-BRN-42', quantityOnHand: 4, quantityReserved: 0, availableQuantity: 4, reorderPoint: 3 },
    { id: 's6', productId: 'p6', productName: 'Brooks Glycerin 21 W', sku: 'BRK-GLY21W-PNK-8', quantityOnHand: 10, quantityReserved: 0, availableQuantity: 10, reorderPoint: 4 },
  ],
  totalCount: 6, page: 1, pageSize: 25, totalPages: 1,
};

export const demoSales = {
  items: [
    {
      id: 'sale1', transactionNumber: 'MAIN-20260327-0001', transactionDate: '2026-03-27T14:30:00Z', status: 'completed',
      subtotal: 199.98, taxRate: 0.08, taxAmount: 16.00, totalAmount: 215.98, tenderedAmount: 220.00, changeAmount: 4.02,
      lineItems: [
        { productId: 'p1', sku: 'BRK-GH16-BLK-10', productName: 'Brooks Ghost 16', quantity: 1, unitPrice: 139.99, lineTotal: 139.99, discountAmount: 0 },
        { productId: 'p4', sku: 'HD-WALLY-TAN-10', productName: 'Hey Dude Wally', quantity: 1, unitPrice: 59.99, lineTotal: 59.99, discountAmount: 0 },
      ],
      tenders: [{ tenderType: 'cash', amount: 220.00, paymentReference: null }],
    },
    {
      id: 'sale2', transactionNumber: 'MAIN-20260327-0002', transactionDate: '2026-03-27T15:45:00Z', status: 'completed',
      subtotal: 159.99, taxRate: 0.08, taxAmount: 12.80, totalAmount: 172.79, tenderedAmount: 172.79, changeAmount: 0,
      lineItems: [
        { productId: 'p6', sku: 'BRK-GLY21W-PNK-8', productName: 'Brooks Glycerin 21 W', quantity: 1, unitPrice: 159.99, lineTotal: 159.99, discountAmount: 0 },
      ],
      tenders: [{ tenderType: 'card', amount: 172.79, paymentReference: 'SIM482910' }],
    },
    {
      id: 'sale3', transactionNumber: 'MAIN-20260326-0003', transactionDate: '2026-03-26T11:20:00Z', status: 'completed',
      subtotal: 74.98, taxRate: 0.08, taxAmount: 6.00, totalAmount: 80.98, tenderedAmount: 100.00, changeAmount: 19.02,
      lineItems: [
        { productId: 'p7', sku: 'NK-DRFT-BLK-M', productName: 'Nike Dri-FIT Tee', quantity: 1, unitPrice: 34.99, lineTotal: 34.99, discountAmount: 0 },
        { productId: 'p8', sku: 'NK-TMPO-BLK-M', productName: 'Nike Tempo Short', quantity: 1, unitPrice: 39.99, lineTotal: 39.99, discountAmount: 0 },
      ],
      tenders: [{ tenderType: 'cash', amount: 100.00, paymentReference: null }],
    },
  ],
  totalCount: 3, page: 1, pageSize: 25, totalPages: 1,
};
