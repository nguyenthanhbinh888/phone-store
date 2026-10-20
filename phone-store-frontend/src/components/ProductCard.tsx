import { Link } from 'react-router-dom';
import type { ProductSummary } from '../types';
import { formatVND, calculateDiscount } from '../utils/format';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

interface ProductCardProps {
  product: ProductSummary;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = calculateDiscount(product.minPrice, product.originalPrice);

  return (
    <div 
      className="product-card"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'var(--transition)',
        position: 'relative'
      }}
    >
      {/* Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {product.featured && (
          <span style={{
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
          }}>
            <Sparkles size={12} /> HOT
          </span>
        )}

        {discount > 0 && (
          <span style={{
            backgroundColor: 'rgba(245, 158, 11, 0.9)',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)'
          }}>
            -{discount}%
          </span>
        )}
      </div>

      {/* Product Image Link */}
      <Link 
        to={`/products/${product.slug}`}
        style={{
          display: 'block',
          position: 'relative',
          paddingTop: '80%',
          backgroundColor: '#0f172a',
          overflow: 'hidden'
        }}
      >
        <img 
          src={product.thumbnailUrl} 
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          loading="lazy"
        />
      </Link>

      {/* Product Content */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '10px'
      }}>
        {/* Brand & Stock Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem'
        }}>
          <span style={{ 
            color: 'var(--accent)', 
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            {product.brand?.name || 'SMARTPHONE'}
          </span>

          <span style={{
            color: product.hasStock ? '#10b981' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 500
          }}>
            {product.hasStock ? <Check size={13} /> : null}
            {product.hasStock ? 'Còn hàng' : 'Hết hàng'}
          </span>
        </div>

        {/* Product Title */}
        <Link 
          to={`/products/${product.slug}`}
          style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: '1.02rem',
            fontWeight: 700,
            lineHeight: 1.4,
            transition: 'color 0.2s',
            minHeight: '2.8em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        >
          {product.name}
        </Link>

        {/* Options Chips (RAM & Storage) */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px'
        }}>
          {product.storageOptions?.map(storage => (
            <span key={storage} style={{
              fontSize: '0.72rem',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              padding: '2px 8px',
              borderRadius: '6px',
              color: 'var(--text-secondary)'
            }}>
              {storage}
            </span>
          ))}
          {product.ramOptions?.slice(0, 1).map(ram => (
            <span key={ram} style={{
              fontSize: '0.72rem',
              backgroundColor: 'rgba(79, 70, 229, 0.15)',
              color: '#818cf8',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              RAM {ram}
            </span>
          ))}
        </div>

        {/* Colors available */}
        {product.colorOptions && product.colorOptions.length > 0 && (
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Màu: {product.colorOptions.join(', ')}
          </div>
        )}

        {/* Pricing & CTA */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Giá từ:</div>
            <div style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '-0.5px'
            }}>
              {formatVND(product.minPrice)}
            </div>
            {product.originalPrice && product.originalPrice > product.minPrice && (
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                textDecoration: 'line-through'
              }}>
                {formatVND(product.originalPrice)}
              </div>
            )}
          </div>

          <Link 
            to={`/products/${product.slug}`}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
              transition: 'var(--transition)'
            }}
          >
            <span>Chi tiết</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
