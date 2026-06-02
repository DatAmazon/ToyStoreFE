const promos = [
  {
    id: 1,
    title: "Đồ Nội Thất",
    subtitle: "Phong cách Scandinavian",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    color: "from-amber-400/80 to-orange-500/80",
  },
  {
    id: 2,
    title: "Đồ Dùng Bếp",
    subtitle: "Đầu bếp chuyên nghiệp tại nhà",
    img: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=80",
    color: "from-pink-400/80 to-rose-600/80",
  },
  {
    id: 3,
    title: "Vật Dụng Phòng Tắm",
    subtitle: "Cao cấp & tiện nghi",
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
    color: "from-teal-400/80 to-cyan-600/80",
  },
];

const PromoGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {promos.map((promo) => (
        <a
          key={promo.id}
          href="#"
          className="relative overflow-hidden rounded-lg aspect-[4/3] group shadow-card hover:shadow-card-hover transition-shadow"
        >
          <img
            src={promo.img}
            alt={promo.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${promo.color} opacity-60`} />
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-base leading-tight">{promo.title}</h3>
            <p className="text-white/80 text-xs mt-0.5">{promo.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default PromoGrid;