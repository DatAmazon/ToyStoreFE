import { useState, useEffect } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/ui/Logo";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/api/CartContext";
import api from "@/api/api";

interface HeaderProps {
  onSearch?: (keyword: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [search, setSearch] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const { cartItems } = useCart();
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = () => {
    // Hiệu ứng nháy nút
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);

    // Hiệu ứng thanh progress
    setIsSearching(true);
    
    if (onSearch) {
      onSearch(search);
    }

    // Giả lập hoặc đợi tìm kiếm xong
    setTimeout(() => {
      setIsSearching(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-card shadow-nav sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto py-3 flex items-center gap-6">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <Logo size="md" />
        </a>

        {/* Search bar container */}
        <div className="flex-1 flex flex-col max-w-2xl relative">
          <div className="flex">
            <input
              type="text"
              placeholder="Từ khóa tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-10 px-4 border border-border border-r-0 rounded-l-md bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <button 
              onClick={handleSearch}
              className={`h-10 px-5 bg-primary hover:bg-primary-dark text-primary-foreground text-sm font-semibold rounded-r-md transition-all active:scale-95 ${isClicked ? 'brightness-125 scale-105' : ''}`}
            >
              <Search className={`h-4 w-4 transition-transform ${isClicked ? 'rotate-12' : ''}`} />
            </button>
          </div>

          {/* Progress bar nhỏ ngay dưới ô tìm kiếm */}
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 overflow-hidden rounded-full">
            {isSearching && (
              <div className="h-full bg-primary animate-progress-loading w-full origin-left" />
            )}
          </div>
        </div>

        {/* Account & Cart */}
        <div className="flex items-center gap-5 ml-auto">
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="text-xs hidden md:block">Tài khoản</span>
          </button>
          <button 
            id="cart-icon"
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalCartItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-none">
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </Badge>
              )}
            </div>
            <span className="text-xs hidden md:block">Giỏ hàng</span>
          </button>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default Header;