import { useState } from 'react';
import { useDepartments, useCreateDepartment, useCreateCategory } from '@/hooks/use-departments';
import { FolderTree, Plus, ChevronRight } from 'lucide-react';

export function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const createDept = useCreateDepartment();
  const createCat = useCreateCategory();
  const [newDept, setNewDept] = useState('');
  const [addingCatFor, setAddingCatFor] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');

  const handleAddDept = async () => {
    if (!newDept.trim()) return;
    await createDept.mutateAsync({ name: newDept, sortOrder: (departments?.length ?? 0) + 1 });
    setNewDept('');
  };

  const handleAddCat = async (deptId: string) => {
    if (!newCatName.trim()) return;
    await createCat.mutateAsync({ departmentId: deptId, name: newCatName, sortOrder: 0 });
    setNewCatName('');
    setAddingCatFor(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Departments</h1>
        <p className="mt-1 text-sm text-slate-500">Organize your catalog into departments and categories</p>
      </div>

      {/* Add department */}
      <div className="flex items-center gap-3">
        <input
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddDept()}
          placeholder="New department name..."
          className="input-field max-w-xs"
        />
        <button onClick={handleAddDept} disabled={!newDept.trim()} className="btn-primary">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {departments?.map((dept) => (
            <div key={dept.id} className="card overflow-hidden">
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <FolderTree className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{dept.name}</h3>
                <span className="badge-neutral ml-auto">{dept.categories.length} categories</span>
              </div>
              <div className="divide-y divide-slate-50">
                {dept.categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-3 px-5 py-3 pl-16">
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                    <span className="text-sm text-slate-700">{cat.name}</span>
                  </div>
                ))}
                {addingCatFor === dept.id ? (
                  <div className="flex items-center gap-2 px-5 py-3 pl-16">
                    <input
                      autoFocus
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddCat(dept.id); if (e.key === 'Escape') setAddingCatFor(null); }}
                      placeholder="Category name..."
                      className="input-field max-w-xs !py-1.5 text-sm"
                    />
                    <button onClick={() => handleAddCat(dept.id)} className="btn-primary !py-1.5 text-xs">Add</button>
                    <button onClick={() => setAddingCatFor(null)} className="btn-ghost !py-1.5 text-xs">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => { setAddingCatFor(dept.id); setNewCatName(''); }} className="flex w-full items-center gap-2 px-5 py-2.5 pl-16 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-amber-600">
                    <Plus className="h-3.5 w-3.5" /> Add category
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
