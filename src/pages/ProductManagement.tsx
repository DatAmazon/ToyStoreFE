import React, { useState, useEffect } from 'react';
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

  // URL API của bạn
  const API_ENDPOINT = '/api/Products'; 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get(API_ENDPOINT);
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createFormData = (product: Product) => {
    const data = new FormData();
    if (product.id) data.append('Id', product.id.toString());
    data.append('Name', product.name);
    data.append('Price', product.price.toString());
    data.append('CategoryId', product.categoryId || '');
    data.append('StockQuantity', product.stockQuantity.toString());
    
    // Gửi File ảnh nếu có, nếu không thì gửi string path cũ
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

      <main className="flex-1 p-4 md:p-6 lg:p-10">
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <ProductTable 
            products={products} 
            onEdit={(p) => {
              setEditingProduct(p);
              setIsModalOpen(true);
            }} 
            onDelete={handleDeleteProduct} 
          />
        )}

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
