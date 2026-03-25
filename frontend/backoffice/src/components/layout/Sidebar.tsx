import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, ShoppingCart, FolderTree } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/catalog/products', icon: Package, label: 'Products' },
  { to: '/catalog/departments', icon: FolderTree, label: 'Departments' },
  { to: '/inventory', icon: Warehouse, label: 'Inventory' },
  { to: '/sales', icon: ShoppingCart, label: 'Sales' },
];

export function Sidebar() {
  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-bold text-gray-900">Retail Platform</h1>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
