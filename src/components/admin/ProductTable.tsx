import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '../../pages/ProductManagement';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number | string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-5 font-semibold">Hình ảnh</th>
              <th className="px-6 py-5 font-semibold">Tên sản phẩm</th>
              <th className="px-6 py-5 font-semibold">Danh mục</th>
              <th className="px-6 py-5 font-semibold text-right">Giá gốc</th>
              <th className="px-6 py-5 font-semibold text-center">Giảm giá</th>
              <th className="px-6 py-5 font-semibold text-center">Tồn kho</th>
              <th className="px-6 py-5 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <img 
                      src={product.imageUrl ? (typeof product.imageUrl === 'string' ? product.imageUrl : URL.createObjectURL(product.imageUrl)) : 'https://via.placeholder.com/50'} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    <div>{product.name}</div>
                    {product.discountPrice && (
                      <div className="text-xs text-red-500 font-medium">
                        Giá bán: {product.discountPrice.toLocaleString('vi-VN')}₫
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {product.categoryName || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-400 line-through">
                    {Number(product.price || 0).toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.discountPercentage ? (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs font-black">
                        -{product.discountPercentage}%
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-medium ${product.stockQuantity < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => product.id && onDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;