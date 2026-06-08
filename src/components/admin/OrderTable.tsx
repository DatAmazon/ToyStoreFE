import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

export interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod?: string;
}

interface OrderTableProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onViewDetail, onUpdateStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-5 font-semibold">Order ID</th>
              <th className="px-6 py-5 font-semibold">Customer</th>
              <th className="px-6 py-5 font-semibold">Date</th>
              <th className="px-6 py-5 font-semibold">Total</th>
              <th className="px-6 py-5 font-semibold text-center">Status</th>
              <th className="px-6 py-5 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-indigo-600">#{order.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{order.customerName}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 font-black text-gray-800">
                    {order.totalAmount.toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => onViewDetail(order)}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(order)}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Update Status"
                      >
                        <Edit size={18} />
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

export default OrderTable;