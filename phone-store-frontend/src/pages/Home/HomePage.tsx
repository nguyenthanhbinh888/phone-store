import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Smartphone, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Award,
  ChevronRight,
  Eye
} from 'lucide-react';
import type { ProductSummary, Brand } from '../../types';
import { productService, brandService } from '../../services/api';
import { ProductCard } from '../../components/ProductCard';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductSummary[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Phone Store — Cửa Hàng Điện Thoại Thông Minh Chính Hãng';
    
    Promise.all([
      productService.getFeaturedProducts(),
      brandService.getAllBrands()
    ])
      .then(([products, brandList]) => {
        setFeaturedProducts(products);
        setBrands(brandList);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu trang chủ:', err);
        setError('Không thể kết nối đến máy chủ Spring Boot. Hãy đảm bảo backend đang chạy tại port 8080.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Xác định sản phẩm Hot Trend nổi bật (ưu tiên iPhone 16 Pro Max hoặc sản phẩm đầu tiên)
  const hotTrendProduct = featuredProducts.find(p => p.slug === 'iphone-16-pro-max') || featuredProducts[0];
  const hotTrendSlug = hotTrendProduct?.slug || 'iphone-16-pro-max';
  const hotTrendTitle = hotTrendProduct?.name || 'iPhone 16 Pro Max 256GB';
  const hotTrendImage = hotTrendProduct?.thumbnailUrl || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80';
  const hotTrendPrice = hotTrendProduct?.minPrice 
    ? `${hotTrendProduct.minPrice.toLocaleString('vi-VN')}₫` 
    : '34.990.000₫';
  const hotTrendOldPrice = hotTrendProduct?.minPrice 
    ? `${Math.round(hotTrendProduct.minPrice * 1.06).toLocaleString('vi-VN')}₫` 
    : '36.990.000₫';

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '60px 20px 80px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at top center, rgba(79, 70, 229, 0.22) 0%, transparent 70%)'
      }}>
        <div style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '48px'
        }}>
          {/* Left Text */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(79, 70, 229, 0.15)',
              border: '1px solid rgba(129, 140, 248, 0.3)',
              color: '#818cf8',
              fontSize: '0.84rem',
              fontWeight: 600,
              marginBottom: '20px'
            }}>
              <Sparkles size={16} />
              <span>SIÊU PHẨM MÙA THU 2026</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-1px',
              marginBottom: '20px'
            }}>
              Công Nghệ <br />
              <span style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Đỉnh Cao Trong Tầm Tay
              </span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Khám phá thế hệ flagship mới nhất với chip 3nm đỉnh cao, camera tiềm vọng chuyên nghiệp và thời lượng pin vượt trội. Trải nghiệm dịch vụ giao hàng COD tận nơi và bảo hành 12 tháng.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <Link 
                to="/products"
                style={{
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 20px rgba(79, 70, 229, 0.45)',
                  transition: 'var(--transition)'
                }}
              >
                <span>Khám phá ngay</span>
                <ArrowRight size={18} />
              </Link>

              <Link 
                to="/products?categorySlug=flagship"
                style={{
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'var(--transition)'
                }}
              >
                <span>Dòng Flagship</span>
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Quick Highlights */}
            <div style={{
              marginTop: '40px',
              display: 'flex',
              gap: '24px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} style={{ color: '#10b981' }} />
                <span>Chính hãng 100%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} style={{ color: '#38bdf8' }} />
                <span>Giao hỏa tốc 2H</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: '#f59e0b' }} />
                <span>Bảo hành 1 đổi 1</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Link 
              to={`/products/${hotTrendSlug}`}
              className="hero-trending-card"
              title={`Bấm để xem chi tiết ${hotTrendTitle}`}
            >
              <div className="hero-trending-img-wrapper">
                <img 
                  src={hotTrendImage} 
                  alt={hotTrendTitle}
                  className="hero-trending-img"
                />
                
                {/* Hot Trending Badge with pulsing dot */}
                <div className="hero-trending-badge">
                  <span className="hero-trending-badge-dot"></span>
                  <span>HOT TRENDING</span>
                </div>

                {/* Hover CTA Indicator */}
                <div className="hero-trending-hover-hint">
                  <span className="hero-trending-cta-btn">
                    <Eye size={17} />
                    <span>Xem Chi Tiết Máy</span>
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>

              <div className="hero-trending-info">
                <div>
                  <div className="hero-trending-subtitle">Mẫu điện thoại bán chạy nhất</div>
                  <div className="hero-trending-title">{hotTrendTitle}</div>
                </div>
                <div className="hero-trending-price-group">
                  <div className="hero-trending-price">{hotTrendPrice}</div>
                  <div className="hero-trending-old-price">{hotTrendOldPrice}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Selection Bar */}
      <section style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto 60px',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Thương Hiệu Nổi Bật</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lựa chọn các dòng máy chính hãng theo hãng yêu thích</p>
          </div>
          <Link to="/products" style={{ fontSize: '0.88rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Xem tất cả →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {brands.map(brand => (
            <Link 
              key={brand.id}
              to={`/products?brandSlug=${brand.slug}`}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                border: '1px solid var(--border-color)',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px'
              }}>
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <Smartphone size={24} style={{ color: 'var(--accent)' }} />
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{brand.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{brand.description || 'Chính hãng 100%'}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto 60px',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444'
            }}>
              <Flame size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Điện Thoại Nổi Bật</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sản phẩm công nghệ được săn đón nhất trong tuần</p>
            </div>
          </div>

          <Link 
            to="/products"
            style={{
              color: '#38bdf8',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Xem danh sách đầy đủ</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Đang tải danh sách điện thoại từ Spring Boot backend...
          </div>
        ) : error ? (
          <div style={{
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            textAlign: 'center'
          }}>
            {error}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Category Promo Banners */}
      <section style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Flagship Banner */}
          <div style={{
            padding: '32px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(49, 46, 129, 0.6) 100%)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', letterSpacing: '1px' }}>PHÂN KHÚC CAO CẤP</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '6px', color: '#ffffff' }}>Siêu Phẩm Flagship</h3>
              <p style={{ color: '#c7d2fe', fontSize: '0.9rem', marginTop: '8px', maxWidth: '360px' }}>
                Hội tụ các công nghệ vi xử lý 3nm tân tiến nhất, khung Titan và hệ thống camera tiềm vọng đỉnh cao.
              </p>
            </div>
            <Link 
              to="/products?categorySlug=flagship"
              style={{
                marginTop: '20px',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Xem các mẫu Flagship</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mid-range Banner */}
          <div style={{
            padding: '32px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.7) 0%, rgba(4, 120, 87, 0.5) 100%)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6ee7b7', letterSpacing: '1px' }}>HIỆU NĂNG & PIN TRÂU</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '6px', color: '#ffffff' }}>Tầm Trung Đáng Mua</h3>
              <p style={{ color: '#a7f3d0', fontSize: '0.9rem', marginTop: '8px', maxWidth: '360px' }}>
                Galaxy A55, Reno12 với sạc nhanh 80W, thiết kế trẻ trung và mức giá cực kỳ phải chăng cho học sinh, sinh viên.
              </p>
            </div>
            <Link 
              to="/products?categorySlug=tam-trung"
              style={{
                marginTop: '20px',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Xem phân khúc Tầm Trung</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
