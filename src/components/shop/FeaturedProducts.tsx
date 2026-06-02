import { ChevronRight } from "lucide-react";
import ProductCard, { Product } from "./ProductCard";

const products: Product[] = [
  {
    id: 1, name: "Nồi cơm điện thông minh Sunhouse 1.8L cao cấp",
    price: 890000, originalPrice: 1250000, rating: 4, reviews: 128,
    img: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
    badge: "Bán chạy", badgeColor: "bg-rose-500",
  },
  {
    id: 2, name: "Chảo chống dính đáy từ Tefal 24cm",
    price: 450000, originalPrice: 620000, rating: 5, reviews: 89,
    img: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&q=80",
    badge: "Mới", badgeColor: "bg-teal-500",
  },
  {
    id: 3, name: "Máy xay sinh tố đa năng Philips 750W",
    price: 1290000, originalPrice: 1800000, rating: 4, reviews: 67,
    img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80",
  },
  {
    id: 4, name: "Bộ dao bếp inox 6 món cao cấp có hộp",
    price: 320000, originalPrice: 490000, rating: 4, reviews: 204,
    img: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&q=80",
  },
  {
    id: 5, name: "Đèn LED trang trí phòng khách Edison vintage",
    price: 185000, originalPrice: 260000, rating: 5, reviews: 312,
    img: "https://images.unsplash.com/photo-1555851866-fcd25c85cd64?w=400&q=80",
    badge: "Hot", badgeColor: "bg-orange-500",
  },
  {
    id: 6, name: "Khăn tắm cotton cao cấp 70x140cm mềm mịn",
    price: 149000, originalPrice: 199000, rating: 4, reviews: 445,
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
  },
  {
    id: 7, name: "Giỏ mây đan trang trí phòng ngủ Scandinavian",
    price: 220000, originalPrice: 320000, rating: 5, reviews: 78,
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  },
  {
    id: 8, name: "Máy lọc không khí mini Xiaomi 2S cho phòng ngủ",
    price: 1650000, originalPrice: 2200000, rating: 5, reviews: 156,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    badge: "Flash Sale", badgeColor: "bg-primary",
  },
];

interface SectionProps {
  title: string;
  subtitle?: string;
  items: Product[];
  viewAll?: string;
}

const ProductSection = ({ title, subtitle, items, viewAll = "#" }: SectionProps) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block" />
          {title}
        </h2>
        {subtitle && <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>}
      </div>
      <a
        href={viewAll}
        className="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
      >
        Xem tất cả <ChevronRight className="h-4 w-4" />
      </a>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  </div>
);

const FeaturedProducts = () => {
  return (
    <div className="space-y-10">
      <ProductSection
        title="Sản phẩm nổi bật"
        subtitle="Được khách hàng tin dùng và đánh giá cao nhất"
        items={products.slice(0, 4)}
      />
      <ProductSection
        title="Flash Sale hôm nay"
        subtitle="Ưu đãi giảm giá sâu - Số lượng có hạn!"
        items={products.slice(4, 8)}
      />
    </div>
  );
};

export default FeaturedProducts;