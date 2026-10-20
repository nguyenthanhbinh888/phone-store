import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  AlertCircle, 
  ShoppingBag, 
  ArrowRight, 
  Copy, 
  Check, 
  LogIn 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/api';
import type { OrderDto } from '../../types';
import './MyOrdersPage.css';

export const MyOrdersPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error('Không thể tải lịch sử đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không? Các sản phẩm sẽ được hoàn lại vào kho.')) {
      return;
    }

    try {
      setCancellingId(orderId);
      const updated = await orderService.cancelOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setNotification(`Đã hủy thành công đơn hàng ${updated.orderCode}. Tồn kho đã được khôi phục.`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Hủy đơn hàng thất bại';
      alert(msg);
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-page-container">
        <div className="orders-guest-box">
          <div className="guest-icon-wrap">
            <Package size={48} />
          </div>
          <h2>Xem Lịch Sử Đơn Hàng</h2>
          <p>Vui lòng đăng nhập để xem danh sách các đơn hàng và trạng thái vận chuyển của bạn.</p>
          <button 
            type="button" 
            className="guest-login-btn" 
            onClick={() => openAuthModal('login')}
          >
            <LogIn size={18} />
            Đăng Nhập Ngay
          </button>
        </div>
      </div>
    );
  }

  const renderStatusBadge = (status: string, desc?: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="order-badge badge-pending">
            <Clock size={13} />
            {desc || 'Chờ xử lý'}
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="order-badge badge-confirmed">
            <CheckCircle size={13} />
            {desc || 'Đã xác nhận'}
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="order-badge badge-shipping">
            <Truck size={13} />
            {desc || 'Đang giao hàng'}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="order-badge badge-completed">
            <CheckCircle size={13} />
            {desc || 'Giao thành công'}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="order-badge badge-cancelled">
            <XCircle size={13} />
            {desc || 'Đã hủy'}
          </span>
        );
      default:
        return <span className="order-badge">{status}</span>;
    }
  };

  return (
    <div className="orders-page-container">
      <div className="orders-header">
        <div>
          <h1 className="orders-title">Đơn Hàng Của Tôi</h1>
          <p className="orders-subtitle">
            Tài khoản: <strong>{user?.fullName || user?.username}</strong> • Quản lý các đơn hàng và trạng thái giao nhận
          </p>
        </div>
      </div>

      {notification && (
        <div className="orders-notification-banner">
          <AlertCircle size={18} />
          <span>{notification}</span>
        </div>
      )}

      {loading ? (
        <div className="orders-loading">Đang tải lịch sử đơn hàng...</div>
      ) : orders.length === 0 ? (
        <div className="orders-empty-card">
          <ShoppingBag size={48} className="empty-bag-icon" />
          <h3>Bạn chưa có đơn hàng nào</h3>
          <p>Hãy bắt đầu mua sắm để nhận nhiều ưu đãi độc quyền từ PhoneStore!</p>
          <Link to="/products" className="btn-explore">
            Khám phá sản phẩm
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Card Header */}
              <div className="order-card-header">
                <div className="order-code-group">
                  <span className="order-code-display">{order.orderCode}</span>
                  <button 
                    type="button" 
                    className="copy-code-btn"
                    onClick={() => handleCopyCode(order.orderCode)}
                    title="Sao chép mã đơn hàng"
                  >
                    {copiedCode === order.orderCode ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <span className="order-date-text">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="order-badges-group">
                  {renderStatusBadge(order.status, order.statusDescription)}
                  <span className="order-payment-pill">
                    {order.paymentMethodDescription || order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="order-items-table">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <img 
                      src={item.productThumbnail || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300'} 
                      alt={item.productName} 
                      className="item-row-img" 
                    />
                    <div className="item-row-info">
                      <div className="item-row-name">{item.productName}</div>
                      <div className="item-row-variant">{item.variantDetails}</div>
                      <div className="item-row-qty">Số lượng: x{item.quantity}</div>
                    </div>
                    <div className="item-row-subtotal">
                      {formatPrice(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="order-card-footer">
                <div className="order-delivery-address">
                  <strong>Giao đến:</strong> {order.customerName} ({order.customerPhone}) - {order.shippingAddress}
                  {order.note && <div className="order-note-text">Ghi chú: {order.note}</div>}
                </div>

                <div className="order-footer-actions">
                  <div className="order-total-block">
                    <span className="label">Tổng đơn:</span>
                    <span className="value">{formatPrice(order.finalAmount)}</span>
                  </div>

                  {order.status === 'PENDING' && (
                    <button
                      type="button"
                      className="btn-cancel-order"
                      disabled={cancellingId === order.id}
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      {cancellingId === order.id ? 'Đang hủy...' : 'Hủy Đơn Hàng'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
