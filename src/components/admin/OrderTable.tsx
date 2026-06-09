import React from 'react';
import { Eye, Edit, Phone } from 'lucide-react';

export interface Order {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  orderDate: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  status: string;
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
      case 'Chờ xác nhận': return 'bg-yellow-100 text-yellow-700';
      case 'Đã xác nhận': return 'bg-blue-100 text-blue-700';
      case 'Đang đóng gói': return 'bg-indigo-100 text-indigo-700';
      case 'Đang giao hàng': return 'bg-purple-100 text-purple-700';
      case 'Đã giao thành công': return 'bg-green-100 text-green-700';
      case 'Đã hủy': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-wider">
              <th className="px-4 py-5 font-semibold">Khách hàng</th>
              <th className="px-4 py-5 font-semibold">Ngày đặt</th>
              <th className="px-4 py-5 font-semibold text-right">Tổng tiền</th>
              <th className="px-4 py-5 font-semibold text-right">Giảm giá</th>
              <th className="px-4 py-5 font-semibold text-right">Thực thu</th>
              <th className="px-4 py-5 font-semibold text-center">Trạng thái</th>
              <th className="px-4 py-5 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-500 italic">
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors text-sm">
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-800">{order.customerName}</div>
                    {order.customerPhone && (
                      <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {order.customerPhone}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-500">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-600">
                    {Number(order.totalAmount || 0).toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-4 py-4 text-right text-red-500 font-medium">
                    -{Number(order.discount || 0).toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-4 py-4 text-right font-black text-indigo-600">
                    {Number(order.finalAmount || 0).toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      <button 
                        onClick={() => onViewDetail(order)}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(order)}
                        className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Cập nhật trạng thái"
                      >
                        <Edit size={16} />
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