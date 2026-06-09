import React, { useState, useEffect } from 'react';
import { X, Package, Truck, User, MapPin, Phone, CreditCard, ShoppingBag } from 'lucide-react';
import { Order } from './OrderTable';
import { getOrderDetailAdmin, AdminOrderDetail } from '@/api/orderApi';
import { exportInvoicePDF } from '@/api/reportApi';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  mode: 'view' | 'update';
  onUpdateSubmit?: (id: string, newStatus: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order, mode, onUpdateSubmit }) => {
  const [status, setStatus] = useState('');
  const [detailedOrder, setDetailedOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      if (mode === 'view' && isOpen) {
        fetchDetail();
      }
    }
  }, [order, isOpen, mode]);

  const fetchDetail = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const response = await getOrderDetailAdmin(order.orderId);
      setDetailedOrder(response.data);
    } catch (error) {
      console.error("Error fetching order detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportInvoice = async () => {
    if (!order) return;
    setExporting(true);
    try {
      await exportInvoicePDF(order.orderId);
    } catch (error) {
      console.error("Error exporting invoice:", error);
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSubmit) {
      onUpdateSubmit(order.orderId, status);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              {mode === 'view' ? 'Chi tiết đơn hàng' : 'Cập nhật trạng thái'}
            </h2>
            <p className="text-sm text-gray-500 font-mono mt-1">ID: {order.orderId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-gray-50/50">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <User size={18} className="text-indigo-500" />
                Thông tin khách hàng
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                   <span className="font-medium text-gray-400 w-20">Tên:</span> {order.customerName}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                   <Phone size={14} className="text-gray-400" />
                   <span className="font-medium text-gray-400 w-14">SĐT:</span> {order.customerPhone || 'N/A'}
                </p>
                {detailedOrder && (
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5" />
                    <span className="font-medium text-gray-400 w-14">Địa chỉ:</span> 
                    <span className="flex-1">{detailedOrder.shippingAddress}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <Package size={18} className="text-indigo-500" />
                Tóm tắt đơn hàng
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ngày đặt:</span>
                  <span className="font-medium">{new Date(order.orderDate).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-500">Trạng thái:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Thanh toán:</span>
                  <span className="font-medium flex items-center gap-1">
                    <CreditCard size={14} /> COD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {mode === 'update' ? (
            <form id="status-form" onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Truck size={18} className="text-orange-500" />
                Thay đổi trạng thái
              </h3>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              >
                <option value="Chờ xác nhận">Chờ xác nhận</option>
                <option value="Đã xác nhận">Đã xác nhận</option>
                <option value="Đang đóng gói">Đang đóng gói</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Đã giao thành công">Đã giao thành công</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </form>
          ) : (
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <h3 className="font-bold text-gray-800 p-5 bg-gray-50/50 flex items-center gap-2 border-b">
                  <ShoppingBag size={18} className="text-indigo-500" />
                  Sản phẩm trong đơn
                </h3>
                
                {loading ? (
                  <div className="p-10 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : detailedOrder ? (
                  <div className="divide-y divide-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                          <tr>
                            <th className="px-5 py-3 font-semibold">Tên sản phẩm</th>
                            <th className="px-5 py-3 font-semibold text-center">SL</th>
                            <th className="px-5 py-3 font-semibold text-right">Giá</th>
                            <th className="px-5 py-3 font-semibold text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {detailedOrder.details.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50/50">
                              <td className="px-5 py-4 font-medium text-gray-800">{item.productName}</td>
                              <td className="px-5 py-4 text-center text-gray-600">{item.quantity}</td>
                              <td className="px-5 py-4 text-right text-gray-600">{item.price.toLocaleString('vi-VN')}₫</td>
                              <td className="px-5 py-4 text-right font-bold text-gray-800">{item.subTotal.toLocaleString('vi-VN')}₫</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50/50">
                          <tr>
                            <td colSpan={3} className="px-5 py-3 text-right text-gray-500">Tổng tiền</td>
                            <td className="px-5 py-3 text-right font-bold text-gray-800">{detailedOrder.totalAmount.toLocaleString('vi-VN')}₫</td>
                          </tr>
                          {detailedOrder.discount > 0 && (
                            <tr>
                              <td colSpan={3} className="px-5 py-3 text-right text-gray-500">Giảm giá</td>
                              <td className="px-5 py-3 text-right font-bold text-red-500">-{detailedOrder.discount.toLocaleString('vi-VN')}₫</td>
                            </tr>
                          )}
                          <tr className="border-t">
                            <td colSpan={3} className="px-5 py-4 text-right font-bold text-gray-800 text-base">Thực thu</td>
                            <td className="px-5 py-4 text-right font-black text-indigo-600 text-lg">{detailedOrder.finalAmount.toLocaleString('vi-VN')}₫</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center text-gray-400 italic">
                    Không thể tải chi tiết đơn hàng.
                  </div>
                )}
             </div>
          )}

        </div>

        <div className="p-4 border-t bg-white flex justify-end gap-3 flex-shrink-0">
          {mode === 'view' && (
            <button 
              onClick={handleExportInvoice}
              disabled={exporting}
              className="px-6 py-2.5 rounded-xl font-bold text-indigo-600 border border-indigo-100 hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {exporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              ) : (
                <CreditCard size={18} />
              )}
              {exporting ? 'Exporting...' : 'Xuất hóa đơn (PDF)'}
            </button>
          )}
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {mode === 'view' ? 'Đóng' : 'Hủy'}
          </button>
          {mode === 'update' && (
            <button 
              type="submit"
              form="status-form"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              Lưu thay đổi
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderDetailModal;