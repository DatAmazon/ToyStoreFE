import { useState } from 'react';
import { LayoutDashboard, Box, UserSquare2, WalletCards, BadgePercent, HelpCircle, ChevronRight, Menu, X, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Box size={20} />, label: 'Product', path: '/admin/products' },
    { icon: <UserSquare2 size={20} />, label: 'Customers' },
    { icon: <WalletCards size={20} />, label: 'Income', hasArrow: true },
    { icon: <BadgePercent size={20} />, label: 'Promote', hasArrow: true },
    { icon: <HelpCircle size={20} />, label: 'Help', hasArrow: true },
    { icon: <Home size={20} />, label: 'Back to Store', path: '/' },
  ];

  return (
    <>
      {/* Nút Hamburger (Chỉ hiện trên Mobile < 1024px) */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Panel */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic">D</div>
            <h1 className="text-xl font-bold">Dashboard <span className="text-xs text-gray-400 font-normal">v.01</span></h1>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path || '#'}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  (item.path && location.pathname === item.path) || item.active 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.hasArrow && <ChevronRight size={16} />}
              </Link>
            ))}
          </nav>
        </div>

        {/* Banner Upgrade: Ẩn trên mobile để tiết kiệm diện tích */}
        <div className="hidden lg:block bg-gradient-to-br from-purple-500 to-indigo-600 p-5 rounded-3xl text-white text-center">
          <p className="text-sm font-semibold mb-3">Upgrade to PRO to get access all Features!</p>
          <button className="bg-white text-indigo-600 w-full py-2 rounded-xl font-bold text-sm hover:bg-opacity-90">Get Pro Now!</button>
        </div>
      </div>

      {/* Lớp nền đen mờ khi mở menu trên mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden backdrop-blur-sm"
        ></div>
      )}
    </>
  );
};

export default Sidebar;