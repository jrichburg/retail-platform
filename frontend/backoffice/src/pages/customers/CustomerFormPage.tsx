import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCustomerSchema, type CreateCustomerRequest } from '@retail-platform/shared-types';
import { useCustomer, useCreateCustomer, useUpdateCustomer } from '@/hooks/use-customers';
import { ArrowLeft } from 'lucide-react';

export function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: customer } = useCustomer(id || '');
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateCustomerRequest>({
    resolver: zodResolver(CreateCustomerSchema),
  });

  useEffect(() => { if (customer) reset(customer); }, [customer, reset]);

  const onSubmit = async (data: CreateCustomerRequest) => {
    if (isEdit) {
      await updateCustomer.mutateAsync({ id: id!, ...data, isActive: true });
    } else {
      await createCustomer.mutateAsync(data);
    }
    navigate('/customers');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button onClick={() => navigate('/customers')} className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to customers
        </button>
        <h1 className="page-title">{isEdit ? 'Edit customer' : 'New customer'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h3 className="section-label">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">First Name</label>
              <input {...register('firstName')} className="input-field" placeholder="Sarah" />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Last Name</label>
              <input {...register('lastName')} className="input-field" placeholder="Johnson" />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" {...register('email')} className="input-field" placeholder="sarah@email.com" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
              <input {...register('phone')} className="input-field" placeholder="555-0101" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="section-label">Address</h3>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Street</label>
            <input {...register('street')} className="input-field" placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">City</label>
              <input {...register('city')} className="input-field" placeholder="Springfield" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">State</label>
              <input {...register('state')} className="input-field" placeholder="IL" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Zip</label>
              <input {...register('zip')} className="input-field" placeholder="62701" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="section-label">Notes</h3>
          <textarea {...register('notes')} rows={3} className="input-field resize-none" placeholder="Customer preferences, notes..." />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate('/customers')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update customer' : 'Create customer'}
          </button>
        </div>
      </form>
    </div>
  );
}
