import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Sidebar from '../components/admin/Sidebar';
import CategoryTable from '../components/admin/CategoryTable';
import CategoryModal from '../components/admin/CategoryModal';

interface Category {
  id?: string;
  categoryName: string;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const API_ENDPOINT = '/api/Categories';

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${API_ENDPOINT}/GetAll`);
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (category: Category) => {
    try {
      await api.post(API_ENDPOINT, {
        CategoryName: category.categoryName
      });
      fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
    }
  };

  const handleEditCategory = async (category: Category) => {
    try {
      // Gọi API PUT đến /api/Categories với các Key khớp DTO
      await api.put(`${API_ENDPOINT}/update`, {
        Id: category.id,
        CategoryName: category.categoryName
      });
      fetchCategories();
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Lỗi khi sửa danh mục:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await api.delete(`${API_ENDPOINT}/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
            <p className="text-gray-500">Manage your store categories</p>
          </div>
          <button 
            onClick={() => {
              setEditingCategory(null);
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            + Add New Category
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <CategoryTable 
            categories={categories} 
            onEdit={(c) => {
              setEditingCategory(c);
              setIsModalOpen(true);
            }} 
            onDelete={handleDeleteCategory} 
          />
        )}

        {isModalOpen && (
          <CategoryModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
            initialData={editingCategory}
          />
        )}
      </main>
    </div>
  );
};

export default CategoryManagement;
