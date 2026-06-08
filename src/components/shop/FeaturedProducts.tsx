import { useEffect, useState } from "react";
import api from "@/api/api";
import { ChevronRight, ChevronLeft, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ProductCard, { Product } from "./ProductCard";

interface SectionProps {
  title: string;
  subtitle?: string;
  items: Product[];
  viewAll?: string;
}

const ProductSection = ({ title, subtitle, items, viewAll = "#" }: SectionProps) => (
  <div className="space-y-6">
    <div className="bg-card border border-border rounded-lg p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
          <span className="w-1.5 h-6 bg-primary rounded-full inline-block" />
          {title}
        </h2>
        {subtitle && <p className="text-muted-foreground text-base md:text-lg mt-1">{subtitle}</p>}
      </div>
      <a
        href={viewAll}
        className="flex items-center gap-1.5 text-primary text-sm md:text-base font-bold hover:bg-primary/5 px-4 py-2 rounded-lg border border-primary/20 transition-all w-fit"
      >
        Xem tất cả <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </a>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
    {items.length === 0 && (
      <div className="text-center py-10 bg-secondary/10 rounded-xl border border-dashed border-border">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
      </div>
    )}
  </div>
);

interface FeaturedProductsProps {
  keyword?: string;
}

const FeaturedProducts = ({ keyword = "" }: FeaturedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // States cho bộ lọc kết hợp
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sort) params.append("sort", sort);
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
        total = data.length;
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
      console.error("Lỗi khi kết nối API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, pageSize, keyword, minPrice, maxPrice, sort]);

  // Reset về trang 1 khi lọc thay đổi
  useEffect(() => {
    setPageNumber(1);
  }, [keyword, minPrice, maxPrice, sort]);

  const hasFilter = keyword || minPrice || maxPrice || sort;

  if (loading && pageNumber === 1) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground text-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span>Đang tải danh sách sản phẩm...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Toolbar bộ lọc kết hợp */}
      <div className="bg-white border border-border rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isFilterVisible ? 'bg-primary text-white' : 'bg-secondary text-foreground hover:bg-border'}`}
            >
              <Filter size={16} /> {isFilterVisible ? 'Đóng bộ lọc' : 'Lọc giá'}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sắp xếp:</span>
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-secondary border-none text-sm font-bold rounded-xl p-2 outline-none cursor-pointer focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Mặc định (Tên)</option>
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Tìm thấy <span className="font-bold text-foreground">{totalCount}</span> sản phẩm
          </div>
        </div>

        {/* Khối nhập giá nhanh */}
        {isFilterVisible && (
          <div className="pt-4 border-t border-dashed border-border animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-secondary p-1 rounded-xl border border-border">
                <input
                  type="number"
                  placeholder="Giá từ..."
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-28 bg-transparent px-3 py-1.5 text-sm outline-none"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  placeholder="Đến..."
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-28 bg-transparent px-3 py-1.5 text-sm outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Dưới 100k", min: "0", max: "100000" },
                  { label: "100k - 500k", min: "100000", max: "500000" },
                  { label: "Trên 500k", min: "500000", max: "" }
                ].map(range => (
                  <button
                    key={range.label}
                    onClick={() => { setMinPrice(range.min); setMaxPrice(range.max); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${minPrice === range.min && maxPrice === range.max ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-border text-muted-foreground hover:border-primary/50'}`}
                  >
                    {range.label}
                  </button>
                ))}
                {(minPrice || maxPrice || sort || keyword) && (
                  <button 
                    onClick={() => { setMinPrice(""); setMaxPrice(""); setSort(""); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-destructive hover:bg-destructive/10"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kết quả hiển thị */}
      {hasFilter ? (
        <div id="featured-products" className="scroll-mt-24">
          <ProductSection
            title={keyword ? `Tìm kiếm: "${keyword}"` : "Kết quả lọc sản phẩm"}
            subtitle={`Hiển thị ${products.length} sản phẩm phù hợp`}
            items={products}
          />
        </div>
      ) : (
        <>
          {/* Mặc định hiện 3 section khi không có filter */}
          <div id="featured-products" className="scroll-mt-24">
            <ProductSection
              title="Sản phẩm nổi bật"
              subtitle="Được khách hàng tin dùng và đánh giá cao nhất"
              items={products.slice(0, 4)}
            />
          </div>
          
          <ProductSection
            title="Flash Sale hôm nay"
            subtitle="Ưu đãi giảm giá sâu - Số lượng có hạn!"
            items={products.slice(4, 8)}
          />

          <ProductSection
            title="Khám phá tất cả"
            subtitle="Hàng ngàn đồ chơi hấp dẫn đang chờ bạn"
            items={products}
          />
        </>
      )}

      {/* Pagination UI */}
      {totalCount > pageSize && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between bg-card px-6 py-4 rounded-xl border border-border shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-medium">Hiển thị:</span>
            <select 
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-secondary border border-border text-foreground text-sm rounded-lg p-1.5 outline-none font-bold"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button 
              disabled={pageNumber <= 1}
              onClick={() => { setPageNumber(prev => prev - 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground disabled:opacity-30 border border-border"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const range = 1; 
                const totalPages = Math.ceil(totalCount / pageSize);
                for (let i = 1; i <= totalPages; i++) {
                  if (i === 1 || i === totalPages || (i >= pageNumber - range && i <= pageNumber + range)) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => { setPageNumber(i); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${pageNumber === i ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary hover:text-primary"}`}
                      >
                        {i}
                      </button>
                    );
                  } else if (i === pageNumber - range - 1 || i === pageNumber + range + 1) {
                    pages.push(<span key={i} className="px-1 text-muted-foreground">...</span>);
                  }
                }
                return pages;
              })()}
            </div>

            <button 
              disabled={pageNumber >= Math.ceil(totalCount / pageSize)} 
              onClick={() => { setPageNumber(prev => prev + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground disabled:opacity-30 border border-border"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;