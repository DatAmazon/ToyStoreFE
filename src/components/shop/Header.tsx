import { useState } from "react";
import { Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");

  const categories = [
    "Tất cả", "Đồ nhà bếp", "Nội thất", "Vật dụng phòng tắm",
    "Đồ trang trí", "Thiết bị điện", "Đồ dùng gia đình",
  ];

  return (
    <div className="bg-card shadow-nav sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto py-3 flex items-center gap-6">
        {/* Logo */}
        <a href="/" className="flex-shrink-0 flex items-center gap-1">
          <span className="text-2xl font-black text-foreground">Home</span>
          <span className="text-2xl font-black text-primary">Store</span>
          <span className="text-primary text-xl">◆</span>
        </a>

        {/* Search bar */}
        <div className="flex-1 flex max-w-2xl">
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 pl-3 pr-8 border border-border border-r-0 rounded-l-md bg-secondary text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <input
            type="text"
            placeholder="Từ khóa tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-10 px-4 border border-border border-x-0 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <button className="h-10 px-5 bg-primary hover:bg-primary-dark text-primary-foreground text-sm font-semibold rounded-r-md transition-colors">
            <Search className="h-4 w-4" />
          </button>
        </div>

        {/* Account & Cart */}
        <div className="flex items-center gap-5 ml-auto">
          <a href="#" className="flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors">
            <User className="h-5 w-5" />
            <span className="text-xs hidden md:block">Tài khoản</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors relative">
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                0
              </Badge>
            </div>
            <span className="text-xs hidden md:block">Giỏ hàng</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;