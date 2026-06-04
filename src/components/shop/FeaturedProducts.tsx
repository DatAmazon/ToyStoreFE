import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import ProductCard, { Product } from "./ProductCard";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>("https://localhost:7205/api/Products");
        
        // Duyệt qua mảng và gán ảnh mặc định nếu API trả về null/undefined
        const mappedProducts = response.data.map((p) => ({
          ...p,
          img: p.img ?? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
        }));

        setProducts(mappedProducts); 
      } catch (error) {
        console.error("Lỗi khi kết nối API .NET:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-muted-foreground text-sm">
        Đang tải danh sách sản phẩm...
      </div>
    );
  }

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