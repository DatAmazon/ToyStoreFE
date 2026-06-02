    import { useState } from "react";
import { ChevronRight, MessageCircle } from "lucide-react";

const categories = [
  { id: 1, name: "Đồ nhà bếp", sub: ["Nồi cơm điện", "Máy xay sinh tố", "Chảo chống dính", "Bếp từ"] },
  { id: 2, name: "Nội thất" },
  { id: 3, name: "Vật dụng phòng tắm" },
  { id: 4, name: "Đồ trang trí" },
  { id: 5, name: "Thiết bị điện gia dụng" },
  { id: 6, name: "Đồ dùng phòng ngủ" },
  { id: 7, name: "Đồ dùng phòng khách" },
  { id: 8, name: "Đồ dùng văn phòng" },
  { id: 9, name: "Vật dụng vệ sinh nhà" },
];

interface CategorySidebarProps {
  className?: string;
}

const CategorySidebar = ({ className = "" }: CategorySidebarProps) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden shadow-card ${className}`}>
      {/* Header */}
      <div className="bg-primary px-4 py-3 flex items-center gap-2">
        <div className="grid grid-cols-3 gap-0.5 w-4 h-4 flex-shrink-0">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-primary-foreground rounded-[1px]" />
          ))}
        </div>
        <span className="text-primary-foreground font-bold text-sm uppercase tracking-wide">
          Danh mục sản phẩm
        </span>
      </div>

      {/* Category list */}
      <ul className="divide-y divide-border">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="relative group"
            onMouseEnter={() => setHoveredId(cat.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <a
              href="#"
              className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:text-primary hover:bg-primary-light transition-colors"
            >
              <span>{cat.name}</span>
              {cat.sub && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />}
            </a>

            {/* Submenu */}
            {cat.sub && hoveredId === cat.id && (
              <div className="absolute left-full top-0 z-50 bg-card border border-border shadow-card-hover rounded-r-lg min-w-[180px] py-2 fade-in">
                {cat.sub.map((sub) => (
                  <a
                    key={sub}
                    href="#"
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

      {/* Contact buttons */}
      <div className="p-3 space-y-2 border-t border-border bg-secondary/50">
        <a
          href="#"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-full bg-[#0068ff] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Tư vấn qua Zalo
        </a>

        <a
          href="#"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-full bg-[#1877f2] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Tư vấn qua Facebook
        </a>

        <a
          href="tel:0901191616"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-dark transition-colors"
        >
          Hotline 0901.191.616
        </a>
      </div>
    </div>
  );
};

export default CategorySidebar;