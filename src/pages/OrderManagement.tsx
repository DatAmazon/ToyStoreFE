import React, { useState, useEffect } from 'react';
import Sidebar from '../components/admin/Sidebar';
import OrderTable, { Order } from '../components/admin/OrderTable';
import OrderDetailModal from '../components/admin/OrderDetailModal';
import { getMyOrders, cancelOrder } from '@/api/orderApi';
import { useToast } from '@/components/ui/Toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'update'>('view');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Lưu ý: Trong thực tế Admin cần API getAllOrders, 
      // nhưng ở đây tôi dùng my-orders theo document.md
      const response = await getMyOrders();
      
      // Map dữ liệu từ API sang Interface Order của Table
      const mappedOrders = response.data.map((o: any) => ({
        id: o.id,
        customerName: o.customerName || 'Khách hàng',
        orderDate: o.orderDate,
        totalAmount: o.totalAmount || 0,
        status: o.status,
        paymentMethod: o.paymentMethod || 'COD'
      }));
      
      setOrders(mappedOrders);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
      showToast("Không thể tải danh sách đơn hàng!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleOpenUpdate = (order: Order) => {
    setSelectedOrder(order);
    setModalMode('update');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      // Nếu trạng thái là Cancelled, gọi API cancel
      if (newStatus === 'Cancelled') {
        await cancelOrder(id);
      } else {
        // Giả sử có API update status chung, nếu không thì log thông báo
        console.log(`Cập nhật trạng thái ${id} thành ${newStatus}`);
      }
      
      showToast("Cập nhật trạng thái thành công!", "success");
      fetchOrders(); // Tải lại danh sách
      setIsModalOpen(false);
    } catch (error: any) {
      showToast(error.message || "Lỗi khi cập nhật trạng thái!", "error");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-10 flex flex-col">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-500">Track and update customer orders</p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Export CSV
          </button>
        </header>

        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <OrderTable 
              orders={orders} 
              onViewDetail={handleViewDetail}
              onUpdateStatus={handleOpenUpdate}
            />
          )}
        </div>

        <OrderDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
          mode={modalMode}
          onUpdateSubmit={handleUpdateStatus}
        />
      </main>
    </div>
  );
};

export default OrderManagement;