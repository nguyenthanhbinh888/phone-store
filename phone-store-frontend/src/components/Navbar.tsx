import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Smartphone, 
  Search, 
  ShoppingCart, 
  Sparkles, 
  Flame, 
  Menu, 
  X,
  Server,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Package
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { healthService } from '../services/api';

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { totalCount, toastMessage, clearToast } = useCart();
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    logout, 
    openAuthModal, 
    authNotification, 
    clearNotification 
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    healthService.checkHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Auth Notification Toast */}
      {authNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(16, 185, 129, 0.4)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.92rem',
          fontWeight: 500,
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <CheckCircle2 size={18} style={{ color: '#34d399' }} />
          <span>{authNotification}</span>
          <button 
            onClick={clearNotification}
            style={{
              background: 'none',
              border: 'none',
              color: '#a7f3d0',
              cursor: 'pointer',
              marginLeft: '8px',
              padding: '2px'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Cart Notification Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: authNotification ? '80px' : '20px',
          right: '20px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(79, 70, 229, 0.4)',
          border: '1px solid rgba(129, 140, 248, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.92rem',
          fontWeight: 500,
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <Sparkles size={18} style={{ color: '#38bdf8' }} />
          <span>{toastMessage}</span>
          <button 
            onClick={clearToast}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              marginLeft: '8px',
              padding: '2px'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'var(--transition)'
      }}>
        {/* Top Announcement Bar */}
        <div style={{
          backgroundColor: 'rgba(79, 70, 229, 0.15)',
          borderBottom: '1px solid rgba(79, 70, 229, 0.2)',
          padding: '6px 16px',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 'var(--container-max)',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={14} style={{ color: '#f59e0b' }} />
            <span>Hệ thống tài khoản và phân quyền JWT (Admin / Khách hàng) đã kích hoạt!</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
            <Server size={12} style={{ color: backendOnline ? '#10b981' : '#f59e0b' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Spring Boot API:</span>
            <span style={{ 
              color: backendOnline ? '#10b981' : '#f59e0b',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: backendOnline ? '#10b981' : '#f59e0b',
                display: 'inline-block',
                boxShadow: backendOnline ? '0 0 6px #10b981' : 'none'
              }}></span>
              {backendOnline === null ? 'Đang kết nối...' : backendOnline ? 'Sẵn sàng (Live)' : 'Đang khởi động'}
            </span>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          {/* Logo */}
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
            }}>
              <Smartphone size={22} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                letterSpacing: '-0.5px',
                background: 'linear-gradient(to right, #ffffff, #c7d2fe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                PHONE STORE
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '1px' }}>
                GEN-Z TECH STORE
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            style={{
              flex: 1,
              maxWidth: '420px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '14px',
                color: 'var(--text-muted)'
              }}
            />
            <input 
              type="text"
              placeholder="Tìm kiếm iPhone 16 Pro, Galaxy S24 Ultra, Xiaomi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 42px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'var(--transition)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </form>

          {/* Nav Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <Link to="/" style={{
              color: location.pathname === '/' ? '#38bdf8' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              transition: 'var(--transition)'
            }}>
              Trang chủ
            </Link>

            <Link to="/products" style={{
              color: location.pathname.startsWith('/products') && location.pathname !== '/products/featured' ? '#38bdf8' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              transition: 'var(--transition)'
            }}>
              Tất cả điện thoại
            </Link>

            <Link to="/products?categorySlug=flagship" style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              transition: 'var(--transition)'
            }}>
              Flagship
            </Link>

            {isAdmin && (
              <Link to="/admin" style={{
                color: '#fbbf24',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                transition: 'var(--transition)'
              }}>
                <ShieldCheck size={15} />
                Quản trị
              </Link>
            )}
          </nav>

          {/* Right Action Icons (Auth & Cart) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Cart Icon */}
            <Link 
              to="/cart"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'var(--transition)'
              }}
              title="Xem giỏ hàng"
            >
              <ShoppingCart size={20} />
              {totalCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.5)'
                }}>
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Authentication Buttons / Profile */}
            {isAuthenticated && user ? (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 14px 6px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isAdmin ? 'rgba(245, 158, 11, 0.12)' : 'rgba(79, 70, 229, 0.15)',
                    border: `1px solid ${isAdmin ? 'rgba(245, 158, 11, 0.35)' : 'rgba(79, 70, 229, 0.3)'}`,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: isAdmin ? '#d97706' : '#4f46e5',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}>
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                      {user.fullName || user.username}
                    </div>
                    <div style={{ 
                      fontSize: '0.68rem', 
                      color: isAdmin ? '#fbbf24' : '#38bdf8', 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {isAdmin ? <ShieldCheck size={11} /> : null}
                      {isAdmin ? 'ADMIN' : 'THÀNH VIÊN'}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '115%',
                      width: '230px',
                      backgroundColor: 'rgba(17, 24, 39, 0.98)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                      padding: '8px',
                      zIndex: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      marginBottom: '4px'
                    }}>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Đăng nhập với email:</div>
                      <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600, wordBreak: 'break-all' }}>
                        {user.email}
                      </div>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: 'rgba(245, 158, 11, 0.12)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#fbbf24',
                          textDecoration: 'none',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          transition: 'background 0.2s ease',
                          textAlign: 'left',
                          border: '1px solid rgba(245, 158, 11, 0.25)'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.22)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.12)')}
                      >
                        <ShieldCheck size={16} style={{ color: '#fbbf24' }} />
                        ⚡ Quản trị Admin
                      </Link>
                    )}

                    <Link
                      to="/orders/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'transparent',
                        borderRadius: 'var(--radius-sm)',
                        color: '#f8fafc',
                        textDecoration: 'none',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        transition: 'background 0.2s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Package size={16} style={{ color: '#38bdf8' }} />
                      Đơn hàng của tôi
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        color: '#ef4444',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(79, 70, 229, 0.15)',
                    border: '1px solid rgba(79, 70, 229, 0.4)',
                    color: '#c7d2fe',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.15)';
                    e.currentTarget.style.color = '#c7d2fe';
                  }}
                >
                  <UserIcon size={16} />
                  <span>Đăng nhập</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            padding: '16px 20px 24px',
            backgroundColor: 'rgba(15, 23, 42, 0.98)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}
            >
              Trang chủ
            </Link>
            <Link 
              to="/products" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}
            >
              Tất cả điện thoại
            </Link>
            <Link 
              to="/products?categorySlug=flagship" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}
            >
              Điện thoại Flagship
            </Link>

            {isAdmin && (
              <Link 
                to="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ShieldCheck size={18} />
                Quản trị Admin
              </Link>
            )}

            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Đăng nhập / Đăng ký
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};
