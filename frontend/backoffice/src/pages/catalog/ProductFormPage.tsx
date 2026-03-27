import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProductSchema, type CreateProductRequest } from '@retail-platform/shared-types';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/use-products';
import { useDepartments } from '@/hooks/use-departments';
import { ArrowLeft } from 'lucide-react';

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
      <div>
        <button onClick={() => navigate('/catalog/products')} className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </button>
        <h1 className="page-title">{isEdit ? 'Edit product' : 'New product'}</h1>
        <p className="mt-1 text-sm text-slate-500">{isEdit ? 'Update product details' : 'Add a new product to your catalog'}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h3 className="section-label">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
              <input {...register('name')} className="input-field" placeholder="Brooks Ghost 16" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">SKU</label>
              <input {...register('sku')} className="input-field font-mono" placeholder="BRK-GH16-BLK-10" />
              {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">UPC / Barcode</label>
              <input {...register('upc')} className="input-field font-mono" placeholder="190340123456" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
              <select {...register('categoryId')} className="input-field">
                <option value="">Select category...</option>
                {allCategories.map(c => <option key={c.id} value={c.id}>{c.departmentName} / {c.name}</option>)}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>}
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="section-label">Pricing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Retail Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                <input type="number" step="0.01" {...register('retailPrice', { valueAsNumber: true })} className="input-field !pl-7 tabular-nums" placeholder="0.00" />
              </div>
              {errors.retailPrice && <p className="mt-1 text-xs text-red-600">{errors.retailPrice.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Cost Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                <input type="number" step="0.01" {...register('costPrice', { valueAsNumber: true })} className="input-field !pl-7 tabular-nums" placeholder="0.00" />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="section-label">Details</h3>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <textarea {...register('description')} rows={3} className="input-field resize-none" placeholder="Optional product description..." />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate('/catalog/products')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update product' : 'Create product'}
          </button>
        </div>
      </form>
    </div>
  );
}
