import { ShoppingCart, Heart, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/api/CartContext";
import { useToast } from "@/components/ui/Toast";
import { animateFlyToCart } from "@/lib/utils";

interface Product {
  id: string; 
  name: string;
  price: number;
  discountPrice?: number | null;
  discountPercentage?: number | null;
  stockQuantity: number;
  minimumAge: number;
  manufacturer: string;
  categoryName: string;
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
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const displayImg = product.img || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";

  // Giá thực bán là discountPrice nếu có, không thì là price gốc
  const sellingPrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockQuantity > 0) {
      animateFlyToCart(e, displayImg);
      // Map về structure mà Cart mong muốn (price là giá bán)
      addToCart({ ...product, price: sellingPrice });
      showToast(`Đã thêm ${product.name} vào giỏ hàng`);
    } else {
      showToast("Sản phẩm hiện đang hết hàng", "error");
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(l => !l);
    showToast(liked ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích", "info");
  };

  const currentRating = product.rating ?? 0;
  const currentReviews = product.reviews ?? 0;

  return (
    <Link 
      to={`/product/${product.id}`}
      className="product-card bg-card rounded-lg overflow-hidden border border-border group cursor-pointer h-full flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={displayImg}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${product.badgeColor || "bg-primary"}`}
            >
              {product.badge}
            </span>
          )}
          {product.stockQuantity <= 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-destructive text-white">
              Hết hàng
            </span>
          )}
          {hasDiscount && product.discountPercentage && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent text-accent-foreground">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card z-10"
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${liked ? "text-primary fill-primary" : "text-muted-foreground"}`}
          />
        </button>

        <button 
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 py-2.5 px-3 bg-primary text-primary-foreground text-xs font-semibold text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5 w-full hover:bg-primary-dark z-10"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {product.stockQuantity > 0 ? "Thêm vào giỏ hàng" : "Liên hệ"}
        </button>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{product.manufacturer}</p>
        
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors leading-snug h-10">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < currentRating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({currentReviews})</span>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <span className="text-primary font-bold text-base">{formatPrice(sellingPrice)}</span>
          {hasDiscount && (
            <span className="text-muted-foreground text-xs line-through">{formatPrice(product.price)}</span>
          )}
        </div>
        
        <p className="text-[10px] text-muted-foreground mt-2">Độ tuổi: {product.minimumAge}+</p>
      </div>
    </Link>
  );
};

export type { Product };
export default ProductCard;