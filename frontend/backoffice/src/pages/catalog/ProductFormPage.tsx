import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProductSchema, type CreateProductRequest } from '@retail-platform/shared-types';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/use-products';
import { useDepartments } from '@/hooks/use-departments';

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: product } = useProduct(id || '');
  const { data: departments } = useDepartments();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateProductRequest>({
    resolver: zodResolver(CreateProductSchema),
  });

  useEffect(() => {
    if (product) reset(product);
  }, [product, reset]);

  const onSubmit = async (data: CreateProductRequest) => {
    if (isEdit) {
      await updateProduct.mutateAsync({ id: id!, ...data, isActive: true });
    } else {
      await createProduct.mutateAsync(data);
    }
    navigate('/catalog/products');
  };

  const allCategories = departments?.flatMap(d => d.categories.map(c => ({ ...c, departmentName: d.name }))) || [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">{isEdit ? 'Edit Product' : 'New Product'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input {...register('name')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input {...register('sku')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">UPC</label>
            <input {...register('upc')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select {...register('categoryId')} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="">Select...</option>
              {allCategories.map(c => <option key={c.id} value={c.id}>{c.departmentName} &gt; {c.name}</option>)}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Retail Price</label>
            <input type="number" step="0.01" {...register('retailPrice', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            {errors.retailPrice && <p className="mt-1 text-xs text-red-600">{errors.retailPrice.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Price</label>
            <input type="number" step="0.01" {...register('costPrice', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea {...register('description')} rows={3} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => navigate('/catalog/products')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
