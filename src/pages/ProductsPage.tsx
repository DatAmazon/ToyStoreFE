import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/api/api";
import { ChevronRight, ChevronLeft, Filter, X, SlidersHorizontal } from "lucide-react";
import ProductCard, { Product } from "@/components/shop/ProductCard";
import TopBar from "@/components/shop/TopBar";
import Header from "@/components/shop/Header";
import NavMenu from "@/components/shop/NavMenu";
import Footer from "@/components/shop/Footer";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // States cho lọc
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [categoryName, setCategoryName] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get("sortOrder") || "");
  const [pageNumber, setPageNumber] = useState(Number(searchParams.get("pageNumber")) || 1);
  const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 12);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Đồng bộ category từ URL khi nó thay đổi (ví dụ nhấn từ Sidebar)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat !== null) {
      setCategoryName(cat);
      setPageNumber(1);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (categoryName) params.append("categoryName", categoryName);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sortOrder) params.append("sortOrder", sortOrder);
      params.append("pageNumber", pageNumber.toString());
      params.append("pageSize", pageSize.toString());

      const response = await api.get(`/api/Products?${params.toString()}`);
      
      let data = [];
      let total = 0;

      if (response.data && response.data.data) {
        data = response.data.data;
        total = response.data.totalCount || 0;
      } else {
        data = Array.isArray(response.data) ? response.data : [];
        total = data.length; // Dự phòng
      }

      const mappedProducts = data.map((p: any, index: number) => ({
        ...p,
        id: (p.id || `product-${index}`).toString(),
        name: p.name || "Sản phẩm đồ chơi",
        price: p.price || 0,
        img: p.imageUrl || p.img || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        rating: p.rating || 5,
        reviews: p.reviews || Math.floor(Math.random() * 50) + 10,
        manufacturer: p.manufacturer || "ToyStore",
        minimumAge: p.minimumAge || 3,
        originalPrice: p.originalPrice || (p.price ? p.price * 1.2 : null),
        stockQuantity: p.stockQuantity ?? 10,
        categoryName: p.categoryName || "Đồ chơi"
      }));

      setProducts(mappedProducts);
      setTotalCount(total);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Cập nhật URL khi params thay đổi
    const newParams: any = { pageNumber, pageSize };
    if (keyword) newParams.keyword = keyword;
    if (categoryName) newParams.category = categoryName;
    if (minPrice) newParams.minPrice = minPrice;
    if (maxPrice) newParams.maxPrice = maxPrice;
    if (sortOrder) newParams.sortOrder = sortOrder;
    setSearchParams(newParams);
  }, [pageNumber, pageSize, keyword, categoryName, minPrice, maxPrice, sortOrder]);

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1);
    fetchProducts();
    setIsSidebarOpen(false);
  };

  const handleClearFilter = () => {
    setKeyword("");
    setCategoryName("");
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("");
    setPageNumber(1);
    setIsSidebarOpen(false);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="min-h-full bg-background flex flex-col">
      <TopBar />
      <Header onSearch={(k) => { setKeyword(k); setPageNumber(1); }} />
      <NavMenu />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Lọc - Desktop */}
          <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                <Filter size={18} className="text-primary" />
                <h2 className="font-bold text-lg">Bộ lọc tìm kiếm</h2>
              </div>

              <form onSubmit={handleApplyFilter} className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-3 block">Khoảng giá (VND)</label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Từ (ví dụ: 100000)"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="number"
                      placeholder="Đến (ví dụ: 500000)"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Gợi ý khoảng giá */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">Gợi ý khoảng giá</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice("");
                        setMaxPrice("");
                      }}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                        minPrice === "" && maxPrice === ""
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-secondary/50 border-transparent hover:border-primary/30 text-muted-foreground"
                      }`}
                    >
                      Tất cả giá
                    </button>
                    {[
                      { label: "0 - 100.000đ", min: "0", max: "100000" },
                      { label: "100.000đ - 200.000đ", min: "100000", max: "200000" },
                      { label: "200.000đ - 500.000đ", min: "200000", max: "500000" },
                      { label: "500.000đ - 1.000.000đ", min: "500000", max: "1000000" },
                      { label: "Trên 1.000.000đ", min: "1000000", max: "" },
                    ].map((range) => (
                      <button
                        key={range.label}
                        type="button"
                        onClick={() => {
                          setMinPrice(range.min);
                          setMaxPrice(range.max);
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                          minPrice === range.min && maxPrice === range.max
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-secondary/50 border-transparent hover:border-primary/30 text-muted-foreground"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-sm"
                  >
                    Áp dụng
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFilter}
                    className="w-full py-2.5 bg-secondary text-foreground font-bold rounded-lg hover:bg-border transition-colors text-sm"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </form>
            </div>
          </aside>

          {/* Danh sách sản phẩm */}
          <div className="flex-1">
            {/* Top Toolbar */}
            <div className="bg-card border border-border rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm font-bold"
                >
                  <SlidersHorizontal size={16} /> Lọc
                </button>
                <p className="text-sm text-muted-foreground">
                  Hiển thị <span className="font-bold text-foreground">{(pageNumber - 1) * pageSize + 1} - {Math.min(pageNumber * pageSize, totalCount)}</span> trong <span className="font-bold text-foreground">{totalCount}</span> sản phẩm
                </p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Sắp xếp:</span>
                  <select 
                    value={sortOrder}
                    onChange={(e) => { setSortOrder(e.target.value); setPageNumber(1); }}
                    className="bg-secondary border-none text-xs sm:text-sm font-bold rounded-lg p-2 outline-none cursor-pointer"
                  >
                    <option value="">Mới nhất</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Xem:</span>
                  <select 
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPageNumber(1); }}
                    className="bg-secondary border-none text-sm font-bold rounded-lg p-2 outline-none"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-secondary rounded-xl" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-card border border-dashed border-border rounded-2xl">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <X size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-muted-foreground">Vui lòng thử lại với bộ lọc hoặc từ khóa khác.</p>
                <button 
                  onClick={handleClearFilter}
                  className="mt-6 px-6 py-2 bg-primary text-white font-bold rounded-lg"
                >
                  Quay lại tất cả sản phẩm
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button 
                  disabled={pageNumber <= 1}
                  onClick={() => { setPageNumber(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || (page >= pageNumber - 1 && page <= pageNumber + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => { setPageNumber(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                            pageNumber === page 
                              ? "bg-primary text-white shadow-lg shadow-primary/30" 
                              : "bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-primary"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === pageNumber - 2 || page === pageNumber + 2) {
                      return <span key={page} className="px-1 text-muted-foreground">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  disabled={pageNumber >= totalPages}
                  onClick={() => { setPageNumber(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-card p-6 shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-xl">Bộ lọc</h2>
              <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleApplyFilter} className="space-y-8">
              <div>
                <label className="text-sm font-bold mb-4 block uppercase tracking-wider text-muted-foreground">Giá sản phẩm</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full h-12 px-4 bg-secondary border border-border rounded-xl outline-none"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full h-12 px-4 bg-secondary border border-border rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="h-12 bg-secondary text-foreground font-bold rounded-xl"
                >
                  Xóa
                </button>
                <button
                  type="submit"
                  className="h-12 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
                >
                  Áp dụng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductsPage;