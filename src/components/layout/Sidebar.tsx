
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Database, Archive, User, BarChart3, Settings, Home } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Products', path: '/dashboard/products' },
    { icon: Archive, label: 'Categories', path: '/dashboard/categories' },
    { icon: Database, label: 'Inventory', path: '/dashboard/inventory' },
    { icon: User, label: 'Suppliers', path: '/dashboard/suppliers' },
    { icon: BarChart3, label: 'Reports', path: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen fixed lg:sticky top-0">
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-gray-900">InvenTrack</h1>
            <p className="text-xs lg:text-sm text-gray-500">Inventory Management</p>
          </div>
        </Link>
      </div>
      
      <nav className="mt-4 lg:mt-6 overflow-y-auto h-[calc(100vh-100px)]">
        <ul className="space-y-1 lg:space-y-2 px-3 lg:px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm lg:text-base">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
