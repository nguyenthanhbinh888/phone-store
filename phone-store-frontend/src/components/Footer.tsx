import React from 'react';
import { Smartphone, ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      backgroundColor: '#070a12',
      borderTop: '1px solid var(--border-color)',
      padding: '60px 20px 24px',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto'
      }}>
        {/* Value Propositions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          paddingBottom: '48px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '48px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8'
            }}>
              <Truck size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Giao Hàng Miễn Phí</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Đơn hàng từ 2.000.000₫ toàn quốc</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Chính Hãng 100%</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Bảo hành 12 tháng tại hãng</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Đổi Trả 30 Ngày</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>1 đổi 1 nếu lỗi nhà sản xuất</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <Headphones size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Hỗ Trợ 24/7</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tư vấn kỹ thuật tận tình</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '48px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Smartphone size={18} />
              </div>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>PHONE STORE</span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
              Hệ thống bán lẻ điện thoại thông minh chính hãng uy tín hàng đầu. Cam kết chất lượng, bảo hành tận tâm và ưu đãi tốt nhất thị trường.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '16px' }}>Thương Hiệu</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><Link to="/products?brandSlug=apple" style={{ color: 'inherit', textDecoration: 'none' }}>Apple iPhone</Link></li>
              <li><Link to="/products?brandSlug=samsung" style={{ color: 'inherit', textDecoration: 'none' }}>Samsung Galaxy</Link></li>
              <li><Link to="/products?brandSlug=xiaomi" style={{ color: 'inherit', textDecoration: 'none' }}>Xiaomi & Redmi</Link></li>
              <li><Link to="/products?brandSlug=oppo" style={{ color: 'inherit', textDecoration: 'none' }}>OPPO Reno & Find</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '16px' }}>Phân Khúc</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><Link to="/products?categorySlug=flagship" style={{ color: 'inherit', textDecoration: 'none' }}>Điện thoại Flagship</Link></li>
              <li><Link to="/products?categorySlug=tam-trung" style={{ color: 'inherit', textDecoration: 'none' }}>Điện thoại Tầm trung</Link></li>
              <li><Link to="/products?categorySlug=pho-thong" style={{ color: 'inherit', textDecoration: 'none' }}>Điện thoại Phổ thông</Link></li>
              <li><Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>Tất cả sản phẩm</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '16px' }}>Liên Hệ & Hỗ Trợ</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>Hotline mua hàng: <strong style={{ color: 'var(--text-primary)' }}>1800 6868</strong></li>
              <li>Email: <span style={{ color: 'var(--accent)' }}>support@phonestore.vn</span></li>
              <li>Địa chỉ: Toà nhà Innovation, Hà Nội & TP. Hồ Chí Minh</li>
              <li>Phương thức thanh toán: COD, Thẻ, Chuyển khoản</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '24px'
        }}>
          © 2026 Phone Store. Dự án Full-stack Java Spring Boot 3.4 & React 19 TypeScript Vite.
        </div>
      </div>
    </footer>
  );
};
