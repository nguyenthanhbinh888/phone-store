import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Copy, 
  Check, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService, paymentService } from '../../services/api';
import type { OrderDto, PaymentMethod } from '../../types';
import './CheckoutPage.css';

export const CheckoutPage: React.FC = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<OrderDto | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto-fill recipient information if user is logged in
  useEffect(() => {
    if (user) {
      if (user.fullName) setCustomerName(user.fullName);
      if (user.phoneNumber) setCustomerPhone(user.phoneNumber);
      if (user.email) setCustomerEmail(user.email);
      if (user.address) setShippingAddress(user.address);
    }
  }, [user]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleCopyOrderCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMsg('Giỏ hàng đang trống, không thể thực hiện đặt hàng.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        shippingAddress: shippingAddress.trim(),
        note: note.trim() || undefined,
        paymentMethod,
        items: cartItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      };

      const order = await orderService.createOrder(orderPayload);
      clearCart();
      setCreatedOrder(order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đặt hàng không thành công. Vui lòng thử lại.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE VIEW
  if (createdOrder) {
    return (
      <div className="checkout-page-container">
        <div className="order-success-card">
          <div className="success-icon-badge">
            <CheckCircle2 size={52} />
          </div>

          <h1 className="success-title">Đặt Hàng Thành Công!</h1>
          <p className="success-subtitle">
            Cảm ơn bạn đã tin tưởng mua sắm tại <strong>PhoneStore</strong>. Đơn hàng của bạn đã được ghi nhận và đang chuẩn bị đóng gói.
          </p>

          {/* Order Code Box */}
          <div className="order-code-box">
            <div className="code-label">MÃ ĐƠN HÀNG CỦA BẠN:</div>
            <div className="code-value-row">
              <span className="code-text">{createdOrder.orderCode}</span>
              <button 
                type="button" 
                className="code-copy-btn" 
                onClick={() => handleCopyOrderCode(createdOrder.orderCode)}
                title="Sao chép mã đơn"
              >
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                {copiedCode ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
          </div>

          {/* Order Code Box */}
          <div className="order-code-box">
            <div className="code-label">MÃ ĐƠN HÀNG CỦA BẠN:</div>
            <div className="code-value-row">
              <span className="code-text">{createdOrder.orderCode}</span>
              <button 
                type="button" 
                className="code-copy-btn" 
                onClick={() => handleCopyOrderCode(createdOrder.orderCode)}
                title="Sao chép mã đơn"
              >
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                {copiedCode ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
          </div>

          {/* VietQR Section if BANK_TRANSFER */}
          {createdOrder.paymentMethod === 'BANK_TRANSFER' && (
            <div className="vietqr-container-card">
              <div className="vietqr-title">
                <CreditCard size={18} />
                <span>Quét Mã VietQR Napas247 Để Thanh Toán</span>
              </div>
              <p className="vietqr-desc">
                Mở ứng dụng ngân hàng bất kỳ (Vietcombank, MB, Techcombank, Momo...) và quét mã bên dưới để thanh toán tự động:
              </p>
              <div className="vietqr-img-wrapper">
                <img 
                  src={`https://img.vietqr.io/image/970436-0988776655-compact2.png?amount=${createdOrder.finalAmount}&addInfo=${encodeURIComponent(createdOrder.orderCode)}&accountName=${encodeURIComponent("CONG TY PHONE STORE")}`} 
                  alt="Mã VietQR Chuyển Khoản" 
                  className="vietqr-image"
                />
              </div>
              <div className="vietqr-bank-details">
                <div>Ngân hàng: <strong>Vietcombank (970436)</strong></div>
                <div>Số tài khoản: <strong>0988 7766 55</strong></div>
                <div>Chủ tài khoản: <strong>CONG TY TNHH PHONE STORE VIET NAM</strong></div>
                <div>Số tiền: <strong className="qr-amount">{formatPrice(createdOrder.finalAmount)}</strong></div>
                <div>Nội dung chuyển khoản: <strong className="qr-memo">{createdOrder.orderCode}</strong></div>
              </div>

              {createdOrder.paymentStatus !== 'PAID' ? (
                <button 
                  type="button"
                  className="btn-confirm-paid"
                  onClick={async () => {
                    try {
                      const paidOrder = await paymentService.simulatePay(createdOrder.orderCode);
                      setCreatedOrder(paidOrder);
                    } catch (e) {
                      console.error('Lỗi thanh toán VietQR:', e);
                    }
                  }}
                >
                  <CheckCircle2 size={18} />
                  Tôi Đã Chuyển Khoản Thành Công
                </button>
              ) : (
                <div className="paid-success-tag">
                  <CheckCircle2 size={18} />
                  <span>Giao dịch chuyển khoản đã được xác nhận thành công!</span>
                </div>
              )}
            </div>
          )}

          {/* Order Snapshot Summary */}
          <div className="success-details-card">
            <div className="detail-row">
              <span>Người nhận hàng:</span>
              <strong>{createdOrder.customerName} ({createdOrder.customerPhone})</strong>
            </div>
            <div className="detail-row">
              <span>Địa chỉ nhận:</span>
              <span>{createdOrder.shippingAddress}</span>
            </div>
            <div className="detail-row">
              <span>Hình thức thanh toán:</span>
              <strong className="badge-payment">{createdOrder.paymentMethodDescription || createdOrder.paymentMethod}</strong>
            </div>
            <div className="detail-row">
              <span>Trạng thái thanh toán:</span>
              <strong className={createdOrder.paymentStatus === 'PAID' ? 'badge-status-completed' : 'badge-status-pending'}>
                {createdOrder.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </strong>
            </div>
            <div className="detail-row">
              <span>Trạng thái đơn:</span>
              <strong className="badge-status-pending">{createdOrder.statusDescription || createdOrder.status}</strong>
            </div>
            <div className="detail-row">
              <span>Tổng thanh toán:</span>
              <strong className="final-total">{formatPrice(createdOrder.finalAmount)}</strong>
            </div>
          </div>

          {/* Action buttons */}
          <div className="success-actions">
            {isAuthenticated ? (
              <Link to="/orders/my-orders" className="success-primary-btn">
                Xem Lịch Sử Đơn Hàng Của Bạn
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/products" className="success-primary-btn">
                Tiếp Tục Mua Sắm
                <ArrowRight size={18} />
              </Link>
            )}
            <Link to="/" className="success-secondary-btn">
              Về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART CHECK
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page-container">
        <div className="checkout-empty-box">
          <h2>Bạn chưa có sản phẩm nào để thanh toán</h2>
          <p>Vui lòng chọn sản phẩm vào giỏ hàng trước khi đặt mua.</p>
          <Link to="/products" className="btn-back-products">
            <ArrowLeft size={16} />
            Xem danh sách điện thoại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      {/* Header */}
      <div className="checkout-header">
        <button type="button" className="checkout-back-link" onClick={() => navigate('/cart')}>
          <ArrowLeft size={16} />
          Quay lại Giỏ hàng
        </button>
        <h1 className="checkout-page-title">Thông Tin Thanh Toán & Đặt Hàng</h1>
      </div>

      {/* Auth Helper Alert */}
      {isAuthenticated && user && (
        <div className="checkout-user-banner">
          <UserCheck size={20} className="banner-icon" />
          <span>
            Đang đặt hàng với tài khoản <strong>{user.fullName || user.username}</strong> ({user.email}). Thông tin nhận hàng đã được điền sẵn từ hồ sơ của bạn.
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="checkout-alert-error">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="checkout-layout">
        {/* Left Form: Delivery & Payment Details */}
        <div className="checkout-form-section">
          <div className="checkout-card">
            <h2 className="card-section-title">1. Địa Chỉ Nhận Hàng</h2>

            <div className="form-group-checkout">
              <label htmlFor="customer-name">Họ và tên người nhận *</label>
              <input 
                id="customer-name"
                type="text" 
                placeholder="Ví dụ: Nguyễn Văn A"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="form-row-checkout">
              <div className="form-group-checkout">
                <label htmlFor="customer-phone">Số điện thoại liên hệ *</label>
                <input 
                  id="customer-phone"
                  type="tel" 
                  placeholder="0912 345 678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-checkout">
                <label htmlFor="customer-email">Email nhận hóa đơn & cập nhật đơn hàng</label>
                <input 
                  id="customer-email"
                  type="email" 
                  placeholder="email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-checkout">
              <label htmlFor="customer-address">Địa chỉ giao hàng chi tiết *</label>
              <input 
                id="customer-address"
                type="text" 
                placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group-checkout">
              <label htmlFor="customer-note">Ghi chú giao hàng (Tùy chọn)</label>
              <textarea 
                id="customer-note"
                rows={2}
                placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi đến 15 phút..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="checkout-card">
            <h2 className="card-section-title">2. Phương Thức Thanh Toán</h2>

            <div className="payment-options-grid">
              <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="COD" 
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <div className="option-content">
                  <div className="option-title">
                    <Truck size={18} />
                    Thanh toán khi nhận hàng (COD)
                    <span className="badge-recommend">Khuyên dùng</span>
                  </div>
                  <div className="option-desc">
                    Kiểm tra máy tại nhà, đúng phiên bản & nguyên seal mới thanh toán tiền mặt cho shipper.
                  </div>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'BANK_TRANSFER' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="BANK_TRANSFER" 
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                />
                <div className="option-content">
                  <div className="option-title">
                    <CreditCard size={18} />
                    Chuyển khoản ngân hàng (QR Code 24/7)
                  </div>
                  <div className="option-desc">
                    Quét mã QR Napas247 tiện lợi qua Vietcombank, Techcombank, MB Bank, v.v.
                  </div>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'VNPAY' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="VNPAY" 
                  checked={paymentMethod === 'VNPAY'}
                  onChange={() => setPaymentMethod('VNPAY')}
                />
                <div className="option-content">
                  <div className="option-title">
                    <CreditCard size={18} />
                    Cổng VNPAY / Thẻ Visa, Mastercard
                  </div>
                  <div className="option-desc">
                    Hỗ trợ thanh toán nhanh bằng thẻ ATM nội địa hoặc thẻ quốc tế.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Items & Submit */}
        <div className="checkout-summary-section">
          <div className="checkout-summary-card">
            <h2 className="summary-title">Đơn Hàng Của Bạn ({cartItems.length} mẫu)</h2>

            <div className="checkout-mini-items">
              {cartItems.map((item) => (
                <div key={item.variantId} className="mini-item">
                  <img src={item.thumbnailUrl} alt={item.productName} className="mini-img" />
                  <div className="mini-info">
                    <div className="mini-name">{item.productName}</div>
                    <div className="mini-meta">{item.color} • {item.storage} • x{item.quantity}</div>
                  </div>
                  <div className="mini-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="checkout-summary-row">
              <span>Tạm tính tiền hàng:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Phí giao hàng:</span>
              <span className="free-tag">MIỄN PHÍ</span>
            </div>

            <div className="summary-divider"></div>

            <div className="checkout-summary-row total-highlight">
              <span>Tổng thanh toán:</span>
              <span className="final-price">{formatPrice(totalPrice)}</span>
            </div>

            <button 
              type="submit" 
              className="btn-confirm-order" 
              disabled={loading}
            >
              {loading ? (
                <span>Đang xử lý đặt hàng...</span>
              ) : (
                <>
                  Xác Nhận Đặt Hàng Ngay
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="checkout-guarantee">
              <ShieldCheck size={16} />
              <span>Bảo mật thông tin & Cam kết chính hãng 100%</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
