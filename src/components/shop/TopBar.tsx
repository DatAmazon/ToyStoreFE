import { Phone, Facebook, Youtube, Mail, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="bg-brand-dark text-primary-foreground py-2 text-sm">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-medium">
          <Phone className="h-3.5 w-3.5 text-primary" />
          <span>Hotline: </span>
          <a href="tel:19006680" className="text-primary hover:underline font-semibold">1900 6680</a>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs">
          <span className="text-primary-foreground/70">Quà Tặng Doanh Nghiệp</span>
          <span className="text-border">|</span>
          <span className="text-primary-foreground/70">Bán Buôn Cây Cảnh</span>
          <span className="text-border">|</span>
          <Link to="/admin" className="flex items-center gap-1 text-primary hover:underline font-bold">
            <LayoutDashboard className="h-3 w-3" />
            Dashboard Admin
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a href="#" className="text-primary-foreground/60 hover:text-primary transition-colors">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="#" className="text-primary-foreground/60 hover:text-primary transition-colors">
            <Youtube className="h-4 w-4" />
          </a>
          <a href="#" className="text-primary-foreground/60 hover:text-primary transition-colors">
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;