import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import axios from 'axios';
import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';
import { useCart } from '@/api/CartContext';
import { useToast } from '@/components/ui/Toast';
import { Product } from '@/components/shop/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`https://localhost:7205/api/Products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        showToast("Không tìm thấy sản phẩm!", "error");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate, showToast]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  if (!product) return null;

  const displayImg = product.img || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft size={20} /> Quay lại
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                <img 
                  src={displayImg} 
                  alt={product.name} 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span className="text-xs font-bold text-primary uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">
                  {product.categoryName}
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <span className="text-gray-400 font-medium ml-1">4.9 (128 đánh giá)</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">Đã bán: 542</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-primary">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {product.originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>
                <p className="text-sm text-green-600 font-medium mt-2">Tiết kiệm: {(product.originalPrice ? product.originalPrice - product.price : 0).toLocaleString('vi-VN')}₫</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-24 font-bold">Thương hiệu:</span>
                  <span className="text-gray-900">{product.manufacturer}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-24 font-bold">Độ tuổi:</span>
                  <span className="text-gray-900">{product.minimumAge}+</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-24 font-bold">Tình trạng:</span>
                  <span className={product.stockQuantity > 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                    {product.stockQuantity > 0 ? `Còn hàng (${product.stockQuantity} sản phẩm)` : "Hết hàng"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button 
                  onClick={() => {
                    addToCart(product);
                    showToast(`Đã thêm ${product.name} vào giỏ hàng`);
                  }}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-pink-50 transition-all"
                >
                  <ShoppingCart size={20} /> Thêm vào giỏ
                </button>
                <button 
                  className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-pink-100"
                >
                  Mua ngay
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-gray-100">
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="text-primary h-6 w-6" />
                  <span className="text-[11px] font-bold text-gray-700">100% Chính hãng</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="text-primary h-6 w-6" />
                  <span className="text-[11px] font-bold text-gray-700">Giao hàng nhanh</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="text-primary h-6 w-6" />
                  <span className="text-[11px] font-bold text-gray-700">Đổi trả 7 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-10 bg-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Thông tin chi tiết sản phẩm</h2>
          <div className="prose max-w-none text-gray-600 text-sm leading-relaxed">
            <p>Sản phẩm {product.name} từ thương hiệu {product.manufacturer} là sự lựa chọn tuyệt vời dành cho các bé từ {product.minimumAge} tuổi trở lên. Được sản xuất với tiêu chuẩn an toàn cao cấp, giúp bé phát triển tư duy sáng tạo và khả năng vận động.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Chất liệu an toàn, không độc hại cho trẻ nhỏ.</li>
              <li>Màu sắc bắt mắt, bền bỉ theo thời gian.</li>
              <li>Giúp phát triển kỹ năng tư duy logic và phối hợp tay mắt.</li>
              <li>Dễ dàng vệ sinh và bảo quản sau khi chơi.</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
