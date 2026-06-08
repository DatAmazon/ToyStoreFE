import React, { useState, useEffect } from 'react';
import { X, Package, Truck, User } from 'lucide-react';
import { Order } from './OrderTable';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  mode: 'view' | 'update';
  onUpdateSubmit?: (id: string, newStatus: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order, mode, onUpdateSubmit }) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSubmit) {
      onUpdateSubmit(order.id, status);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              {mode === 'view' ? 'Order Details' : 'Update Order Status'}
            </h2>
            <p className="text-sm text-gray-500 font-mono mt-1">ID: {order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-gray-50/50">
          
          {/* Customer Info */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Customer Information</h3>
              <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {order.customerName}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Date:</span> {new Date(order.orderDate).toLocaleString('vi-VN')}</p>
            </div>
          </div>

          {mode === 'update' ? (
            <form id="status-form" onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Truck size={18} className="text-orange-500" />
                Order Status
              </h3>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </form>
          ) : (
             <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-indigo-500" />
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Current Status:</span>
                    <span className="font-bold text-gray-800">{order.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="font-bold text-gray-800">{order.paymentMethod || 'COD'}</span>
                  </div>
                  <div className="pt-3 border-t border-dashed mt-3 flex justify-between items-end">
                    <span className="font-bold text-gray-800">Total Amount:</span>
                    <span className="text-xl font-black text-indigo-600">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
             </div>
          )}

        </div>

        <div className="p-4 border-t bg-white flex justify-end gap-3 flex-shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </button>
          {mode === 'update' && (
            <button 
              type="submit"
              form="status-form"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              Save Changes
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderDetailModal;