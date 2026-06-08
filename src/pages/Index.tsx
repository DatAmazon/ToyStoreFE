import { useState } from "react";
import TopBar from "@/components/shop/TopBar";
import Header from "@/components/shop/Header";
import NavMenu from "@/components/shop/NavMenu";
import CategorySidebar from "@/components/shop/CategorySidebar";
import HeroBanner from "@/components/shop/HeroBanner";
import PromoGrid from "@/components/shop/PromoGrid";
import TrustBanner from "@/components/shop/TrustBanner";
import FeaturedProducts from "@/components/shop/FeaturedProducts";
import Footer from "@/components/shop/Footer";

const Index = () => {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* Topbar */}
      <TopBar />

      {/* Header */}
      <Header onSearch={setSearchKeyword} />

      {/* Navigation */}
      <NavMenu />

      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto py-4 space-y-8">
          {/* Hero section: sidebar + banner */}
          <div className="flex gap-4 items-start relative">
            {/* Category sidebar - hidden on mobile */}
            <aside className="w-56 flex-shrink-0 hidden lg:block self-stretch relative">
              <div className="absolute inset-0">
                <CategorySidebar />
              </div>
            </aside>

            {/* Hero banner */}
            <div className="flex-1 min-w-0">
              <HeroBanner />
            </div>
          </div>

          {/* Trust badges */}
          <TrustBanner />

          {/* Promo banners */}
          <PromoGrid />

          {/* Products */}
          <FeaturedProducts keyword={searchKeyword} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;