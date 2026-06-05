import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CreditCard, Truck, CheckCircle2, Maximize2, ShoppingCart } from 'lucide-react';
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
        title={step === 'checkout' ? 'Thanh toán đơn hàng' : step === 'success' ? 'Hoàn tất' : 'Giỏ hàng của bạn'}
      >
        <div className="cart-drawer-content">
          {step === 'cart' && (
            cartItems.length > 0 ? (
              <>
                <div className="cart-items-container">
                  <div className="flex items-center gap-2 py-2 mb-2">
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {cartItems.length} sản phẩm
                    </span>
                  </div>
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item-card animate-slide-in-from-right">
                      <div className="cart-item-image-wrapper">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <h3 className="cart-item-name">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="cart-item-remove-btn">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="cart-item-footer">
                          <div className="modern-quantity-control">
                            <button onClick={() => updateQuantity(item.id, -1)} className="modern-quantity-btn" disabled={item.quantity <= 1}>
                              <Minus size={10} strokeWidth={3} />
                            </button>
                            <span className="modern-quantity-value">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="modern-quantity-btn">
                              <Plus size={10} strokeWidth={3} />
                            </button>
                          </div>
                          
                          <div className="cart-item-price-info">
                            <span className="cart-item-total-price">Thành tiền</span>
                            <span className="cart-item-current-price">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cart-summary-footer">
                  <div className="space-y-2.5">
                    <div className="summary-row">
                      <span className="summary-label">Tạm tính</span>
                      <span className="summary-value text-foreground/80">{subtotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Phí vận chuyển</span>
                      <span className="summary-value text-green-500 font-black tracking-tight">MIỄN PHÍ</span>
                    </div>
                    <div className="summary-total-row">
                      <span className="summary-total-label">Tổng cộng</span>
                      <span className="summary-total-price">{subtotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                  
                  <button onClick={() => setStep('checkout')} className="modern-checkout-btn group">
                    Tiến hành đặt hàng
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={onClose} className="modern-secondary-btn">
                    Tiếp tục mua sắm
                  </button>
                </div>
              </>
            ) : (
              <div className="modern-empty-cart">
                <div className="empty-cart-illustration">
                  <div className="illustration-bg" />
                  <ShoppingBag className="empty-icon" size={80} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">Giỏ hàng của bạn đang trống</h3>
                <p className="text-muted-foreground text-sm mb-8 max-w-[240px]">
                  Có vẻ như bạn chưa chọn được món đồ len ưng ý nào cho mình.
                </p>
                <button onClick={onClose} className="modern-checkout-btn max-w-[240px]">
                  Bắt đầu mua sắm
                </button>
              </div>
            )
          )}

          {step === 'checkout' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="modern-form-section">
                  <button onClick={() => setStep('cart')} className="flex items-center gap-2 text-xs font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-2">
                    <ArrowLeft size={14} strokeWidth={3} /> Quay lại giỏ hàng
                  </button>
                  
                  <div className="modern-form-group">
                    <label className="modern-label">Thông tin người nhận</label>
                    <div className="space-y-3">
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Họ và tên của bạn" className="modern-input" />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Số điện thoại liên hệ" className="modern-input" />
                    </div>
                  </div>
                  
                  <div className="modern-form-group">
                    <label className="modern-label">Địa chỉ giao hàng</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange as any} placeholder="Địa chỉ cụ thể (Số nhà, đường, phường/xã...)" className="modern-input min-h-[100px] resize-none" />
                  </div>

                  <div className="modern-form-group">
                    <label className="modern-label">Hình thức thanh toán</label>
                    <div className="modern-payment-grid">
                      <div className={`modern-payment-card ${paymentMethod === 'cod' ? 'active' : ''}`} onClick={() => setPaymentMethod('cod')}>
                        <div className="payment-card-icon"><Truck size={20} /></div>
                        <div className="flex-1">
                          <h4 className="text-sm font-black text-foreground">Thanh toán khi nhận hàng</h4>
                          <p className="text-[11px] text-muted-foreground">Thanh toán bằng tiền mặt cho shipper</p>
                        </div>
                      </div>
                      
                      <div className={`modern-payment-card ${paymentMethod === 'bank' ? 'active' : ''}`} onClick={() => setPaymentMethod('bank')}>
                        <div className="payment-card-icon"><CreditCard size={20} /></div>
                        <div className="flex-1">
                          <h4 className="text-sm font-black text-foreground">Chuyển khoản ngân hàng</h4>
                          <p className="text-[11px] text-muted-foreground">Thanh toán qua QR hoặc Số tài khoản</p>
                        </div>
                      </div>

                      {paymentMethod === 'bank' && (
                        <div className="bank-info-box animate-in slide-in-from-top-2 duration-300">
                          <div className="flex gap-4">
                            <div className="relative group cursor-pointer" onClick={() => setIsQRModalOpen(true)}>
                              <img src={qrUrl} alt="QR Code" className="w-24 h-24 rounded-xl border border-border" />
                              <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Maximize2 size={16} className="text-white" />
                              </div>
                            </div>
                            <div className="flex-1 space-y-1 text-xs">
                              <p className="font-bold text-gray-800">MB Bank (Quân Đội)</p>
                              <p className="text-muted-foreground">Số TK: <span className="font-black text-foreground select-all">123456789</span></p>
                              <p className="text-muted-foreground">Chủ TK: <span className="font-bold text-foreground">TOY STORE MANAGEMENT</span></p>
                              <p className="text-muted-foreground font-medium italic">Nội dung: TT {formData.phone || '[SĐT]'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="cart-summary-footer border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Tổng tiền</span>
                  <span className="text-2xl font-black text-primary">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <button onClick={handleCompleteOrder} className="modern-checkout-btn">
                  Hoàn tất đặt hàng
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="modern-success-view">
              <div className="success-check-icon">
                <CheckCircle2 size={40} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-2">Đặt hàng thành công!</h2>
              <p className="text-muted-foreground text-sm mb-10 max-w-[280px]">
                Cảm ơn bạn đã tin dùng sản phẩm của <span className="text-primary font-bold">Gia Đình Thỏ Xinh</span>. Chúng tôi sẽ sớm liên hệ xác nhận đơn hàng.
              </p>
              <button onClick={resetAndClose} className="modern-checkout-btn max-w-[240px]">
                Quay lại cửa hàng
              </button>
            </div>
          )}
        </div>
      </Drawer>

      <Modal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} className="max-w-[400px]">
        <div className="p-8 flex flex-col items-center">
          <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
            <CreditCard size={24} />
          </div>
          <h3 className="text-lg font-black text-foreground mb-6 uppercase tracking-tight">Quét mã thanh toán</h3>
          <div className="bg-white p-4 rounded-3xl shadow-inner border border-gray-100 mb-6">
            <img src={qrUrl} alt="QR Code Zoom" className="w-full h-auto max-w-[280px] rounded-2xl" />
          </div>
          <div className="w-full space-y-3 bg-secondary/50 p-5 rounded-2xl border border-dashed border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Số tiền:</span>
              <span className="font-black text-primary text-base">{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Nội dung:</span>
              <span className="font-black text-foreground uppercase">TT {formData.phone || ''}</span>
            </div>
          </div>
          <button onClick={() => setIsQRModalOpen(false)} className="mt-8 w-full py-3 bg-card border-2 border-border text-foreground rounded-2xl font-black hover:bg-secondary transition-all uppercase text-[10px] tracking-[0.2em]">
            Đóng cửa sổ
          </button>
        </div>
      </Modal>
    </>
  );
};

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default CartDrawer;