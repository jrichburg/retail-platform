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

export const demoSuppliers = [
  { id: 'sup1', name: 'Brooks', code: 'BRK', isActive: true },
  { id: 'sup2', name: 'Nike', code: 'NKE', isActive: true },
  { id: 'sup3', name: 'ASICS', code: 'ASC', isActive: true },
  { id: 'sup4', name: 'New Balance', code: 'NB', isActive: true },
  { id: 'sup5', name: 'Hey Dude', code: 'HD', isActive: true },
  { id: 'sup6', name: 'Birkenstock', code: 'BRK2', isActive: true },
];

export const demoSizeGrids = [
  {
    id: 'sg1', name: "Men's US Running 7-14", dimension1Label: 'Size', dimension2Label: 'Width', isActive: true,
    values: [
      { id: 'sgv1', dimension: 1, value: '7', sortOrder: 1 },
      { id: 'sgv2', dimension: 1, value: '7.5', sortOrder: 2 },
      { id: 'sgv3', dimension: 1, value: '8', sortOrder: 3 },
      { id: 'sgv4', dimension: 1, value: '8.5', sortOrder: 4 },
      { id: 'sgv5', dimension: 1, value: '9', sortOrder: 5 },
      { id: 'sgv6', dimension: 1, value: '9.5', sortOrder: 6 },
      { id: 'sgv7', dimension: 1, value: '10', sortOrder: 7 },
      { id: 'sgv8', dimension: 1, value: '10.5', sortOrder: 8 },
      { id: 'sgv9', dimension: 1, value: '11', sortOrder: 9 },
      { id: 'sgv10', dimension: 1, value: '11.5', sortOrder: 10 },
      { id: 'sgv11', dimension: 1, value: '12', sortOrder: 11 },
      { id: 'sgv12', dimension: 1, value: '13', sortOrder: 12 },
      { id: 'sgv13', dimension: 1, value: '14', sortOrder: 13 },
      { id: 'sgv14', dimension: 2, value: 'D', sortOrder: 1 },
      { id: 'sgv15', dimension: 2, value: '2E', sortOrder: 2 },
      { id: 'sgv16', dimension: 2, value: '4E', sortOrder: 3 },
    ],
  },
  {
    id: 'sg2', name: "Women's US Running 5-12", dimension1Label: 'Size', dimension2Label: 'Width', isActive: true,
    values: [
      { id: 'sgv20', dimension: 1, value: '5', sortOrder: 1 },
      { id: 'sgv21', dimension: 1, value: '5.5', sortOrder: 2 },
      { id: 'sgv22', dimension: 1, value: '6', sortOrder: 3 },
      { id: 'sgv23', dimension: 1, value: '6.5', sortOrder: 4 },
      { id: 'sgv24', dimension: 1, value: '7', sortOrder: 5 },
      { id: 'sgv25', dimension: 1, value: '7.5', sortOrder: 6 },
      { id: 'sgv26', dimension: 1, value: '8', sortOrder: 7 },
      { id: 'sgv27', dimension: 1, value: '8.5', sortOrder: 8 },
      { id: 'sgv28', dimension: 1, value: '9', sortOrder: 9 },
      { id: 'sgv29', dimension: 1, value: '9.5', sortOrder: 10 },
      { id: 'sgv30', dimension: 1, value: '10', sortOrder: 11 },
      { id: 'sgv31', dimension: 1, value: '11', sortOrder: 12 },
      { id: 'sgv32', dimension: 1, value: '12', sortOrder: 13 },
      { id: 'sgv33', dimension: 2, value: 'B', sortOrder: 1 },
      { id: 'sgv34', dimension: 2, value: 'D', sortOrder: 2 },
    ],
  },
  {
    id: 'sg3', name: 'Apparel S-3XL', dimension1Label: 'Size', dimension2Label: null, isActive: true,
    values: [
      { id: 'sgv40', dimension: 1, value: 'S', sortOrder: 1 },
      { id: 'sgv41', dimension: 1, value: 'M', sortOrder: 2 },
      { id: 'sgv42', dimension: 1, value: 'L', sortOrder: 3 },
      { id: 'sgv43', dimension: 1, value: 'XL', sortOrder: 4 },
      { id: 'sgv44', dimension: 1, value: '2XL', sortOrder: 5 },
      { id: 'sgv45', dimension: 1, value: '3XL', sortOrder: 6 },
    ],
  },
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
    { id: 'p1', name: 'Brooks Ghost 16', sku: 'BRK-GH16-BLK', upc: null, categoryId: 'c1', categoryName: 'Running', departmentName: "Men's Footwear", supplierId: 'sup1', supplierName: 'Brooks', color: 'Black', mapDate: null, sizeGridId: 'sg1', sizeGridName: "Men's US Running 7-14", retailPrice: 139.99, costPrice: 70.00, description: null, isActive: true, variantCount: 3, variants: [
      { id: 'v1', dimension1Value: '10', dimension2Value: 'D', upc: '190340123456', isActive: true },
      { id: 'v2', dimension1Value: '10.5', dimension2Value: 'D', upc: '190340123457', isActive: true },
      { id: 'v3', dimension1Value: '11', dimension2Value: 'D', upc: '190340123458', isActive: true },
    ] },
    { id: 'p2', name: 'New Balance 990v6', sku: 'NB-990V6-GRY', upc: null, categoryId: 'c1', categoryName: 'Running', departmentName: "Men's Footwear", supplierId: 'sup4', supplierName: 'New Balance', color: 'Grey', mapDate: '2026-06-01', sizeGridId: 'sg1', sizeGridName: "Men's US Running 7-14", retailPrice: 199.99, costPrice: 100.00, description: null, isActive: true, variantCount: 2, variants: [
      { id: 'v4', dimension1Value: '10', dimension2Value: 'D', upc: '194768234567', isActive: true },
      { id: 'v5', dimension1Value: '10', dimension2Value: '2E', upc: '194768234568', isActive: true },
    ] },
    { id: 'p3', name: 'ASICS Gel-Kayano 30', sku: 'ASC-KAY30-BLK', upc: null, categoryId: 'c1', categoryName: 'Running', departmentName: "Men's Footwear", supplierId: 'sup3', supplierName: 'ASICS', color: 'Black', mapDate: null, sizeGridId: 'sg1', sizeGridName: "Men's US Running 7-14", retailPrice: 159.99, costPrice: 80.00, description: null, isActive: true, variantCount: 1, variants: [
      { id: 'v6', dimension1Value: '9', dimension2Value: 'D', upc: '168987654321', isActive: true },
    ] },
    { id: 'p4', name: 'Hey Dude Wally', sku: 'HD-WALLY-TAN', upc: null, categoryId: 'c2', categoryName: 'Casual', departmentName: "Men's Footwear", supplierId: 'sup5', supplierName: 'Hey Dude', color: 'Tan', mapDate: null, sizeGridId: null, sizeGridName: null, retailPrice: 59.99, costPrice: 30.00, description: null, isActive: true, variantCount: 0, variants: null },
    { id: 'p5', name: 'Birkenstock Arizona', sku: 'BRK-ARIZ-BRN', upc: null, categoryId: 'c2', categoryName: 'Casual', departmentName: "Men's Footwear", supplierId: 'sup6', supplierName: 'Birkenstock', color: 'Brown', mapDate: null, sizeGridId: null, sizeGridName: null, retailPrice: 109.99, costPrice: 55.00, description: null, isActive: true, variantCount: 0, variants: null },
    { id: 'p6', name: 'Brooks Glycerin 21 W', sku: 'BRK-GLY21W-PNK', upc: null, categoryId: 'c3', categoryName: 'Running', departmentName: "Women's Footwear", supplierId: 'sup1', supplierName: 'Brooks', color: 'Pink', mapDate: null, sizeGridId: 'sg2', sizeGridName: "Women's US Running 5-12", retailPrice: 159.99, costPrice: 80.00, description: null, isActive: true, variantCount: 2, variants: [
      { id: 'v7', dimension1Value: '8', dimension2Value: 'B', upc: '190340234567', isActive: true },
      { id: 'v8', dimension1Value: '8', dimension2Value: 'D', upc: '190340234568', isActive: true },
    ] },
    { id: 'p7', name: 'Nike Dri-FIT Tee', sku: 'NK-DRFT-BLK', upc: null, categoryId: 'c4', categoryName: 'Tops', departmentName: 'Apparel', supplierId: 'sup2', supplierName: 'Nike', color: 'Black', mapDate: null, sizeGridId: 'sg3', sizeGridName: 'Apparel S-3XL', retailPrice: 34.99, costPrice: 17.50, description: null, isActive: true, variantCount: 3, variants: [
      { id: 'v9', dimension1Value: 'S', dimension2Value: null, upc: '195230123456', isActive: true },
      { id: 'v10', dimension1Value: 'M', dimension2Value: null, upc: '195230123457', isActive: true },
      { id: 'v11', dimension1Value: 'L', dimension2Value: null, upc: '195230123458', isActive: true },
    ] },
    { id: 'p8', name: 'Nike Tempo Short', sku: 'NK-TMPO-BLK', upc: null, categoryId: 'c5', categoryName: 'Bottoms', departmentName: 'Apparel', supplierId: 'sup2', supplierName: 'Nike', color: 'Black', mapDate: null, sizeGridId: 'sg3', sizeGridName: 'Apparel S-3XL', retailPrice: 39.99, costPrice: 20.00, description: null, isActive: true, variantCount: 2, variants: [
      { id: 'v12', dimension1Value: 'M', dimension2Value: null, upc: '195230234567', isActive: true },
      { id: 'v13', dimension1Value: 'L', dimension2Value: null, upc: '195230234568', isActive: true },
    ] },
  ],
  totalCount: 8, page: 1, pageSize: 25, totalPages: 1,
};

export const demoStockLevels = {
  items: [
    { id: 's1', productId: 'p1', productName: 'Brooks Ghost 16', sku: 'BRK-GH16-BLK', quantityOnHand: 12, quantityReserved: 0, availableQuantity: 12, reorderPoint: 5 },
    { id: 's2', productId: 'p2', productName: 'New Balance 990v6', sku: 'NB-990V6-GRY', quantityOnHand: 8, quantityReserved: 0, availableQuantity: 8, reorderPoint: 3 },
    { id: 's3', productId: 'p3', productName: 'ASICS Gel-Kayano 30', sku: 'ASC-KAY30-BLK', quantityOnHand: 6, quantityReserved: 0, availableQuantity: 6, reorderPoint: 3 },
    { id: 's4', productId: 'p4', productName: 'Hey Dude Wally', sku: 'HD-WALLY-TAN', quantityOnHand: 20, quantityReserved: 0, availableQuantity: 20, reorderPoint: 8 },
    { id: 's5', productId: 'p5', productName: 'Birkenstock Arizona', sku: 'BRK-ARIZ-BRN', quantityOnHand: 4, quantityReserved: 0, availableQuantity: 4, reorderPoint: 3 },
    { id: 's6', productId: 'p6', productName: 'Brooks Glycerin 21 W', sku: 'BRK-GLY21W-PNK', quantityOnHand: 10, quantityReserved: 0, availableQuantity: 10, reorderPoint: 4 },
  ],
  totalCount: 6, page: 1, pageSize: 25, totalPages: 1,
};

export const demoSales = {
  items: [
    {
      id: 'sale1', transactionNumber: 'MAIN-20260327-0001', transactionDate: '2026-03-27T14:30:00Z', status: 'completed',
      subtotal: 199.98, taxRate: 0.08, taxAmount: 16.00, totalAmount: 215.98, tenderedAmount: 220.00, changeAmount: 4.02,
      lineItems: [
        { productId: 'p1', productVariantId: 'v1', variantDescription: 'Size 10 / Width D', sku: 'BRK-GH16-BLK', productName: 'Brooks Ghost 16', quantity: 1, unitPrice: 139.99, lineTotal: 139.99, discountAmount: 0 },
        { productId: 'p4', productVariantId: null, variantDescription: null, sku: 'HD-WALLY-TAN', productName: 'Hey Dude Wally', quantity: 1, unitPrice: 59.99, lineTotal: 59.99, discountAmount: 0 },
      ],
      tenders: [{ tenderType: 'cash', amount: 220.00, paymentReference: null }],
    },
    {
      id: 'sale2', transactionNumber: 'MAIN-20260327-0002', transactionDate: '2026-03-27T15:45:00Z', status: 'completed',
      subtotal: 159.99, taxRate: 0.08, taxAmount: 12.80, totalAmount: 172.79, tenderedAmount: 172.79, changeAmount: 0,
      lineItems: [
        { productId: 'p6', productVariantId: 'v7', variantDescription: 'Size 8 / Width B', sku: 'BRK-GLY21W-PNK', productName: 'Brooks Glycerin 21 W', quantity: 1, unitPrice: 159.99, lineTotal: 159.99, discountAmount: 0 },
      ],
      tenders: [{ tenderType: 'card', amount: 172.79, paymentReference: 'SIM482910' }],
    },
    {
      id: 'sale3', transactionNumber: 'MAIN-20260326-0003', transactionDate: '2026-03-26T11:20:00Z', status: 'completed',
      subtotal: 74.98, taxRate: 0.08, taxAmount: 6.00, totalAmount: 80.98, tenderedAmount: 100.00, changeAmount: 19.02,
      lineItems: [
        { productId: 'p7', productVariantId: 'v10', variantDescription: 'Size M', sku: 'NK-DRFT-BLK', productName: 'Nike Dri-FIT Tee', quantity: 1, unitPrice: 34.99, lineTotal: 34.99, discountAmount: 0 },
        { productId: 'p8', productVariantId: 'v12', variantDescription: 'Size M', sku: 'NK-TMPO-BLK', productName: 'Nike Tempo Short', quantity: 1, unitPrice: 39.99, lineTotal: 39.99, discountAmount: 0 },
      ],
      tenders: [{ tenderType: 'cash', amount: 100.00, paymentReference: null }],
    },
  ],
  totalCount: 3, page: 1, pageSize: 25, totalPages: 1,
};
