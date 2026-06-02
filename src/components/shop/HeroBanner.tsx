import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Đồ Gia Dụng Cao Cấp",
    subtitle: "Không gian sống hoàn hảo cho gia đình bạn",
    cta: "Mua ngay",
    bg: "from-rose-400 to-pink-600",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    badge: "Ưu đãi đến 50%",
  },
  {
    id: 2,
    title: "Bộ Nội Thất Phòng Bếp",
    subtitle: "Nấu ăn ngon hơn với thiết bị hiện đại",
    cta: "Khám phá ngay",
    bg: "from-orange-400 to-red-500",
    img: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
    badge: "Hàng mới về",
  },
  {
    id: 3,
    title: "Thiết Bị Điện Gia Dụng",
    subtitle: "Công nghệ tiên tiến, tiết kiệm điện năng",
    cta: "Xem sản phẩm",
    bg: "from-teal-400 to-cyan-600",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    badge: "Giảm 30%",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);
  const banner = banners[current];

  return (
    <div className="relative overflow-hidden rounded-lg aspect-[16/7] shadow-card group">
      {/* Background image */}
      <img
        key={banner.id}
        src={banner.img}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover slide-in"
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} opacity-70`} />

      {/* Content */}
      <div className="absolute inset-0 flex items-center px-10">
        <div key={banner.id} className="text-white fade-in">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-3 badge-pulse">
            {banner.badge}
          </span>
          <h2 className="text-2xl md:text-4xl font-black mb-2 drop-shadow-md leading-tight">
            {banner.title}
          </h2>
          <p className="text-white/85 text-sm md:text-base mb-5 max-w-xs">
            {banner.subtitle}
          </p>
          <button className="px-6 py-2.5 bg-white text-primary font-bold text-sm rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-lg">
            {banner.cta}
          </button>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;