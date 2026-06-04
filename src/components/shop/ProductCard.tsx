import { ShoppingCart, Heart, Star } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string; // GUID từ .NET là string
  name: string;
  price: number;
  originalPrice?: number | null; // Cần trường này để tính discount
  stockQuantity: number;
  minimumAge: number;
  manufacturer: string;
  categoryName: string;
  // Các trường sau API chưa có, bạn có thể để optional (?) hoặc bổ sung sau
  img?: string | null;
  rating?: number | null;
  reviews?: number | null;
  badge?: string | null;
  badgeColor?: string | null;
}

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const ProductCard = ({ product }: ProductCardProps) => {
  const [liked, setLiked] = useState(false);

  // LOGIC NGHIỆP VỤ MỚI:
  // 1. Xử lý ảnh mặc định nếu API trả về null
  const displayImg = product.img || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";

  // 2. Tính % giảm giá an toàn (tránh chia cho 0 hoặc lỗi khi không có originalPrice)
  const discount = (product.originalPrice && product.originalPrice > product.price)
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  // 3. Xử lý Rating mặc định nếu API trả về null
  const currentRating = product.rating ?? 0;
  const currentReviews = product.reviews ?? 0;

  return (
    <div className="product-card bg-card rounded-lg overflow-hidden border border-border group cursor-pointer">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={displayImg}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${product.badgeColor || "bg-primary"}`}
            >
              {product.badge}
            </span>
          )}
          {/* Tự động hiện Badge Hết hàng nếu stockQuantity bằng 0 */}
          {product.stockQuantity <= 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-destructive text-white">
              Hết hàng
            </span>
          )}
          {discount && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent text-accent-foreground">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài thẻ card
            setLiked(l => !l);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${liked ? "text-primary fill-primary" : "text-muted-foreground"}`}
          />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-primary text-primary-foreground text-xs font-semibold text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5">
          <ShoppingCart className="h-3.5 w-3.5" />
          {product.stockQuantity > 0 ? "Thêm vào giỏ hàng" : "Liên hệ"}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Tên nhà sản xuất nhỏ ở trên */}
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{product.manufacturer}</p>
        
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors leading-snug h-10">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < currentRating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({currentReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-base">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-muted-foreground text-xs line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        
        {/* Thông tin bổ sung: Độ tuổi phù hợp */}
        <p className="text-[10px] text-muted-foreground mt-2">Độ tuổi: {product.minimumAge}+</p>
      </div>
    </div>
  );
};

export type { Product };
export default ProductCard;