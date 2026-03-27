import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProductSchema, type CreateProductRequest } from '@retail-platform/shared-types';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/use-products';
import { useDepartments } from '@/hooks/use-departments';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useSizeGrids } from '@/hooks/use-size-grids';
import { ArrowLeft, Grid3X3 } from 'lucide-react';

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: product } = useProduct(id || '');
  const { data: departments } = useDepartments();
  const { data: suppliers } = useSuppliers();
  const { data: sizeGrids } = useSizeGrids();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<CreateProductRequest>({
    resolver: zodResolver(CreateProductSchema),
  });

  const selectedGridId = watch('sizeGridId');
  const selectedGrid = useMemo(() => sizeGrids?.find(g => g.id === selectedGridId), [sizeGrids, selectedGridId]);

  const dim1Values = useMemo(() => selectedGrid?.values.filter(v => v.dimension === 1).sort((a, b) => a.sortOrder - b.sortOrder) || [], [selectedGrid]);
  const dim2Values = useMemo(() => selectedGrid?.values.filter(v => v.dimension === 2).sort((a, b) => a.sortOrder - b.sortOrder) || [], [selectedGrid]);

  // Variant UPCs state
  const [variantUpcs, setVariantUpcs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        categoryId: product.categoryId,
        supplierId: product.supplierId,
        color: product.color,
        mapDate: product.mapDate,
        sizeGridId: product.sizeGridId,
        retailPrice: product.retailPrice,
        costPrice: product.costPrice,
        description: product.description,
      });
      // Load existing variant UPCs
      if (product.variants) {
        const upcs: Record<string, string> = {};
        for (const v of product.variants) {
          const key = `${v.dimension1Value || ''}|${v.dimension2Value || ''}`;
          upcs[key] = v.upc || '';
        }
        setVariantUpcs(upcs);
      }
    }
  }, [product, reset]);

  const onSubmit = async (data: CreateProductRequest) => {
    // Build variants from UPC matrix
    let variants: { dimension1Value?: string | null; dimension2Value?: string | null; upc?: string | null }[] | undefined;
    if (selectedGrid) {
      variants = [];
      if (dim2Values.length > 0) {
        for (const d1 of dim1Values) {
          for (const d2 of dim2Values) {
            const key = `${d1.value}|${d2.value}`;
            const upc = variantUpcs[key];
            if (upc) variants.push({ dimension1Value: d1.value, dimension2Value: d2.value, upc });
          }
        }
      } else {
        for (const d1 of dim1Values) {
          const key = `${d1.value}|`;
          const upc = variantUpcs[key];
          if (upc) variants.push({ dimension1Value: d1.value, dimension2Value: null, upc });
        }
      }
    }

    const payload = { ...data, variants };

    if (isEdit) {
      await updateProduct.mutateAsync({ id: id!, ...payload, isActive: true });
    } else {
      await createProduct.mutateAsync(payload);
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
        {/* Basic Information */}
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
              <input {...register('sku')} className="input-field font-mono" placeholder="BRK-GH16-BLK" />
              {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
              <select {...register('categoryId')} className="input-field">
                <option value="">Select category...</option>
                {allCategories.map(c => <option key={c.id} value={c.id}>{c.departmentName} / {c.name}</option>)}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Supplier</label>
              <select {...register('supplierId')} className="input-field">
                <option value="">Select supplier...</option>
                {suppliers?.map(s => <option key={s.id} value={s.id}>{s.name}{s.code ? ` (${s.code})` : ''}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Color</label>
            <input {...register('color')} className="input-field max-w-xs" placeholder="Black" />
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6 space-y-5">
          <h3 className="section-label">Pricing</h3>
          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">MAP Expiry Date</label>
              <input type="date" {...register('mapDate')} className="input-field" />
            </div>
          </div>
        </div>

        {/* Size Grid & Variants */}
        <div className="card p-6 space-y-5">
          <h3 className="section-label">Size Grid & Variants</h3>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Size Grid Template</label>
            <select {...register('sizeGridId')} className="input-field max-w-sm">
              <option value="">No size grid (single product)</option>
              {sizeGrids?.map(g => (
                <option key={g.id} value={g.id}>{g.name} — {g.dimension1Label}{g.dimension2Label ? ` × ${g.dimension2Label}` : ''}</option>
              ))}
            </select>
          </div>

          {selectedGrid && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Grid3X3 className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-slate-700">Enter UPCs for each {selectedGrid.dimension1Label.toLowerCase()}{selectedGrid.dimension2Label ? ` / ${selectedGrid.dimension2Label.toLowerCase()}` : ''} combination</span>
              </div>

              {dim2Values.length > 0 ? (
                /* 2D Matrix: Size × Width */
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-slate-500">{selectedGrid.dimension1Label}</th>
                        {dim2Values.map(d2 => (
                          <th key={d2.id} className="px-3 py-2 text-center text-xs font-semibold uppercase text-blue-600">{d2.value}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dim1Values.map(d1 => (
                        <tr key={d1.id}>
                          <td className="px-3 py-2 font-mono text-xs font-semibold text-slate-700">{d1.value}</td>
                          {dim2Values.map(d2 => {
                            const key = `${d1.value}|${d2.value}`;
                            return (
                              <td key={d2.id} className="px-2 py-1.5">
                                <input
                                  value={variantUpcs[key] || ''}
                                  onChange={(e) => setVariantUpcs({ ...variantUpcs, [key]: e.target.value })}
                                  placeholder="UPC"
                                  className="w-full rounded border border-slate-200 px-2 py-1 text-xs font-mono focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* 1D List: Size only */
                <div className="space-y-2">
                  {dim1Values.map(d1 => {
                    const key = `${d1.value}|`;
                    return (
                      <div key={d1.id} className="flex items-center gap-3">
                        <span className="w-16 text-right font-mono text-sm font-semibold text-slate-700">{d1.value}</span>
                        <input
                          value={variantUpcs[key] || ''}
                          onChange={(e) => setVariantUpcs({ ...variantUpcs, [key]: e.target.value })}
                          placeholder="Enter UPC..."
                          className="input-field max-w-xs font-mono text-sm"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
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
