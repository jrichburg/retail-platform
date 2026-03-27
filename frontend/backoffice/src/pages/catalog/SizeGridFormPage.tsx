import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSizeGrid, useCreateSizeGrid } from '@/hooks/use-size-grids';
import { ArrowLeft, Plus, X } from 'lucide-react';

export function SizeGridFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: existingGrid } = useSizeGrid(id || '');
  const createGrid = useCreateSizeGrid();

  const [name, setName] = useState('');
  const [dim1Label, setDim1Label] = useState('Size');
  const [dim2Label, setDim2Label] = useState('');
  const [hasDim2, setHasDim2] = useState(false);
  const [dim1Values, setDim1Values] = useState<string[]>([]);
  const [dim2Values, setDim2Values] = useState<string[]>([]);
  const [newDim1, setNewDim1] = useState('');
  const [newDim2, setNewDim2] = useState('');

  useEffect(() => {
    if (existingGrid) {
      setName(existingGrid.name);
      setDim1Label(existingGrid.dimension1Label);
      setDim2Label(existingGrid.dimension2Label || '');
      setHasDim2(!!existingGrid.dimension2Label);
      setDim1Values(existingGrid.values.filter(v => v.dimension === 1).sort((a, b) => a.sortOrder - b.sortOrder).map(v => v.value));
      setDim2Values(existingGrid.values.filter(v => v.dimension === 2).sort((a, b) => a.sortOrder - b.sortOrder).map(v => v.value));
    }
  }, [existingGrid]);

  const addDim1 = () => { if (newDim1.trim() && !dim1Values.includes(newDim1.trim())) { setDim1Values([...dim1Values, newDim1.trim()]); setNewDim1(''); } };
  const addDim2 = () => { if (newDim2.trim() && !dim2Values.includes(newDim2.trim())) { setDim2Values([...dim2Values, newDim2.trim()]); setNewDim2(''); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = [
      ...dim1Values.map((v, i) => ({ dimension: 1, value: v, sortOrder: i + 1 })),
      ...(hasDim2 ? dim2Values.map((v, i) => ({ dimension: 2, value: v, sortOrder: i + 1 })) : []),
    ];
    await createGrid.mutateAsync({ name, dimension1Label: dim1Label, dimension2Label: hasDim2 ? dim2Label : null, values });
    navigate('/catalog/size-grids');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button onClick={() => navigate('/catalog/size-grids')} className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to size grids
        </button>
        <h1 className="page-title">{isEdit ? 'Edit size grid' : 'New size grid'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h3 className="section-label">Grid Settings</h3>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Men's US Running 7-14" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Dimension 1 Label</label>
              <input value={dim1Label} onChange={(e) => setDim1Label(e.target.value)} className="input-field" placeholder="Size" required />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={hasDim2} onChange={(e) => setHasDim2(e.target.checked)} className="rounded border-slate-300" />
                Dimension 2 (e.g. Width)
              </label>
              {hasDim2 && <input value={dim2Label} onChange={(e) => setDim2Label(e.target.value)} className="input-field mt-1.5" placeholder="Width" />}
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="section-label">{dim1Label} Values</h3>
          <div className="flex flex-wrap gap-2">
            {dim1Values.map((v, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-mono">
                {v}
                <button type="button" onClick={() => setDim1Values(dim1Values.filter((_, j) => j !== i))} className="ml-1 text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newDim1} onChange={(e) => setNewDim1(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDim1())} placeholder={`Add ${dim1Label.toLowerCase()}...`} className="input-field max-w-xs" />
            <button type="button" onClick={addDim1} className="btn-secondary"><Plus className="h-4 w-4" /></button>
          </div>
        </div>

        {hasDim2 && (
          <div className="card p-6 space-y-5">
            <h3 className="section-label">{dim2Label || 'Dimension 2'} Values</h3>
            <div className="flex flex-wrap gap-2">
              {dim2Values.map((v, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-mono text-blue-700">
                  {v}
                  <button type="button" onClick={() => setDim2Values(dim2Values.filter((_, j) => j !== i))} className="ml-1 text-blue-400 hover:text-red-500"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newDim2} onChange={(e) => setNewDim2(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDim2())} placeholder={`Add ${(dim2Label || 'value').toLowerCase()}...`} className="input-field max-w-xs" />
              <button type="button" onClick={addDim2} className="btn-secondary"><Plus className="h-4 w-4" /></button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate('/catalog/size-grids')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={!name || dim1Values.length === 0} className="btn-primary">
            {isEdit ? 'Update grid' : 'Create grid'}
          </button>
        </div>
      </form>
    </div>
  );
}
