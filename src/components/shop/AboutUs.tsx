import React from 'react';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const AboutUs = () => {
  return (
    <section id="about-us" className="py-12 md:py-20 bg-white rounded-[2rem] overflow-hidden border border-border shadow-sm relative scroll-mt-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Image Gallery - Creative Masonry Style */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="relative overflow-hidden rounded-3xl shadow-lg group">
                  <img
                    src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&q=80"
                    alt="Đồ len handmade"
                    className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="relative overflow-hidden rounded-3xl shadow-lg group">
                  <img
                    src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80"
                    alt="Len móc thú bông"
                    className="w-full h-40 md:h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-3xl shadow-lg group border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80"
                    alt="Sản phẩm móc len"
                    className="w-full h-56 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="relative overflow-hidden rounded-3xl shadow-lg group">
                  <img
                    src="https://images.unsplash.com/photo-1599458348407-3507d377b75b?w=600&q=80"
                    alt="Len sợi cao cấp"
                    className="w-full h-40 md:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating Experience Badge */}
            <div className="absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 bg-white p-4 md:p-6 rounded-3xl shadow-2xl border border-pink-50 flex flex-col items-center animate-bounce-slow">
              <span className="text-3xl md:text-4xl font-black text-primary">100%</span>
              <span className="text-[10px] md:text-xs uppercase font-bold text-muted-foreground tracking-tighter">Thủ công mỹ nghệ</span>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="space-y-8">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] md:text-xs font-bold uppercase tracking-widest border border-primary/20">
                <Sparkles size={14} className="animate-pulse" /> Chào mừng bạn đến với chúng tôi
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1]">
                Gia Đình <br className="hidden lg:block" />
                <span className="text-primary relative inline-block">
                  Thỏ Xinh
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>
              </h2>
              
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                Nơi những sợi len mềm mại được đan dệt bằng cả <span className="text-primary font-bold">trái tim</span>. Mỗi món đồ tại Gia Đình Thỏ Xinh không chỉ là một sản phẩm, mà là một câu chuyện ấm áp dành tặng cho những người thân yêu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-pink-50/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0 text-primary">
                  <Heart size={24} fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Tâm Huyết</h4>
                  <p className="text-sm text-muted-foreground mt-1">Mỗi mũi móc đều gửi gắm sự tỉ mỉ và yêu thương.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-blue-50/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-500">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">An Toàn</h4>
                  <p className="text-sm text-muted-foreground mt-1">Sử dụng len Milk Cotton cao cấp, an toàn cho bé yêu.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start">
              <Link 
                to="/#featured-products"
                className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Xem các mẫu mới nhất
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex -space-x-3 items-center">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Customer" />
                  </div>
                ))}
                <span className="ml-4 text-xs font-bold text-muted-foreground">+500 khách hàng tin dùng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;