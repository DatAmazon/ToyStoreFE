import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/api/api";

interface Product {
  id: string | number;
  name: string;
  imageUrl?: string;
  price: number;
  categoryName?: string;
}

const colors = [
  "from-amber-400/80 to-orange-500/80",
  "from-pink-400/80 to-rose-600/80",
  "from-teal-400/80 to-cyan-600/80",
];

const PromoGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotedProducts = async () => {
      try {
        const response = await api.get("/api/Products?pageSize=3&pageNumber=1");
        // Lấy data từ response (đã qua interceptor nên response.data là mảng sản phẩm)
        const data = Array.isArray(response.data) ? response.data : [];
        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm khuyến mãi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotedProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-secondary animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {products.map((product, index) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="relative overflow-hidden rounded-lg aspect-[4/3] group shadow-card hover:shadow-card-hover transition-shadow"
        >
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${colors[index % colors.length]} opacity-60`} />
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <span className="text-white/90 text-[10px] uppercase font-bold tracking-wider mb-1">
              {product.categoryName || "Sản phẩm mới"}
            </span>
            <h3 className="text-white font-bold text-base leading-tight line-clamp-2">{product.name}</h3>
            <p className="text-white text-sm font-black mt-1">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PromoGrid;