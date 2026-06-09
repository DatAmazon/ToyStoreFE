import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import CategorySidebar from "./CategorySidebar";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Khuyến mại", href: "#" },
  { label: "Giới thiệu", href: "/about" },
];

const NavMenu = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHomepage = location.pathname === '/';

  return (
    <div className="bg-card border-b border-border shadow-sm sticky top-[68px] z-40">
      <div className="container mx-auto flex items-center">
        {/* Category button - Ẩn trên desktop ở trang chủ vì đã có sidebar */}
        <div className={`flex-shrink-0 relative ${isHomepage ? 'lg:hidden' : ''}`}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="hidden sm:block">Danh mục sản phẩm</span>
            <span className="sm:hidden uppercase">Danh mục</span>
          </button>

          {/* Mobile Category Dropdown */}
          {mobileOpen && (
            <>
              <div className="absolute top-full left-0 w-[280px] max-h-[70vh] shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <CategorySidebar className="rounded-t-none border-t-0" />
              </div>
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden" 
                onClick={() => setMobileOpen(false)}
              />
            </>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex items-center overflow-x-auto scrollbar-hide">
          {navLinks.map(link => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "text-primary border-primary"
                    : "text-foreground border-transparent hover:text-primary hover:border-primary/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default NavMenu;