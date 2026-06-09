import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Heart, 
  Share2, 
  Check,
  Package,
  Award,
  Zap
} from 'lucide-react';
import api from '@/api/api';
import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';
import { useCart } from '@/api/CartContext';
import { useToast } from '@/components/ui/Toast';
import { Product } from '@/components/shop/ProductCard';
import { animateFlyToCart } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/Products/${id}`);
        const p = response.data;
        setProduct({
          ...p,
          id: p.id?.toString(),
          img: p.imageUrl || p.img || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
          rating: p.rating || 5,
          reviews: p.reviews || Math.floor(Math.random() * 50) + 15
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        showToast("Không tìm thấy sản phẩm!", "error");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate, showToast]);

  const handleAddToCart = (e: React.MouseEvent) => {
    if (product) {
      animateFlyToCart(e, product.img || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80");
      // Map về structure mà Cart mong muốn (price là giá bán)
      const sellingPrice = product.discountPrice ?? product.price;
      for(let i = 0; i < quantity; i++) {
        addToCart({ ...product, price: sellingPrice });
      }
      showToast(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`, "success");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground font-medium animate-pulse">Đang chuẩn bị sản phẩm...</p>
    </div>
  );
  
  if (!product) return null;

  const images = [
    product.img,
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80"
  ].filter(Boolean);

  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price;
  const sellingPrice = product.discountPrice ?? product.price;

  return (
    <div className="min-h-screen bg-[#FCF8F9]">
      <Header />
      
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            <div className="p-2 rounded-full bg-white border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all"><ChevronLeft size={18} /></div>
            Quay lại
          </button>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-full bg-white border border-border text-muted-foreground hover:text-primary transition-all shadow-sm"><Share2 size={18} /></button>
            <button className="p-2.5 rounded-full bg-white border border-border text-muted-foreground hover:text-primary transition-all shadow-sm"><Heart size={18} /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square rounded-[2rem] overflow-hidden bg-white border border-border shadow-sm relative group">
              <img src={images[selectedImg]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              {hasDiscount && product.discountPercentage && (
                <div className="absolute top-6 left-6 bg-accent text-white px-4 py-1.5 rounded-full font-black text-sm shadow-lg shadow-accent/20 animate-bounce-slow">
                  -{product.discountPercentage}%
                </div>
              )}
            </div>
            
            <div className="flex gap-4 px-2">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImg(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedImg === idx ? 'border-primary shadow-md shadow-primary/10 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-[2rem] border border-border p-8 md:p-10 shadow-sm flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{product.categoryName}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase"><Check size={12} strokeWidth={3} /> Còn hàng</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (<Star key={i} size={16} fill={i < (product.rating || 5) ? "currentColor" : "none"} />))}
                  </div>
                  <span className="text-sm font-black text-amber-700">{product.rating}</span>
                </div>
                <div className="text-sm font-bold text-muted-foreground border-l border-border pl-6"><span className="text-foreground">{product.reviews}</span> Đánh giá</div>
                <div className="text-sm font-bold text-muted-foreground border-l border-border pl-6"><span className="text-foreground">500+</span> Đã bán</div>
              </div>

              <div className="bg-secondary/30 rounded-3xl p-8 mb-8 border border-border/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={80} className="text-primary" fill="currentColor" /></div>
                <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">Giá ưu đãi hôm nay</span>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl md:text-5xl font-black text-primary tracking-tighter">{sellingPrice.toLocaleString('vi-VN')}₫</span>
                    {hasDiscount && (
                      <span className="text-xl text-muted-foreground line-through font-medium">{product.price.toLocaleString('vi-VN')}₫</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-primary border border-pink-100"><Award size={20} /></div>
                  <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Thương hiệu</p><p className="text-sm font-black text-foreground">{product.manufacturer}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100"><Package size={20} /></div>
                  <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Độ tuổi</p><p className="text-sm font-black text-foreground">{product.minimumAge}+ tuổi</p></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-secondary rounded-2xl p-1 border border-border h-14">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-white rounded-xl transition-all"><RotateCcw size={16} className="rotate-90" /></button>
                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full flex items-center justify-center hover:bg-white rounded-xl transition-all"><PlusIcon size={16} /></button>
                  </div>
                  <button onClick={handleAddToCart} className="flex-1 h-14 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                    <ShoppingCart size={20} /> Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[ { icon: ShieldCheck, label: "Thủ công 100%", sub: "Đan móc tỉ mỉ" }, { icon: Truck, label: "Giao hàng nhanh", sub: "Toàn quốc 2-4 ngày" }, { icon: RotateCcw, label: "Bảo hành mẫu mã", sub: "Đổi trả miễn phí" } ].map((item, idx) => (
                <div key={idx} className="bg-white border border-border p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                  <item.icon className="text-primary h-5 w-5" />
                  <div><p className="text-[10px] font-black uppercase text-foreground">{item.label}</p><p className="text-[9px] font-medium text-muted-foreground">{item.sub}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2rem] border border-border p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3"><span className="w-1.5 h-6 bg-primary rounded-full" />Câu chuyện sản phẩm</h2>
              <div className="prose prose-pink max-w-none text-muted-foreground leading-relaxed space-y-6">
                <p className="text-lg text-foreground/80 italic font-medium">"{product.name} không chỉ là một món đồ chơi, mà là người bạn đồng hành ấm áp được đan dệt từ sự kiên nhẫn và tình yêu thương tại Gia Đình Thỏ Xinh."</p>
                <p>Từng mũi móc được thực hiện bằng sợi <span className="text-primary font-bold">len Milk Cotton</span> cao cấp, mang lại cảm giác vô cùng mềm mại và đặc biệt an toàn cho làn da nhạy cảm của bé. Sản phẩm có độ bền cao, không bị xù lông hay biến dạng sau nhiều lần giặt.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                  <div className="space-y-4">
                    <h4 className="font-black text-foreground flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Đặc điểm nổi bật</h4>
                    <ul className="space-y-3 text-sm font-medium">
                      <li className="flex items-start gap-2"><Check size={14} className="text-primary mt-1" strokeWidth={3} /> Chất liệu len sợi cotton an toàn tuyệt đối</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-primary mt-1" strokeWidth={3} /> Màu sắc pastel dịu nhẹ, bền màu</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-primary mt-1" strokeWidth={3} /> Kích thước vừa vặn cho đôi tay của bé</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-black text-foreground flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Cách bảo quản</h4>
                    <ul className="space-y-3 text-sm font-medium">
                      <li className="flex items-start gap-2"><Check size={14} className="text-primary mt-1" strokeWidth={3} /> Khuyến khích giặt tay nhẹ nhàng</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-primary mt-1" strokeWidth={3} /> Sử dụng túi giặt nếu giặt bằng máy</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-primary mt-1" strokeWidth={3} /> Phơi trong bóng râm, tránh nắng gắt</li>
                    </ul>
                  </div>
                </div>
                <p>Sở hữu món đồ handmade này là bạn đang ủng hộ những giá trị thủ công truyền thống và mang lại niềm vui nhỏ bé nhưng đầy ý nghĩa cho những người thợ móc len tâm huyết.</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary/5 rounded-[2rem] border border-primary/10 p-8">
              <h3 className="font-black text-primary mb-4 uppercase tracking-widest text-sm">Gia Đình Thỏ Xinh Cam Kết</h3>
              <ul className="space-y-4">
                <li className="flex gap-3"><div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-primary shadow-sm"><Check size={12} strokeWidth={4} /></div><p className="text-xs font-bold text-foreground/80">Hình ảnh thực tế 100% tự chụp</p></li>
                <li className="flex gap-3"><div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-primary shadow-sm"><Check size={12} strokeWidth={4} /></div><p className="text-xs font-bold text-foreground/80">Đổi trả nếu không giống mô tả</p></li>
                <li className="flex gap-3"><div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-primary shadow-sm"><Check size={12} strokeWidth={4} /></div><p className="text-xs font-bold text-foreground/80">Đóng gói hộp quà xinh xắn</p></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const PlusIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="M12 5v14"/>
  </svg>
);

export default ProductDetail;