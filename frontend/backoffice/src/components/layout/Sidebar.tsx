import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, ShoppingCart, FolderTree, Building2, Grid3X3, ChevronRight, Scan, FileText } from 'lucide-react';

const navSections = [
  {
    label: null,
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Overview' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/catalog/products', icon: Package, label: 'Products' },
      { to: '/catalog/departments', icon: FolderTree, label: 'Departments' },
      { to: '/catalog/suppliers', icon: Building2, label: 'Suppliers' },
      { to: '/catalog/size-grids', icon: Grid3X3, label: 'Size Grids' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/inventory', icon: Warehouse, label: 'Stock Levels' },
      { to: '/inventory/receive', icon: Scan, label: 'Receiving' },
      { to: '/inventory/purchase-orders', icon: FileText, label: 'Purchase Orders' },
      { to: '/sales', icon: ShoppingCart, label: 'Sales' },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-col bg-slate-925 text-white">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/90">
          <span className="text-sm font-bold text-slate-900">R</span>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">Retail Platform</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Back Office</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3 py-4">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <ChevronRight className="h-3 w-3 text-slate-500" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 px-5 py-4">
        <p className="text-[10px] text-slate-600">Phase 1 — Foundation</p>
      </div>
    </aside>
  );
}
