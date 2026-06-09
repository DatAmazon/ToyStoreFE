import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/api';
import Sidebar from '../components/admin/Sidebar';
import ProductTable from '../components/admin/ProductTable';
import ProductModal from '../components/admin/ProductModal';
import { exportInventoryReportExcel, exportInventoryReportPDF } from '@/api/reportApi';
import { useToast } from '@/components/ui/Toast';
import { FileText, Table } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0); 
  const { showToast } = useToast();

  const handleExport = async (type: 'excel' | 'pdf') => {
    setExporting(type);
    try {
      if (type === 'excel') await exportInventoryReportExcel();
      else await exportInventoryReportPDF();
      showToast("Xuất báo cáo tồn kho thành công!", "success");
    } catch (error) {
      showToast("Lỗi khi xuất báo cáo!", "error");
    } finally {
      setExporting(null);
    }
  };
  
  // Pagination State
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const API_ENDPOINT = '/api/Products'; 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${API_ENDPOINT}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      
      // Xử lý dữ liệu động dựa trên kết quả trả về
      if (response.data && response.data.data) {
        setProducts(response.data.data);
        setTotalCount(response.data.totalCount || 0);
      } else {
        // Fallback nếu API trả về mảng trực tiếp
        const data = response.data;
        setProducts(data);
        
        // Logic tự động tính toán số trang dựa trên dữ liệu hiện có
        if (data.length < pageSize) {
          setTotalCount((pageNumber - 1) * pageSize + data.length);
        } else {
          // Nếu lấy đủ pageSize, giả định vẫn còn ít nhất 1 trang nữa (hoặc chính xác hơn nếu backend trả TotalCount)
          setTotalCount(pageNumber * pageSize + 1); 
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán tổng số trang dựa trên totalCount thực tế
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, pageSize]);

  const createFormData = (product: Product) => {
    const data = new FormData();
    if (product.id) data.append('Id', product.id.toString());
    data.append('Name', product.name);
    data.append('Price', product.price.toString());
    if (product.discountPrice !== undefined && product.discountPrice !== null) {
      data.append('DiscountPrice', product.discountPrice.toString());
    }
    if (product.discountPercentage !== undefined && product.discountPercentage !== null) {
      data.append('DiscountPercentage', product.discountPercentage.toString());
    }
    data.append('CategoryId', product.categoryId || '');
    data.append('StockQuantity', product.stockQuantity.toString());
    
    if (product.imageUrl instanceof File) {
      data.append('Image', product.imageUrl);
    } else if (typeof product.imageUrl === 'string') {
      data.append('ImageUrl', product.imageUrl);
    }
    
    return data;
  };

  const handleAddProduct = async (product: Product) => {
    try {
      const formData = createFormData(product);
      await api.post(API_ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast("Thêm sản phẩm thành công!", "success");
      fetchProducts();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      showToast(error.message || "Lỗi khi thêm sản phẩm!", "error");
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      const formData = createFormData(product);
      // Theo document.md, endpoint cập nhật là PUT /api/Products/{id}
      await api.put(`${API_ENDPOINT}/${product.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast("Cập nhật sản phẩm thành công!", "success");
      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error("Lỗi khi sửa sản phẩm:", error);
      showToast(error.message || "Lỗi khi cập nhật sản phẩm!", "error");
    }
  };

  const handleDeleteProduct = async (id: number | string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await api.delete(`${API_ENDPOINT}/${id}`);
        showToast("Xóa sản phẩm thành công!", "success");
        fetchProducts();
      } catch (error: any) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        showToast(error.message || "Lỗi khi xóa sản phẩm!", "error");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-10 flex flex-col">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
            <p className="text-gray-500">Quản lý kho hàng và thông tin sản phẩm</p>
          </div>
          <div className="flex gap-3">
            <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm">
               <button 
                onClick={() => handleExport('excel')}
                disabled={!!exporting}
                className="bg-white text-gray-700 px-4 py-2.5 font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 border-r border-gray-200 disabled:opacity-50"
                title="Xuất báo cáo Excel"
              >
                {exporting === 'excel' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                ) : (
                  <Table size={18} className="text-green-600" />
                )}
                Excel
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                disabled={!!exporting}
                className="bg-white text-gray-700 px-4 py-2.5 font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                title="Xuất báo cáo PDF"
              >
                {exporting === 'pdf' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                ) : (
                  <FileText size={18} className="text-red-600" />
                )}
                PDF
              </button>
            </div>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              + Thêm sản phẩm mới
            </button>
          </div>
        </header>

        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <ProductTable 
                products={products} 
                onEdit={(p) => {
                  setEditingProduct(p);
                  setIsModalOpen(true);
                }} 
                onDelete={handleDeleteProduct} 
              />
              
              {/* Pagination UI */}
              <div className="mt-8 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 font-medium">Rows per page:</span>
                  <select 
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPageNumber(1); 
                    }}
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-1.5 outline-none font-bold"
                  >
                    <option value={2}>2</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(prev => prev - 1)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = [];
                      const range = 2; 

                      for (let i = 1; i <= totalPages; i++) {
                        if (
                          i === 1 || 
                          i === totalPages || 
                          (i >= pageNumber - range && i <= pageNumber + range)
                        ) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => setPageNumber(i)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                                pageNumber === i 
                                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                                  : "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                              }`}
                            >
                              {i}
                            </button>
                          );
                        } else if (
                          i === pageNumber - range - 1 || 
                          i === pageNumber + range + 1
                        ) {
                          pages.push(
                            <span key={i} className="px-1 text-gray-400 font-medium">...</span>
                          );
                        }
                      }
                      return pages;
                    })()}
                  </div>

                  <button 
                    disabled={pageNumber >= totalPages} 
                    onClick={() => setPageNumber(prev => prev + 1)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {isModalOpen && (
          <ProductModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            initialData={editingProduct}
          />
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
