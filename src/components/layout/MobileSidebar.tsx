
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Database, Archive, User, BarChart3, Settings, Home, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Archive, label: 'Categories', path: '/categories' },
    { icon: Database, label: 'Inventory', path: '/inventory' },
    { icon: User, label: 'Suppliers', path: '/suppliers' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="w-6 h-6" />
      </Button>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">InvenTrack</h1>
                  <p className="text-xs text-gray-500">Inventory Management</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <nav className="mt-4">
              <ul className="space-y-1 px-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={toggleSidebar}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSidebar;
