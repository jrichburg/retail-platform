import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, ShoppingCart, FolderTree, Building2, Grid3X3, ChevronRight, ChevronDown, Scan, FileText, Users, ClipboardList, Landmark, BarChart3, Settings, Sliders, UserCog, ShieldAlert, ArrowRightLeft } from 'lucide-react';

type NavItem = {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
};

type NavGroupItem = {
  icon: typeof LayoutDashboard;
  label: string;
  children: NavItem[];
};

type NavSectionItem = NavItem | NavGroupItem;

function isGroup(item: NavSectionItem): item is NavGroupItem {
  return 'children' in item;
}

const navSections: { label: string | null; items: NavSectionItem[] }[] = [
  {
    label: null,
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Overview' },
    ],
  },
  {
    label: null,
    items: [
      {
        icon: Package,
        label: 'Catalog',
        children: [
          { to: '/catalog/products', icon: Package, label: 'Products' },
          { to: '/catalog/departments', icon: FolderTree, label: 'Departments' },
          { to: '/catalog/suppliers', icon: Building2, label: 'Suppliers' },
          { to: '/catalog/size-grids', icon: Grid3X3, label: 'Size Grids' },
        ],
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        icon: Warehouse,
        label: 'Inventory',
        children: [
          { to: '/inventory', icon: Warehouse, label: 'Stock Levels' },
          { to: '/inventory/receive', icon: Scan, label: 'Receiving' },
          { to: '/inventory/purchase-orders', icon: FileText, label: 'Purchase Orders' },
          { to: '/inventory/transfers', icon: ArrowRightLeft, label: 'Transfers' },
        ],
      },
      { to: '/work-orders', icon: ClipboardList, label: 'Work Orders' },
      { to: '/customers', icon: Users, label: 'Customers' },
      { to: '/sales', icon: ShoppingCart, label: 'Sales' },
      {
        icon: Landmark,
        label: 'Accounts Receivable',
        children: [
          { to: '/ar', icon: BarChart3, label: 'AR Overview' },
          { to: '/ar/invoices', icon: FileText, label: 'Invoices' },
        ],
      },
    ],
  },
];

function NavLinkItem({ item }: { item: NavItem }) {
  return (
    <NavLink
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
  );
}

function NavGroup({ group }: { group: NavGroupItem }) {
  const location = useLocation();
  const isChildActive = group.children.some((child) => location.pathname === child.to);
  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
          isChildActive
            ? 'text-white'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`}
      >
        <group.icon className={`h-4 w-4 flex-shrink-0 ${isChildActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
        <span className="flex-1 text-left">{group.label}</span>
        {open ? (
          <ChevronDown className="h-3 w-3 text-slate-500" />
        ) : (
          <ChevronRight className="h-3 w-3 text-slate-500" />
        )}
      </button>
      {open && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/5 pl-2">
          {group.children.map((child) => (
            <NavLinkItem key={child.to} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}

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
              {section.items.map((item, i) =>
                isGroup(item) ? (
                  <NavGroup key={item.label} group={item} />
                ) : (
                  <NavLinkItem key={item.to} item={item} />
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings + Footer */}
      <div className="border-t border-white/5 px-3 py-3 space-y-0.5">
        <NavGroup group={{
          icon: Settings,
          label: 'Settings',
          children: [
            { to: '/settings', icon: Sliders, label: 'Store Config' },
            { to: '/settings/users', icon: UserCog, label: 'Users' },
          ],
        }} />
      </div>

      <div className="border-t border-amber-400/10 px-3 py-3 space-y-0.5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-amber-500/60">Platform</p>
        <NavLinkItem item={{ to: '/platform/tenants', icon: ShieldAlert, label: 'Tenants' }} />
        <p className="mt-3 px-3 text-[10px] text-slate-600">Phase 1 — Foundation</p>
      </div>
    </aside>
  );
}
