import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/api';
import Sidebar from '../components/admin/Sidebar';
import ProductTable from '../components/admin/ProductTable';
import ProductModal from '../components/admin/ProductModal';

// Định nghĩa kiểu dữ liệu cho Product
export interface Product {
  id?: number | string;
  name: string;
  price: number;
  categoryId?: string;
  categoryName?: string;
  stockQuantity: number;
  imageUrl?: string | File | null;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0); 
  
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
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      const formData = createFormData(product);
      await api.put(`${API_ENDPOINT}/update-product`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Lỗi khi sửa sản phẩm:", error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await api.delete(`${API_ENDPOINT}/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-10 flex flex-col">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-500">Manage your store products</p>
          </div>
          <button 
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            + Add New Product
          </button>
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
