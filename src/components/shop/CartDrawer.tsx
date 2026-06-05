import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CreditCard, Truck, CheckCircle2, Maximize2 } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import Modal from '@/components/ui/Modal';
import { useCart } from '@/api/CartContext';
import { useToast } from '@/components/ui/Toast';
import './CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'cart' | 'checkout' | 'success';

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const qrUrl = `https://img.vietqr.io/image/MB-123456789-compact2.png?amount=${subtotal}&addInfo=THANH TOAN DON HANG ${formData.phone || ''}&accountName=TOY STORE MANAGEMENT`;

  const handleCompleteOrder = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      showToast("Vui lòng nhập đầy đủ thông tin giao hàng!", "error");
      return;
    }
    setStep('success');
    showToast("Đặt hàng thành công! Cảm ơn bạn.", "success");
    clearCart();
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      if (step === 'success') setStep('cart');
      setIsQRModalOpen(false);
    }, 300);
  };

  return (
    <>
      <Drawer 
        isOpen={isOpen} 
        onClose={resetAndClose} 
        title={step === 'checkout' ? 'Thông tin thanh toán' : step === 'success' ? 'Đặt hàng thành công' : 'Giỏ hàng của bạn'}
      >
        <div className="flex flex-col h-full">
          {step === 'cart' && (
            cartItems.length > 0 ? (
              <>
                <div className="flex-1 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item animate-in fade-in slide-in-from-right-4 duration-300">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                      <div className="cart-item-info">
                        <div className="flex justify-between gap-2">
                          <h3 className="cart-item-name">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <div className="quantity-control">
                            <button onClick={() => updateQuantity(item.id, -1)} className="quantity-btn" disabled={item.quantity <= 1}>
                              <Minus size={12} />
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="quantity-btn">
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="cart-item-price">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-500"><span>Tạm tính:</span><span>{subtotal.toLocaleString('vi-VN')}₫</span></div>
                    <div className="flex justify-between text-sm text-gray-500"><span>Phí vận chuyển:</span><span className="text-green-600 font-medium">Miễn phí</span></div>
                    <div className="cart-total-row border-t pt-3 mt-3"><span className="cart-total-label text-black">Tổng tiền:</span><span className="cart-total-price">{subtotal.toLocaleString('vi-VN')}₫</span></div>
                  </div>
                  <button onClick={() => setStep('checkout')} className="checkout-btn">Tiến hành thanh toán</button>
                  <button onClick={onClose} className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-black transition-colors font-medium">Tiếp tục mua sắm</button>
                </div>
              </>
            ) : (
              <div className="empty-cart animate-in fade-in duration-500">
                <div className="bg-gray-50 p-6 rounded-full mb-6"><ShoppingBag className="empty-cart-icon text-gray-300" size={48} /></div>
                <p className="text-lg font-bold text-gray-700 mb-2">Giỏ hàng trống</p>
                <button onClick={onClose} className="px-10 py-3 bg-[#E5528F] text-white rounded-full font-bold uppercase text-xs tracking-widest hover:bg-[#d13d7a] transition-all">Mua sắm ngay</button>
              </div>
            )
          )}

          {step === 'checkout' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex-1 overflow-y-auto">
                <div className="checkout-form">
                  <button onClick={() => setStep('cart')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-2 transition-colors">
                    <ArrowLeft size={16} /> Quay lại giỏ hàng
                  </button>
                  
                  <div className="form-group">
                    <label className="form-label">Họ và tên</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nhập họ tên của bạn" className="form-input" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Nhập số điện thoại" className="form-input" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Địa chỉ nhận hàng</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange as any} placeholder="Địa chỉ cụ thể (Số nhà, đường, phường/xã...)" className="form-input min-h-[80px]" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phương thức thanh toán</label>
                    <div className="payment-methods">
                      <div className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setPaymentMethod('cod')}>
                        <div className="payment-icon-wrapper"><Truck size={20} /></div>
                        <div className="payment-info">
                          <h4>Thanh toán khi nhận hàng (COD)</h4>
                          <p>Bạn sẽ thanh toán tiền mặt khi shipper giao hàng</p>
                        </div>
                      </div>
                      
                      <div className={`payment-option ${paymentMethod === 'bank' ? 'active' : ''}`} onClick={() => setPaymentMethod('bank')}>
                        <div className="payment-icon-wrapper"><CreditCard size={20} /></div>
                        <div className="payment-info">
                          <h4>Chuyển khoản ngân hàng</h4>
                          <p>Thanh toán qua số tài khoản ngân hàng</p>
                        </div>
                      </div>

                      {paymentMethod === 'bank' && (
                        <div className="bank-details">
                          <div 
                            className="qr-code-wrapper relative group cursor-pointer"
                            onClick={() => setIsQRModalOpen(true)}
                          >
                            <img 
                              src={qrUrl}
                              alt="QR Code Thanh Toán" 
                              className="qr-code-img transition-opacity group-hover:opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-lg">
                              <Maximize2 className="text-white" size={24} />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 text-center font-medium">Nhấn để phóng to</p>
                          </div>
                          <div className="bank-info-text">
                            <p className="font-bold text-gray-700 mb-1">Thông tin chuyển khoản:</p>
                            <p>Ngân hàng: <strong>MB Bank</strong></p>
                            <p>Số TK: <strong>123456789</strong></p>
                            <p>Chủ TK: <strong>TOY STORE MANAGEMENT</strong></p>
                            <p>Nội dung: <strong>TT {formData.phone || '[SĐT của bạn]'}</strong></p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="cart-footer border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Tổng thanh toán:</span>
                  <span className="text-xl font-extrabold text-[#E5528F]">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <button onClick={handleCompleteOrder} className="checkout-btn">Hoàn tất đặt hàng</button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="success-view animate-in zoom-in duration-500">
              <div className="success-icon-circle"><CheckCircle2 size={48} /></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
              <p className="text-gray-500 mb-8 max-w-[280px]">Cảm ơn bạn đã tin tưởng mua sắm. Đơn hàng của bạn đang được xử lý.</p>
              <button onClick={resetAndClose} className="px-10 py-3 bg-[#E5528F] text-white rounded-full font-bold uppercase text-xs tracking-widest hover:bg-[#d13d7a] transition-all">Quay lại trang chủ</button>
            </div>
          )}
        </div>
      </Drawer>

      <Modal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} className="max-w-[400px]">
        <div className="p-8 flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-tight">Quét mã để thanh toán</h3>
          <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 mb-6"><img src={qrUrl} alt="QR Code Zoom" className="w-full h-auto max-w-[280px]" /></div>
          <div className="w-full space-y-3 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Số tiền:</span><span className="font-bold text-[#E5528F]">{subtotal.toLocaleString('vi-VN')}₫</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Nội dung:</span><span className="font-bold text-gray-800 uppercase">TT {formData.phone || ''}</span></div>
            <div className="pt-2 border-t border-gray-200"><p className="text-[11px] text-gray-400 text-center italic">Sử dụng ứng dụng Ngân hàng hoặc Ví điện tử để quét mã</p></div>
          </div>
          <button onClick={() => setIsQRModalOpen(false)} className="mt-8 w-full py-3 border-2 border-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all uppercase text-xs tracking-widest">Đóng</button>
        </div>
      </Modal>
    </>
  );
};

export default CartDrawer;
