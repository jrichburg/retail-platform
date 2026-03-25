import api from './api';
import { getDatabase } from './database';

export async function syncCatalog() {
  try {
    const db = await getDatabase();
    const { data } = await api.get('/catalog/products', { params: { pageSize: 1000, isActive: true } });

    await db.execAsync('DELETE FROM products');

    for (const product of data.items) {
      await db.runAsync(
        'INSERT INTO products (id, sku, upc, name, retail_price, category_name, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [product.id, product.sku, product.upc, product.name, product.retailPrice, product.categoryName, new Date().toISOString()]
      );
    }

    console.log(`Synced ${data.items.length} products to local database`);
  } catch (error) {
    console.error('Catalog sync failed:', error);
  }
}

export async function syncPendingTransactions() {
  try {
    const db = await getDatabase();
    const pending = await db.getAllAsync<{ id: string; payload: string }>(
      'SELECT id, payload FROM transaction_queue WHERE status = ?',
      ['pending']
    );

    for (const tx of pending) {
      try {
        const payload = JSON.parse(tx.payload);
        await api.post('/sales', payload);
        await db.runAsync(
          'UPDATE transaction_queue SET status = ?, synced_at = ? WHERE id = ?',
          ['synced', new Date().toISOString(), tx.id]
        );
      } catch (error) {
        console.error(`Failed to sync transaction ${tx.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Transaction sync failed:', error);
  }
}
