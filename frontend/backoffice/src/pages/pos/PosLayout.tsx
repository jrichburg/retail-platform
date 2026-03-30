import { Outlet } from 'react-router-dom';

export function PosLayout() {
  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <Outlet />
    </div>
  );
}
