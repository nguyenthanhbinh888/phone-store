import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  Package, 
  Clock, 
  Smartphone, 
  AlertTriangle, 
  Plus, 
  Eye, 
  Trash2, 
  CheckCircle, 
  LogIn,
  RotateCcw,
  Upload,
  Edit
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminService, productService, uploadService } from '../../services/api';
import type { 
  DashboardDto, 
  OrderDto, 
  OrderStatus, 
  ProductSummary,
  ProductDetail,
  CreateProductRequest
} from '../../types';
import './AdminDashboardPage.css';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview');
  const [stats, setStats] = useState<DashboardDto | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Orders Tab
  const [orderFilter, setOrderFilter] = useState<OrderStatus | ''>('');
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Products Tab
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  const [loadingEditProduct, setLoadingEditProduct] = useState(false);

  // Quick Stock Modal
  const [editingVariant, setEditingVariant] = useState<{ id: number; name: string; currentStock: number } | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(10);

  // Notifications
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Không thể tải thống kê quản trị:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadOrders = async (status?: OrderStatus) => {
    try {
      setLoadingOrders(true);
      const res = await adminService.getOrders({ status: status || undefined, size: 50 });
      setOrders(res.items);
    } catch (err) {
      console.error('Không thể tải danh sách đơn hàng:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await productService.getProducts({ size: 50 });
      setProducts(res.items);
    } catch (err) {
      console.error('Không thể tải danh sách sản phẩm:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadStats();
      if (activeTab === 'orders') loadOrders(orderFilter || undefined);
      if (activeTab === 'products') loadProducts();
    }
  }, [isAdmin, activeTab, orderFilter]);

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const updated = await adminService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast(`Đã chuyển đơn hàng ${updated.orderCode} sang trạng thái '${updated.statusDescription}'!`);
      loadStats(); // refresh stats
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cập nhật trạng thái thất bại';
      alert(msg);
    }
  };

  const handleSaveStock = async () => {
    if (!editingVariant) return;
    try {
      await adminService.updateVariantStock(editingVariant.id, { stockQuantity: newStockVal });
      showToast(`Đã cập nhật tồn kho cho phiên bản thành ${newStockVal} máy!`);
      setEditingVariant(null);
      loadStats();
      if (activeTab === 'products') loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cập nhật kho thất bại';
      alert(msg);
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn ẩn điện thoại '${name}' khỏi gian hàng không?`)) return;
    try {
      await adminService.deleteProduct(id);
      showToast(`Đã ẩn sản phẩm '${name}' thành công!`);
      loadProducts();
      loadStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ẩn sản phẩm thất bại';
      alert(msg);
    }
  };

  const handleOpenEditModal = async (summary: ProductSummary) => {
    try {
      setLoadingEditProduct(true);
      const detail = await productService.getProductById(summary.id);
      setEditingProduct(detail);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải thông tin sản phẩm';
      alert(msg);
    } finally {
      setLoadingEditProduct(false);
    }
  };

  // ACCESS DENIED VIEW
  if (!isAdmin) {
    return (
      <div className="admin-page-container">
        <div className="admin-denied-card">
          <div className="denied-icon-wrap">
            <ShieldCheck size={56} />
          </div>
          <h1>Khu Vực Quản Trị Hệ Thống</h1>
          <p>
            Trang này chỉ dành cho tài khoản có quyền Quản trị viên (<strong>ROLE_ADMIN</strong>). Vui lòng đăng nhập bằng tài khoản quản trị để tiếp tục.
          </p>
          <div className="denied-hint">
            👑 Tài khoản quản trị mẫu: <strong>admin</strong> / Mật khẩu: <strong>admin123</strong>
          </div>
          <button 
            type="button" 
            className="btn-admin-login" 
            onClick={() => openAuthModal('login')}
          >
            <LogIn size={18} />
            Đăng Nhập Tài Khoản Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Toast Notification */}
      {adminToast && (
        <div className="admin-toast-banner">
          <CheckCircle size={18} />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div>
          <div className="admin-badge-label">
            <ShieldCheck size={16} />
            <span>HỆ THỐNG QUẢN TRỊ BÁN HÀNG</span>
          </div>
          <h1 className="admin-title">Bảng Điều Khiển Quản Trị (Admin Portal)</h1>
          <p className="admin-subtitle">
            Xin chào, <strong>{user?.fullName || user?.username}</strong> • Quản lý doanh thu, xử lý đơn hàng và theo dõi kho hàng
          </p>
        </div>

        <button 
          type="button" 
          className="admin-refresh-btn" 
          onClick={() => {
            loadStats();
            if (activeTab === 'orders') loadOrders(orderFilter || undefined);
            if (activeTab === 'products') loadProducts();
            showToast('Đã làm mới dữ liệu!');
          }}
          title="Làm mới dữ liệu"
        >
          <RotateCcw size={16} />
          Làm mới
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          type="button" 
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Tổng quan doanh thu
        </button>
        <button 
          type="button" 
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Quản lý Đơn hàng ({stats ? stats.totalOrders : '...'})
        </button>
        <button 
          type="button" 
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📱 Quản lý Điện thoại & Kho
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        loadingStats ? (
          <div className="admin-empty-state">
            <RotateCcw className="spin-icon" size={28} />
            <p>Đang tổng hợp dữ liệu doanh thu & kho hàng...</p>
          </div>
        ) : stats ? (
          <div className="admin-overview-section">
            {/* Metrics 4 Cards */}
            <div className="admin-stats-grid">
            <div className="stat-card stat-revenue">
              <div className="stat-icon-circle"><DollarSign size={24} /></div>
              <div className="stat-info">
                <div className="stat-label">Tổng Doanh Thu</div>
                <div className="stat-val">{formatPrice(stats.totalRevenue)}</div>
                <div className="stat-sub">Không tính các đơn bị hủy</div>
              </div>
            </div>

            <div className="stat-card stat-orders">
              <div className="stat-icon-circle"><Package size={24} /></div>
              <div className="stat-info">
                <div className="stat-label">Tổng Đơn Hàng</div>
                <div className="stat-val">{stats.totalOrders} đơn</div>
                <div className="stat-sub">
                  {stats.completedOrders} hoàn thành • {stats.shippingOrders} đang giao
                </div>
              </div>
            </div>

            <div className="stat-card stat-pending">
              <div className="stat-icon-circle"><Clock size={24} /></div>
              <div className="stat-info">
                <div className="stat-label">Đơn Chờ Xử Lý</div>
                <div className="stat-val stat-val-pending">{stats.pendingOrders} đơn</div>
                <div className="stat-sub">Cần duyệt & đóng gói giao khách</div>
              </div>
            </div>

            <div className="stat-card stat-products">
              <div className="stat-icon-circle"><Smartphone size={24} /></div>
              <div className="stat-info">
                <div className="stat-label">Mẫu Điện Thoại</div>
                <div className="stat-val">{stats.totalProducts} dòng máy</div>
                <div className="stat-sub">Đang kinh doanh trên toàn hệ thống</div>
              </div>
            </div>
          </div>

          {/* Low Stock Warnings */}
          {stats.lowStockVariants && stats.lowStockVariants.length > 0 && (
            <div className="admin-alert-box">
              <div className="alert-box-header">
                <div className="alert-box-title">
                  <AlertTriangle size={20} className="icon-warn" />
                  <span>Cảnh Báo Tồn Kho Sắp Hết ({stats.lowStockCount} phiên bản ≤ 5 máy)</span>
                </div>
              </div>
              <div className="low-stock-grid">
                {stats.lowStockVariants.map((item) => (
                  <div key={item.variantId} className="low-stock-chip">
                    <div className="chip-name">{item.productName}</div>
                    <div className="chip-meta">{item.color} • {item.storage}</div>
                    <div className="chip-stock">Còn lại: <strong>{item.stockQuantity} chiếc</strong></div>
                    <button
                      type="button"
                      className="btn-quick-restock"
                      onClick={() => {
                        setEditingVariant({
                          id: item.variantId,
                          name: `${item.productName} (${item.color} - ${item.storage})`,
                          currentStock: item.stockQuantity
                        });
                        setNewStockVal(item.stockQuantity + 20);
                      }}
                    >
                      + Nhập thêm kho
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="admin-table-card">
            <h2 className="table-card-title">Đơn Hàng Gần Đây Nhất</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Khách Hàng</th>
                    <th>Số Điện Thoại</th>
                    <th>Tổng Tiền</th>
                    <th>Thanh Toán</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="code-cell">{order.orderCode}</td>
                      <td>{order.customerName}</td>
                      <td>{order.customerPhone}</td>
                      <td className="amount-cell">{formatPrice(order.finalAmount)}</td>
                      <td>
                        <span className={`pill-payment ${order.paymentStatus === 'PAID' ? 'paid' : 'unpaid'}`}>
                          {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </td>
                      <td>
                        <span className={`pill-status status-${order.status.toLowerCase()}`}>
                          {order.statusDescription || order.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="btn-view-order"
                          onClick={() => {
                            setActiveTab('orders');
                            setOrderFilter('');
                          }}
                        >
                          <Eye size={14} />
                          Quản lý
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null)}

      {/* 2. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="admin-orders-tab">
          {/* Order Filter Pills */}
          <div className="order-filter-bar">
            <button 
              type="button" 
              className={`filter-pill ${orderFilter === '' ? 'active' : ''}`}
              onClick={() => setOrderFilter('')}
            >
              Tất cả đơn
            </button>
            <button 
              type="button" 
              className={`filter-pill ${orderFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setOrderFilter('PENDING')}
            >
              Chờ xử lý (PENDING)
            </button>
            <button 
              type="button" 
              className={`filter-pill ${orderFilter === 'CONFIRMED' ? 'active' : ''}`}
              onClick={() => setOrderFilter('CONFIRMED')}
            >
              Đã xác nhận (CONFIRMED)
            </button>
            <button 
              type="button" 
              className={`filter-pill ${orderFilter === 'SHIPPING' ? 'active' : ''}`}
              onClick={() => setOrderFilter('SHIPPING')}
            >
              Đang giao (SHIPPING)
            </button>
            <button 
              type="button" 
              className={`filter-pill ${orderFilter === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => setOrderFilter('COMPLETED')}
            >
              Hoàn thành (COMPLETED)
            </button>
            <button 
              type="button" 
              className={`filter-pill ${orderFilter === 'CANCELLED' ? 'active' : ''}`}
              onClick={() => setOrderFilter('CANCELLED')}
            >
              Đã hủy (CANCELLED)
            </button>
          </div>

          {loadingOrders ? (
            <div className="admin-loading">Đang tải danh sách đơn hàng...</div>
          ) : orders.length === 0 ? (
            <div className="admin-empty">Không tìm thấy đơn hàng nào ở trạng thái này.</div>
          ) : (
            <div className="admin-table-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã Đơn</th>
                      <th>Người Nhận & Địa Chỉ</th>
                      <th>Chi Tiết Mặt Hàng</th>
                      <th>Tổng Tiền</th>
                      <th>Hình Thức</th>
                      <th>Chuyển Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <div className="code-cell">{order.orderCode}</div>
                          <div className="text-muted-xs">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                        </td>
                        <td>
                          <div className="cust-name">{order.customerName} - {order.customerPhone}</div>
                          <div className="cust-addr">{order.shippingAddress}</div>
                          {order.note && <div className="cust-note">"{order.note}"</div>}
                        </td>
                        <td>
                          <div className="order-items-snippet">
                            {order.items.map((it) => (
                              <div key={it.id} className="snippet-item">
                                • {it.productName} ({it.variantDetails}) x<strong>{it.quantity}</strong>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="amount-cell">{formatPrice(order.finalAmount)}</td>
                        <td>
                          <div className="payment-tag">{order.paymentMethod}</div>
                          <span className={`pill-payment ${order.paymentStatus === 'PAID' ? 'paid' : 'unpaid'}`}>
                            {order.paymentStatus === 'PAID' ? 'Đã TT' : 'Chưa TT'}
                          </span>
                        </td>
                        <td>
                          <select 
                            className="status-select"
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          >
                            <option value="PENDING">⏳ Chờ xử lý</option>
                            <option value="CONFIRMED">✔️ Đã xác nhận</option>
                            <option value="SHIPPING">🚚 Đang giao hàng</option>
                            <option value="COMPLETED">🎉 Hoàn thành</option>
                            <option value="CANCELLED">❌ Đã hủy (Hoàn kho)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. PRODUCTS MANAGEMENT TAB */}
      {activeTab === 'products' && (
        <div className="admin-products-tab">
          <div className="products-actions-bar">
            <h2 className="section-title">Danh Sách Điện Thoại Đang Kinh Doanh ({products.length} mẫu)</h2>
            <button 
              type="button" 
              className="btn-create-product"
              onClick={() => setIsCreateProductModalOpen(true)}
            >
              <Plus size={18} />
              Thêm Điện Thoại Mới
            </button>
          </div>

          {loadingProducts ? (
            <div className="admin-loading">Đang tải sản phẩm...</div>
          ) : (
            <div className="admin-table-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Tên Điện Thoại</th>
                      <th>Thương Hiệu</th>
                      <th>Danh Mục</th>
                      <th>Khoảng Giá</th>
                      <th>Tùy Chọn</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <img src={p.thumbnailUrl} alt={p.name} className="admin-prod-thumb" />
                        </td>
                        <td className="prod-name-cell">
                          <strong>{p.name}</strong>
                          {p.featured && <span className="featured-pill">Nổi bật</span>}
                        </td>
                        <td>{p.brand?.name}</td>
                        <td>{p.category?.name}</td>
                        <td className="amount-cell">{formatPrice(p.minPrice)}</td>
                        <td>
                          <div className="options-snippet">
                            <span>{p.storageOptions.join(', ')}</span>
                            <span className="colors-text">{p.colorOptions.join(', ')}</span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-actions-group">
                            <button 
                              type="button"
                              className="btn-edit-product-action"
                              onClick={() => handleOpenEditModal(p)}
                              title="Sửa thông tin sản phẩm"
                              disabled={loadingEditProduct}
                            >
                              <Edit size={13} />
                              <span>Sửa</span>
                            </button>
                            <button 
                              type="button"
                              className="btn-edit-action"
                              onClick={() => {
                                setEditingVariant({
                                  id: p.id,
                                  name: p.name,
                                  currentStock: 10
                                });
                                setNewStockVal(20);
                              }}
                              title="Cập nhật nhanh tồn kho"
                            >
                              Kho
                            </button>
                            <button 
                              type="button"
                              className="btn-delete-action"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              title="Ẩn khỏi cửa hàng"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUICK STOCK MODAL */}
      {editingVariant && (
        <div className="admin-modal-overlay" onClick={() => setEditingVariant(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cập Nhật Tồn Kho Nhanh</h3>
            <p className="modal-sub">{editingVariant.name}</p>

            <div className="modal-form-group">
              <label>Số lượng tồn kho mới:</label>
              <input 
                type="number" 
                min={0}
                value={newStockVal}
                onChange={(e) => setNewStockVal(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setEditingVariant(null)}>
                Hủy
              </button>
              <button type="button" className="btn-save" onClick={handleSaveStock}>
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {isCreateProductModalOpen && (
        <CreateProductModal 
          onClose={() => setIsCreateProductModalOpen(false)}
          onSuccess={() => {
            setIsCreateProductModalOpen(false);
            showToast('Đã thêm sản phẩm điện thoại mới thành công!');
            loadProducts();
            loadStats();
          }}
        />
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <EditProductModal 
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            const prodName = editingProduct.name;
            setEditingProduct(null);
            showToast(`Đã cập nhật thông tin '${prodName}' thành công!`);
            loadProducts();
            loadStats();
          }}
        />
      )}
    </div>
  );
};

// Subcomponent: CreateProductModal
const CreateProductModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState<number>(1); // Apple default
  const [categoryId, setCategoryId] = useState<number>(1); // Flagship default
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [useManualUrl, setUseManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState('');
  const [screen, setScreen] = useState('6.7 inch OLED 120Hz');
  const [chipset, setChipset] = useState('Snapdragon 8 Gen 3 / Apple A18 Pro');
  const [battery, setBattery] = useState('5000 mAh');
  const [camera, setCamera] = useState('50MP + 48MP');
  const [os, setOs] = useState('Android 15 / iOS 18');
  const [featured, setFeatured] = useState(true);

  // Variant 1
  const [color, setColor] = useState('Đen Vũ Trụ');
  const [storage, setStorage] = useState('256GB');
  const [price, setPrice] = useState('25990000');
  const [originalPrice, setOriginalPrice] = useState('29990000');
  const [stockQuantity, setStockQuantity] = useState(15);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chỉ chọn tệp hình ảnh (PNG, JPG, WEBP, GIF)');
      return;
    }

    try {
      setUploadingImage(true);
      setUploadError(null);
      const res = await uploadService.uploadImage(file);
      setThumbnailUrl(res.url);
      setUploadedFileName(file.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tải ảnh lên máy chủ thất bại';
      setUploadError(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên điện thoại');
      return;
    }
    if (!thumbnailUrl.trim()) {
      alert('Vui lòng chọn hình ảnh từ máy tính hoặc cung cấp đường dẫn ảnh');
      return;
    }

    try {
      setLoading(true);
      const payload: CreateProductRequest = {
        name: name.trim(),
        brandId,
        categoryId,
        description,
        thumbnailUrl: thumbnailUrl.trim(),
        screen,
        chipset,
        battery,
        camera,
        os,
        featured,
        variants: [
          {
            color: color.trim(),
            colorCode: '#111827',
            ram: '8GB',
            storage: storage.trim(),
            price: parseFloat(price) || 25000000,
            originalPrice: parseFloat(originalPrice) || 29000000,
            stockQuantity,
            imageUrl: thumbnailUrl.trim()
          }
        ]
      };

      await adminService.createProduct(payload);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Thêm sản phẩm thất bại';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Thêm Mới Điện Thoại</h3>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="create-product-form">
          <div className="form-grid-2">
            <div className="modal-form-group">
              <label>Tên Điện Thoại *</label>
              <input 
                type="text" 
                placeholder="Ví dụ: iPhone 16 Plus"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="modal-form-group">
              <label>Hãng (Brand) *</label>
              <select value={brandId} onChange={(e) => setBrandId(parseInt(e.target.value))}>
                <option value={1}>Apple</option>
                <option value={2}>Samsung</option>
                <option value={3}>Xiaomi</option>
                <option value={4}>OPPO</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="modal-form-group">
              <label>Danh mục *</label>
              <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value))}>
                <option value={1}>Điện thoại Flagship</option>
                <option value={2}>Điện thoại Tầm trung</option>
                <option value={3}>Điện thoại Phổ thông</option>
              </select>
            </div>

            <div className="modal-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Hình Ảnh Điện Thoại (Tải từ máy) *</label>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => setUseManualUrl(!useManualUrl)}
                >
                  {useManualUrl ? '📁 Chọn ảnh từ máy tính' : '🔗 Hoặc dán link URL'}
                </button>
              </div>

              {useManualUrl ? (
                <input 
                  type="url" 
                  placeholder="https://example.com/phone-image.jpg"
                  value={thumbnailUrl} 
                  onChange={(e) => setThumbnailUrl(e.target.value)} 
                  required 
                />
              ) : (
                <>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileUpload} 
                  />

                  <div 
                    className="image-upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadingImage ? (
                      <div className="upload-loading-state">
                        <RotateCcw className="spin-icon" size={20} style={{ color: '#38bdf8' }} />
                        <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                          Đang tải và lưu trữ ảnh lên hệ thống...
                        </span>
                      </div>
                    ) : thumbnailUrl ? (
                      <div className="upload-preview-state">
                        <img src={thumbnailUrl} alt="Preview" className="upload-preview-img" />
                        <div className="upload-preview-info">
                          <div className="upload-success-badge">
                            <CheckCircle size={14} style={{ color: '#10b981' }} />
                            <span>Đã lưu vào bộ nhớ hệ thống (Server)</span>
                          </div>
                          <div className="upload-filename">{uploadedFileName || thumbnailUrl}</div>
                          <button 
                            type="button" 
                            className="btn-change-image"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            Đổi ảnh khác từ máy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="upload-empty-state">
                        <Upload size={22} className="upload-icon" />
                        <span className="upload-main-text">Bấm vào đây để chọn ảnh từ máy</span>
                        <span className="upload-sub-text">Hỗ trợ PNG, JPG, WEBP, GIF (Tự động lưu vào dữ liệu)</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {uploadError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>
                  ⚠️ {uploadError}
                </div>
              )}
            </div>
          </div>

          <div className="form-grid-3">
            <div className="modal-form-group">
              <label>Màn hình</label>
              <input type="text" value={screen} onChange={(e) => setScreen(e.target.value)} />
            </div>
            <div className="modal-form-group">
              <label>Chipset</label>
              <input type="text" value={chipset} onChange={(e) => setChipset(e.target.value)} />
            </div>
            <div className="modal-form-group">
              <label>Pin & Sạc</label>
              <input type="text" value={battery} onChange={(e) => setBattery(e.target.value)} />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="modal-form-group">
              <label>Hệ thống Camera</label>
              <input type="text" value={camera} onChange={(e) => setCamera(e.target.value)} />
            </div>
            <div className="modal-form-group">
              <label>Hệ Điều Hành (OS)</label>
              <input type="text" value={os} onChange={(e) => setOs(e.target.value)} />
            </div>
            <div className="modal-form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                <input 
                  type="checkbox" 
                  checked={featured} 
                  onChange={(e) => setFeatured(e.target.checked)} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>Đánh dấu Nổi bật (Featured)</span>
              </label>
            </div>
          </div>

          <div className="modal-form-group" style={{ marginBottom: '16px' }}>
            <label>Mô tả tóm tắt sản phẩm</label>
            <textarea 
              rows={2} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Nhập mô tả nổi bật về hiệu năng, camera, thiết kế..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontFamily: 'inherit',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Initial Variant */}
          <div className="variant-box">
            <h4>Phiên Bản Khởi Tạo Đầu Tiên</h4>
            <div className="form-grid-3">
              <div className="modal-form-group">
                <label>Màu sắc</label>
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
              <div className="modal-form-group">
                <label>Dung lượng</label>
                <input type="text" value={storage} onChange={(e) => setStorage(e.target.value)} />
              </div>
              <div className="modal-form-group">
                <label>Tồn kho</label>
                <input type="number" min={1} value={stockQuantity} onChange={(e) => setStockQuantity(parseInt(e.target.value) || 1)} />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="modal-form-group">
                <label>Giá bán (VNĐ)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="modal-form-group">
                <label>Giá niêm yết (VNĐ)</label>
                <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Đang tạo máy...' : 'Tạo Điện Thoại Ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Subcomponent: EditProductModal
const EditProductModal: React.FC<{ 
  product: ProductDetail; 
  onClose: () => void; 
  onSuccess: () => void;
}> = ({ product, onClose, onSuccess }) => {
  const [name, setName] = useState(product.name || '');
  const [brandId, setBrandId] = useState<number>(product.brand?.id || 1);
  const [categoryId, setCategoryId] = useState<number>(product.category?.id || 1);
  const [thumbnailUrl, setThumbnailUrl] = useState(product.thumbnailUrl || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [useManualUrl, setUseManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState(product.description || '');
  const [screen, setScreen] = useState(product.screen || '');
  const [chipset, setChipset] = useState(product.chipset || '');
  const [battery, setBattery] = useState(product.battery || '');
  const [camera, setCamera] = useState(product.camera || '');
  const [os, setOs] = useState(product.os || '');
  const [featured, setFeatured] = useState(product.featured ?? false);

  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chỉ chọn tệp hình ảnh (PNG, JPG, WEBP, GIF)');
      return;
    }

    try {
      setUploadingImage(true);
      setUploadError(null);
      const res = await uploadService.uploadImage(file);
      setThumbnailUrl(res.url);
      setUploadedFileName(file.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tải ảnh lên máy chủ thất bại';
      setUploadError(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên điện thoại');
      return;
    }
    if (!thumbnailUrl.trim()) {
      alert('Vui lòng chọn hình ảnh từ máy tính hoặc cung cấp đường dẫn ảnh');
      return;
    }

    try {
      setLoading(true);
      const payload: CreateProductRequest = {
        name: name.trim(),
        brandId,
        categoryId,
        description,
        thumbnailUrl: thumbnailUrl.trim(),
        screen,
        chipset,
        battery,
        camera,
        os,
        featured,
        variants: product.variants?.map(v => ({
          color: v.color,
          colorCode: v.colorCode,
          ram: v.ram,
          storage: v.storage,
          price: v.price,
          originalPrice: v.originalPrice,
          stockQuantity: v.stockQuantity,
          sku: v.sku,
          imageUrl: v.imageUrl || thumbnailUrl.trim()
        })) || []
      };

      await adminService.updateProduct(product.id, payload);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cập nhật sản phẩm thất bại';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Sửa Thông Tin Điện Thoại</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Mã sản phẩm: #{product.id} • {product.name}</span>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="create-product-form">
          <div className="form-grid-2">
            <div className="modal-form-group">
              <label>Tên Điện Thoại *</label>
              <input 
                type="text" 
                placeholder="Ví dụ: iPhone 16 Plus"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="modal-form-group">
              <label>Hãng (Brand) *</label>
              <select value={brandId} onChange={(e) => setBrandId(parseInt(e.target.value))}>
                <option value={1}>Apple</option>
                <option value={2}>Samsung</option>
                <option value={3}>Xiaomi</option>
                <option value={4}>OPPO</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="modal-form-group">
              <label>Danh mục *</label>
              <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value))}>
                <option value={1}>Điện thoại Flagship</option>
                <option value={2}>Điện thoại Tầm trung</option>
                <option value={3}>Điện thoại Phổ thông</option>
              </select>
            </div>

            <div className="modal-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Hình Ảnh Đại Diện *</label>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => setUseManualUrl(!useManualUrl)}
                >
                  {useManualUrl ? '📁 Chọn ảnh từ máy tính' : '🔗 Hoặc dán link URL'}
                </button>
              </div>

              {useManualUrl ? (
                <input 
                  type="url" 
                  placeholder="https://example.com/phone-image.jpg"
                  value={thumbnailUrl} 
                  onChange={(e) => setThumbnailUrl(e.target.value)} 
                  required 
                />
              ) : (
                <>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileUpload} 
                  />

                  <div 
                    className="image-upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadingImage ? (
                      <div className="upload-loading-state">
                        <RotateCcw className="spin-icon" size={20} style={{ color: '#38bdf8' }} />
                        <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                          Đang tải và lưu trữ ảnh lên hệ thống...
                        </span>
                      </div>
                    ) : thumbnailUrl ? (
                      <div className="upload-preview-state">
                        <img src={thumbnailUrl} alt="Preview" className="upload-preview-img" />
                        <div className="upload-preview-info">
                          <div className="upload-success-badge">
                            <CheckCircle size={14} style={{ color: '#10b981' }} />
                            <span>Ảnh hiện tại (Bấm vào đây để đổi)</span>
                          </div>
                          <div className="upload-filename">{uploadedFileName || thumbnailUrl}</div>
                          <button 
                            type="button" 
                            className="btn-change-image"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            Đổi ảnh khác từ máy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="upload-empty-state">
                        <Upload size={22} className="upload-icon" />
                        <span className="upload-main-text">Bấm vào đây để chọn ảnh từ máy</span>
                        <span className="upload-sub-text">Hỗ trợ PNG, JPG, WEBP, GIF (Tự động lưu vào dữ liệu)</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {uploadError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>
                  ⚠️ {uploadError}
                </div>
              )}
            </div>
          </div>

          <div className="form-grid-3">
            <div className="modal-form-group">
              <label>Màn hình</label>
              <input type="text" value={screen} onChange={(e) => setScreen(e.target.value)} />
            </div>
            <div className="modal-form-group">
              <label>Chipset</label>
              <input type="text" value={chipset} onChange={(e) => setChipset(e.target.value)} />
            </div>
            <div className="modal-form-group">
              <label>Pin & Sạc</label>
              <input type="text" value={battery} onChange={(e) => setBattery(e.target.value)} />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="modal-form-group">
              <label>Hệ thống Camera</label>
              <input type="text" value={camera} onChange={(e) => setCamera(e.target.value)} />
            </div>
            <div className="modal-form-group">
              <label>Hệ Điều Hành (OS)</label>
              <input type="text" value={os} onChange={(e) => setOs(e.target.value)} />
            </div>
            <div className="modal-form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                <input 
                  type="checkbox" 
                  checked={featured} 
                  onChange={(e) => setFeatured(e.target.checked)} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>Đánh dấu Nổi bật (Featured)</span>
              </label>
            </div>
          </div>

          <div className="modal-form-group" style={{ marginBottom: '16px' }}>
            <label>Mô tả chi tiết sản phẩm</label>
            <textarea 
              rows={3} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Nhập mô tả nổi bật về hiệu năng, camera, thiết kế..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontFamily: 'inherit',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Đang lưu thay đổi...' : 'Cập Nhật Thông Tin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
