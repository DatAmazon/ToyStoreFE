import { Phone, Mail, MapPin, Facebook, Youtube, Instagram, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-primary-foreground mt-12">
      {/* Main footer */}
      <div className="container mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company info */}
        <div>
          <div className="flex items-center gap-1 mb-4">
            <span className="text-2xl font-black">Home</span>
            <span className="text-2xl font-black text-primary">Store</span>
            <span className="text-primary text-xl">◆</span>
          </div>
          <p className="text-primary-foreground/60 text-sm leading-relaxed mb-4">
            Chuyên cung cấp đồ gia dụng cao cấp, thiết bị nhà bếp, nội thất và vật dụng gia đình chính hãng với giá tốt nhất thị trường.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors">
              <Youtube className="h-4 w-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wide mb-4 text-primary-foreground/90">
            Danh mục
          </h3>
          <ul className="space-y-2">
            {["Đồ nhà bếp", "Nội thất", "Vật dụng phòng tắm", "Thiết bị điện", "Đồ trang trí", "Đồ dùng gia đình"].map((item) => (
              <li key={item}>
                <a href="#" className="flex items-center gap-1.5 text-sm text-primary-foreground/60 hover:text-primary transition-colors">
                  <ArrowRight className="h-3 w-3" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wide mb-4 text-primary-foreground/90">
            Hỗ trợ
          </h3>
          <ul className="space-y-2">
            {["Chính sách đổi trả", "Chính sách bảo hành", "Hướng dẫn mua hàng", "Phương thức thanh toán", "Vận chuyển & giao hàng", "Câu hỏi thường gặp"].map((item) => (
              <li key={item}>
                <a href="#" className="flex items-center gap-1.5 text-sm text-primary-foreground/60 hover:text-primary transition-colors">
                  <ArrowRight className="h-3 w-3" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wide mb-4 text-primary-foreground/90">
            Liên hệ
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-sm">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <span>123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center gap-2.5 text-sm">
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <a href="tel:19006680" className="hover:text-primary transition-colors">
                1900 6680
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-sm">
              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
              <a href="mailto:info@homestore.vn" className="hover:text-primary transition-colors">
                info@homestore.vn
              </a>
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-5">
            <p className="text-xs text-primary-foreground/60 mb-2">Đăng ký nhận ưu đãi:</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="flex-1 h-9 px-3 text-xs bg-primary-foreground/10 border border-primary/20 rounded-l-md text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-primary"
              />
              <button className="h-9 px-3 bg-primary text-primary-foreground text-xs rounded-r-md hover:bg-primary-dark transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary/10">
        <div className="container mx-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/40">
          <span>© 2024 HomeStore. Tất cả quyền được bảo lưu.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;