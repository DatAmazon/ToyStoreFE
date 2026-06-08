import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import graduateImg from "@/assets/images/graduate.png";
import doctorImg from "@/assets/images/doctor.png";
import weddingImg from "@/assets/images/wedding.png";

const banners = [
  {
    id: 1,
    title: "Móc Len Tốt Nghiệp Ý Nghĩa",
    subtitle: "Gấu cử nhân len - món quà đánh dấu mốc quan trọng trong cuộc đời",
    cta: "Đặt làm ngay",
    bg: "from-blue-600/20 to-indigo-900/20",
    img: graduateImg, 
    badge: "Gấu cử nhân len",
    path: "/products?keyword=Gấu cử nhân"
  },
  {
    id: 2,
    title: "Bác Sĩ & Y Tá Móc Len",
    subtitle: "Búp bê len bác sĩ - món quà tri ân tinh tế cho những nỗ lực thầm lặng",
    cta: "Xem chi tiết",
    bg: "from-teal-600/20 to-emerald-900/20",
    img: doctorImg,
    badge: "Búp bê bác sĩ len",
    path: "/products?keyword=Bác sĩ"
  },
  {
    id: 3,
    title: "Cặp Đôi Thỏ Cưới Móc Len",
    subtitle: "Thỏ cưới len - biểu tượng hạnh phúc vĩnh cửu cho ngày trọng đại",
    cta: "Khám phá ngay",
    bg: "from-rose-500/20 to-pink-900/20",
    img: weddingImg,
    badge: "Cặp đôi thỏ cưới",
    path: "/products?keyword=Thỏ cưới"
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

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

      {/* Gradient overlay - Reduced opacity for clarity */}
      <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} opacity-30`} />

      {/* Content */}
      <div className="absolute inset-0 flex items-center pl-20 pr-10">
        <div key={banner.id} className="text-white fade-in drop-shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-3 badge-pulse">
            {banner.badge}
          </span>
          <h2 className="text-2xl md:text-4xl font-black mb-2 text-primary drop-shadow-md leading-tight">
            {banner.title}
          </h2>
          <p className="text-primary font-medium text-sm md:text-base mb-5 max-w-xs drop-shadow-sm">
            {banner.subtitle}
          </p>
          <button 
            onClick={() => navigate(banner.path)}
            className="px-6 py-2.5 bg-white text-primary font-bold text-sm rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
          >
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