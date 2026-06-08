import { useState, useEffect } from "react";
import { ChevronRight, MessageCircle, Loader2 } from "lucide-react";
import api from "@/api/api";
interface Category {
  id: string;
  categoryName: string;
  sub?: string[]; // Giữ lại cho tương lai nếu API hỗ trợ
}

interface CategorySidebarProps {
  className?: string;
}

const CategorySidebar = ({ className = "" }: CategorySidebarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/Categories/GetAll");
        const data = Array.isArray(response.data) ? response.data : [];
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden shadow-card flex flex-col h-full ${className}`}>
      {/* Header - Fixed */}
      <div className="bg-primary px-4 py-3.5 flex items-center gap-2 flex-shrink-0">
        <div className="grid grid-cols-3 gap-0.5 w-4 h-4 flex-shrink-0">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-primary-foreground rounded-[1px]" />
          ))}
        </div>
        <span className="text-primary-foreground font-bold text-sm uppercase tracking-wide">
          Danh mục sản phẩm
        </span>
      </div>

      {/* Category list - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs">Đang tải...</span>
          </div>
        ) : categories.length > 0 ? (
          <ul className="divide-y divide-border">
            {categories.map((cat, index) => (
              <li
                key={`${cat.id}-${index}`}
                className="relative group"
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <a
                  href={`/products?category=${encodeURIComponent(cat.categoryName)}`}
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:text-primary hover:bg-primary-light transition-colors"
                >
                  <span className="truncate pr-2">{cat.categoryName}</span>
                  {cat.sub && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />}
                </a>

                {/* Submenu - Vẫn giữ Popup cho cấp con */}
                {cat.sub && hoveredId === cat.id && (
                  <div className="absolute left-[calc(100%-4px)] top-0 z-50 bg-card border border-border shadow-card-hover rounded-r-lg min-w-[200px] py-2 animate-in fade-in slide-in-from-left-2 duration-200">
                    {cat.sub.map((sub, sIdx) => (
                      <a
                        key={`${sub}-${sIdx}`}
                        href={`/products?category=${encodeURIComponent(sub)}`}
                        className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-primary-light transition-colors"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-6 px-4 text-center text-sm text-muted-foreground">
            Không có danh mục nào
          </div>
        )}
      </div>

      {/* Contact buttons - Fixed at bottom */}
      <div className="p-3 space-y-1 border-t border-border bg-secondary/30 flex-shrink-0">
        <a
          href="https://zalo.me/0985846590"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded-full bg-[#0068ff] text-white text-[10px] font-bold hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="h-3 w-3" />
          Zalo Tư Vấn
        </a>

        <a
          href="https://www.facebook.com/atamazon.950922/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded-full bg-[#1877f2] text-white text-[10px] font-bold hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="h-3 w-3" />
          Facebook Tư Vấn
        </a>

        <a
          href="tel:0985846590"
          className="flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded-full bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary-dark transition-colors"
        >
          Hotline 0985.846.590
        </a>
      </div>
    </div>
  );
};

export default CategorySidebar;