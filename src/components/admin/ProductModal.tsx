import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Product } from '../../pages/ProductManagement';
import api from '../../api/api';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  initialData: Product | null;
}

interface Category {
  id: string;
  categoryName: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: 0,
    categoryId: '',
    stockQuantity: 0,
    imageUrl: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/Categories/GetAll');
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        categoryId: initialData.categoryId || '',
      });
      setPreview(typeof initialData.imageUrl === 'string' ? initialData.imageUrl : '');
    } else {
      setFormData({ name: '', price: 0, categoryId: '', stockQuantity: 0, imageUrl: '' });
      setPreview('');
    }
  }, [initialData]);

  // Logic xử lý chọn Category mặc định hoặc hiển thị Category hiện có
  useEffect(() => {
    if (categories.length > 0) {
      if (initialData && !formData.categoryId) {
        // Trường hợp Sửa: Tìm ID dựa trên categoryName nếu categoryId đang trống
        const matchingCategory = categories.find(c => c.categoryName === initialData.categoryName);
        if (matchingCategory) {
          setFormData(prev => ({ ...prev, categoryId: matchingCategory.id }));
        }
      } else if (!initialData && !formData.categoryId) {
        // Trường hợp Thêm mới: Chọn mặc định "Búp bê & Thú bông"
        const defaultCategory = categories.find(c => c.categoryName === "Búp bê & Thú bông");
        if (defaultCategory) {
          setFormData(prev => ({ ...prev, categoryId: defaultCategory.id }));
        }
      }
    }
  }, [categories, initialData]);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, imageUrl: file });
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please upload an image file (png, jpg, etc.)");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: null });
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Product Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            
            {preview ? (
              <div className="relative group rounded-2xl overflow-hidden border-2 border-indigo-100 h-48 bg-gray-50">
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-white text-indigo-600 rounded-full hover:scale-110 transition-transform shadow-lg"
                    title="Change Image"
                  >
                    <Upload size={20} />
                  </button>
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="p-3 bg-white text-red-500 rounded-full hover:scale-110 transition-transform shadow-lg"
                    title="Remove Image"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200
                  ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-gray-100'}
                `}
              >
                <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-gray-400'} shadow-sm`}>
                  <ImageIcon size={32} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-700">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (Max 2MB recommended)</p>
                </div>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={onFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter product name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input 
                required
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input 
                required
                type="number" 
                value={formData.stockQuantity}
                onChange={(e) => setFormData({...formData, stockQuantity: Number(e.target.value)})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            >
              {/* <option value="">Select Category</option> */}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex gap-3 sticky bottom-0 bg-white pb-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              {initialData ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
