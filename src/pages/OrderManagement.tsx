import React, { useState, useEffect } from 'react';
import Sidebar from '../components/admin/Sidebar';
import OrderTable, { Order } from '../components/admin/OrderTable';
import OrderDetailModal from '../components/admin/OrderDetailModal';
import { getAllOrdersAdmin, updateOrderStatusAdmin } from '@/api/orderApi';
import { exportOrdersReportExcel } from '@/api/reportApi';
import { useToast } from '@/components/ui/Toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'update'>('view');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrdersAdmin();
      // Đảm bảo dữ liệu luôn là mảng và có các giá trị mặc định
      const safeData = (response.data || []).map((o: any) => ({
        ...o,
        orderId: o.orderId || o.id || 'N/A',
        customerName: o.customerName || 'Anonymous',
        customerPhone: o.customerPhone || '',
        totalAmount: o.totalAmount ?? 0,
        discount: o.discount ?? 0,
        finalAmount: o.finalAmount ?? (o.totalAmount || 0),
        status: o.status || 'Chờ xác nhận',
        orderDate: o.orderDate || new Date().toISOString()
      }));
      setOrders(safeData);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
      showToast("Không thể tải danh sách đơn hàng!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportOrdersReportExcel();
      showToast("Xuất báo cáo thành công!", "success");
    } catch (error: any) {
      showToast("Lỗi khi xuất báo cáo!", "error");
    } finally {
      setExporting(false);
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
      await updateOrderStatusAdmin(id, newStatus);
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
            <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
            <p className="text-gray-500">Theo dõi và cập nhật trạng thái đơn hàng</p>
          </div>
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            )}
            {exporting ? 'Exporting...' : 'Xuất Excel'}
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
          onUpdateSubmit={(orderId, newStatus) => handleUpdateStatus(orderId, newStatus)}
        />
      </main>
    </div>
  );
};

export default OrderManagement;