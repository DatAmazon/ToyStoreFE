import { Shield, Truck, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Giao hàng nhanh", desc: "Toàn quốc 2-5 ngày" },
  { icon: Shield, title: "Hàng chính hãng", desc: "100% chính hãng, có bảo hành" },
  { icon: RefreshCw, title: "Đổi trả dễ dàng", desc: "Trong vòng 30 ngày" },
  { icon: Headphones, title: "Hỗ trợ 24/7", desc: "Hotline 1900 6680" },
];

const TrustBanner = () => {
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x divide-border">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBanner;