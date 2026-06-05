import { useState } from "react";
import TopBar from "@/components/shop/TopBar";
import Header from "@/components/shop/Header";
import NavMenu from "@/components/shop/NavMenu";
import AboutUs from "@/components/shop/AboutUs";
import Footer from "@/components/shop/Footer";

const AboutPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* Topbar */}
      <TopBar />

      {/* Header */}
      <Header onSearch={(k) => setSearchKeyword(k)} />

      {/* Navigation */}
      <NavMenu />

      {/* Main content */}
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <AboutUs />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;