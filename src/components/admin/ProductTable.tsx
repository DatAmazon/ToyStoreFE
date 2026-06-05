import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '../../pages/ProductManagement';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-sm uppercase tracking-wider">
              <th className="px-8 py-5 font-semibold">Image</th>
              <th className="px-8 py-5 font-semibold">Product Name</th>
              <th className="px-8 py-5 font-semibold">Category</th>
              <th className="px-8 py-5 font-semibold text-right">Price</th>
              <th className="px-8 py-5 font-semibold text-center">Stock Quantity</th>
              <th className="px-8 py-5 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-gray-500 italic">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4">
                    <img 
                      src={product.imageUrl || 'https://via.placeholder.com/50'} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                  </td>
                  <td className="px-8 py-4 font-bold text-gray-800">{product.name}</td>
                  <td className="px-8 py-4 text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {product.categoryName}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right font-semibold text-indigo-600">
                    ${Number(product.price).toLocaleString()}
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className={`font-medium ${product.stockQuantity < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => product.id && onDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
