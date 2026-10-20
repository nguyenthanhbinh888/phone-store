import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, totalCount, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-container">
        <div className="cart-empty-card">
          <div className="empty-icon-wrapper">
            <ShoppingBag size={48} />
          </div>
          <h2 className="empty-title">Giỏ hàng của bạn đang trống</h2>
          <p className="empty-desc">
            Bạn chưa chọn điện thoại hoặc phụ kiện nào. Hãy khám phá các dòng Flagship và ưu đãi mới nhất!
          </p>
          <Link to="/products" className="empty-action-btn">
            Khám phá điện thoại ngay
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      {/* Breadcrumb / Top Bar */}
      <div className="cart-header">
        <div>
          <h1 className="cart-page-title">
            Giỏ Hàng Của Bạn <span className="cart-badge-count">({totalCount} món)</span>
          </h1>
          <p className="cart-page-subtitle">Kiểm tra thông tin sản phẩm và số lượng trước khi đặt hàng</p>
        </div>
        <button 
          type="button" 
          className="cart-clear-btn" 
          onClick={clearCart}
          title="Xóa tất cả sản phẩm khỏi giỏ hàng"
        >
          <Trash2 size={15} />
          Xóa toàn bộ giỏ
        </button>
      </div>

      <div className="cart-layout">
        {/* Left Column: Items List */}
        <div className="cart-items-section">
          {cartItems.map((item) => (
            <div key={item.variantId} className="cart-item-card">
              <Link to={`/products/${item.productSlug}`} className="cart-item-image-wrapper">
                <img 
                  src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300'} 
                  alt={item.productName} 
                  className="cart-item-image"
                />
              </Link>

              <div className="cart-item-info">
                <Link to={`/products/${item.productSlug}`} className="cart-item-title">
                  {item.productName}
                </Link>
                
                <div className="cart-item-badges">
                  <span className="cart-variant-badge">Màu: {item.color}</span>
                  <span className="cart-variant-badge">Bộ nhớ: {item.storage}</span>
                </div>

                <div className="cart-item-unit-price">
                  Đơn giá: <strong>{formatPrice(item.price)}</strong>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="cart-item-actions">
                <div className="quantity-stepper">
                  <button 
                    type="button" 
                    className="step-btn" 
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Giảm số lượng"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="quantity-val">{item.quantity}</span>
                  <button 
                    type="button" 
                    className="step-btn" 
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    aria-label="Tăng số lượng"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button 
                  type="button" 
                  className="cart-item-delete" 
                  onClick={() => removeFromCart(item.variantId)}
                  title="Xóa sản phẩm này"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div className="cart-continue-shopping">
            <Link to="/products" className="continue-link">
              <ArrowLeft size={16} />
              Tiếp tục chọn thêm điện thoại khác
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="cart-summary-section">
          <div className="cart-summary-card">
            <h2 className="summary-title">Tóm Tắt Đơn Hàng</h2>

            <div className="summary-row">
              <span>Tạm tính ({totalCount} sản phẩm):</span>
              <span className="summary-val">{formatPrice(totalPrice)}</span>
            </div>

            <div className="summary-row">
              <span className="shipping-label">
                <Truck size={16} />
                Phí vận chuyển:
              </span>
              <span className="shipping-free">MIỄN PHÍ</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Tổng thanh toán:</span>
              <span className="total-amount">{formatPrice(totalPrice)}</span>
            </div>
            <div className="vat-notice">(Đã bao gồm thuế VAT và bảo hành 12 tháng)</div>

            <button 
              type="button" 
              className="checkout-proceed-btn"
              onClick={() => navigate('/checkout')}
            >
              Tiến Hành Đặt Hàng Ngay
              <ArrowRight size={18} />
            </button>

            {/* Trust Badges */}
            <div className="summary-trust-perks">
              <div className="trust-item">
                <ShieldCheck size={18} className="trust-icon" />
                <div>
                  <div className="trust-title">Bảo Hành Chính Hãng 12 Tháng</div>
                  <div className="trust-desc">1 đổi 1 trong 30 ngày nếu phát sinh lỗi phần cứng</div>
                </div>
              </div>
              <div className="trust-item">
                <Truck size={18} className="trust-icon" />
                <div>
                  <div className="trust-title">Giao Hàng Miễn Phí Toàn Quốc</div>
                  <div className="trust-desc">Kiểm tra máy trước khi thanh toán tiền mặt (COD)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
