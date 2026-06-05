import { useState } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Khuyến mại", href: "#" },
  { label: "Giới thiệu", href: "/about" },
  // { label: "Tin tức", href: "#" },
  // { label: "Tuyển dụng", href: "#" },
  // { label: "Liên hệ", href: "#" },
];

const NavMenu = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center">
        {/* Category button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <Menu className="h-4 w-4" />
            <span className="hidden sm:block">Danh mục sản phẩm</span>
          </button>
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