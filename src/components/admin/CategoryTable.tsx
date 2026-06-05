import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  categoryName: string;
}

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-sm uppercase tracking-wider">
              <th className="px-8 py-5 font-semibold">ID</th>
              <th className="px-8 py-5 font-semibold">Category Name</th>
              <th className="px-8 py-5 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-8 py-10 text-center text-gray-500 italic">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 text-gray-500 text-sm">{category.id}</td>
                  <td className="px-8 py-4 font-bold text-gray-800">{category.categoryName}</td>
                  <td className="px-8 py-4">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => onEdit(category)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(category.id)}
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

export default CategoryTable;
