import { useState } from 'react';
import { useDepartments, useCreateDepartment, useCreateCategory } from '@/hooks/use-departments';

export function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const createDept = useCreateDepartment();
  const createCat = useCreateCategory();
  const [newDept, setNewDept] = useState('');
  const [newCat, setNewCat] = useState<{ deptId: string; name: string }>({ deptId: '', name: '' });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Departments & Categories</h2>

      <div className="flex items-center gap-2">
        <input value={newDept} onChange={(e) => setNewDept(e.target.value)} placeholder="New department name" className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
        <button onClick={async () => { if (newDept) { await createDept.mutateAsync({ name: newDept, sortOrder: 0 }); setNewDept(''); }}} className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800">Add Department</button>
      </div>

      {isLoading ? <p className="text-sm text-gray-500">Loading...</p> : (
        <div className="space-y-4">
          {departments?.map((dept) => (
            <div key={dept.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="font-medium text-gray-900">{dept.name}</h3>
              <div className="mt-2 ml-4 space-y-1">
                {dept.categories.map((cat) => (
                  <p key={cat.id} className="text-sm text-gray-600">{cat.name}</p>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <input placeholder="New category" className="rounded-md border border-gray-300 px-2 py-1 text-sm" value={newCat.deptId === dept.id ? newCat.name : ''} onChange={(e) => setNewCat({ deptId: dept.id, name: e.target.value })} />
                  <button onClick={async () => { if (newCat.name && newCat.deptId === dept.id) { await createCat.mutateAsync({ departmentId: dept.id, name: newCat.name, sortOrder: 0 }); setNewCat({ deptId: '', name: '' }); }}} className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200">Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
