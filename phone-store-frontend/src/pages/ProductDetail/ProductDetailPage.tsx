import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Check, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronRight, 
  Cpu, 
  Battery, 
  Camera, 
  Tv, 
  Layers,
  Sparkles,
  ArrowLeft,
  Star,
  MessageSquare,
  Trash2,
  Send
} from 'lucide-react';
import type { ProductDetail, ProductVariant, ProductReviewSummaryDto } from '../../types';
import { productService, reviewService } from '../../services/api';
import { formatVND, calculateDiscount } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { user, isAuthenticated, isAdmin, openAuthModal } = useAuth();

  // Reviews State
  const [reviewsSummary, setReviewsSummary] = useState<ProductReviewSummaryDto | null>(null);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [commentInput, setCommentInput] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewMessage, setReviewMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadReviews = async (productId: number) => {
    try {
      setLoadingReviews(true);
      const res = await reviewService.getProductReviews(productId);
      setReviewsSummary(res);
    } catch (err) {
      console.error('Không thể tải đánh giá sản phẩm:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!commentInput.trim()) {
      setReviewMessage({ type: 'error', text: 'Vui lòng nhập nội dung nhận xét của bạn' });
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewMessage(null);
      await reviewService.createReview(product.id, {
        rating: ratingInput,
        comment: commentInput.trim(),
      });
      setReviewMessage({ type: 'success', text: 'Cảm ơn bạn! Đánh giá đã được đăng thành công.' });
      setCommentInput('');
      setRatingInput(5);
      await loadReviews(product.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gửi đánh giá thất bại';
      setReviewMessage({ type: 'error', text: msg });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!product) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      await loadReviews(product.id);
    } catch (err) {
      console.error('Lỗi khi xóa đánh giá:', err);
    }
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    productService.getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        document.title = `${data.name} — Thông Số & Giá Bán | Phone Store`;
        loadReviews(data.id);

        // Select the first variant by default
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
          setActiveImage(data.variants[0].imageUrl || data.thumbnailUrl);
        } else {
          setActiveImage(data.thumbnailUrl);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết sản phẩm:', err);
        setError('Không tìm thấy thông tin sản phẩm hoặc máy chủ không phản hồi.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '100px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Đang tải thông số kỹ thuật và các phiên bản của điện thoại...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', color: '#f87171' }}>{error || 'Sản phẩm không tồn tại'}</h2>
        <Link 
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại danh sách điện thoại</span>
        </Link>
      </div>
    );
  }

  // Extract unique colors and storages
  const uniqueColors = Array.from(new Set(product.variants.map(v => v.color)));
  const uniqueStorages = Array.from(new Set(product.variants.map(v => v.storage)));

  const handleColorSelect = (color: string) => {
    // find a variant matching the current storage or any matching variant
    const currentStorage = selectedVariant?.storage;
    const match = product.variants.find(v => v.color === color && v.storage === currentStorage)
      || product.variants.find(v => v.color === color);
    if (match) {
      setSelectedVariant(match);
      if (match.imageUrl) setActiveImage(match.imageUrl);
    }
  };

  const handleStorageSelect = (storage: string) => {
    const currentColor = selectedVariant?.color;
    const match = product.variants.find(v => v.storage === storage && v.color === currentColor)
      || product.variants.find(v => v.storage === storage);
    if (match) {
      setSelectedVariant(match);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
    }
  };

  const discount = selectedVariant 
    ? calculateDiscount(selectedVariant.price, selectedVariant.originalPrice)
    : 0;

  return (
    <div style={{
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '24px 20px 80px'
    }}>
      {/* Breadcrumb Navigation */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginBottom: '28px'
      }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ</Link>
        <ChevronRight size={14} />
        <Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>Điện thoại</Link>
        <ChevronRight size={14} />
        <Link to={`/products?brandSlug=${product.brand.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {product.brand.name}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Main Product Showcase Section: Gallery Left, Purchase Form Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '48px',
        marginBottom: '60px'
      }}>
        {/* Left Gallery */}
        <div>
          {/* Big Featured Image Preview */}
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            aspectRatio: '1',
            backgroundColor: '#0f172a',
            border: '1px solid var(--border-color)',
            marginBottom: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <img 
              src={activeImage || product.thumbnailUrl} 
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
            {product.featured && (
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={13} /> SIÊU PHẨM NỔI BẬT
              </div>
            )}
          </div>

          {/* Thumbnail List */}
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px'
          }}>
            {/* Primary Thumbnail */}
            <button
              onClick={() => setActiveImage(product.thumbnailUrl)}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: activeImage === product.thumbnailUrl ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                padding: 0,
                cursor: 'pointer',
                backgroundColor: '#0f172a',
                flexShrink: 0
              }}
            >
              <img src={product.thumbnailUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>

            {/* Additional Images */}
            {product.images?.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.imageUrl)}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: activeImage === img.imageUrl ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                  padding: 0,
                  cursor: 'pointer',
                  backgroundColor: '#0f172a',
                  flexShrink: 0
                }}
              >
                <img src={img.imageUrl} alt="Sub Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>

          {/* Trust Guarantees */}
          <div style={{
            marginTop: '28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            textAlign: 'center'
          }}>
            <div>
              <ShieldCheck size={20} style={{ color: '#10b981', margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 600 }}>Chính Hãng 100%</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Bảo hành 12 tháng</div>
            </div>
            <div>
              <Truck size={20} style={{ color: '#38bdf8', margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 600 }}>Miễn Phí Giao</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Kiểm tra nhận hàng</div>
            </div>
            <div>
              <RotateCcw size={20} style={{ color: '#f59e0b', margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 600 }}>30 Ngày Đổi Mới</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Nếu có lỗi phần cứng</div>
            </div>
          </div>
        </div>

        {/* Right Details & Configuration Selection */}
        <div>
          {/* Brand & Category Tags */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span style={{
              backgroundColor: 'rgba(79, 70, 229, 0.15)',
              color: '#818cf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>
              {product.brand.name}
            </span>
            <span style={{
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '6px'
            }}>
              {product.category.name}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
            fontWeight: 900,
            lineHeight: 1.25,
            marginBottom: '16px'
          }}>
            {product.name}
          </h1>

          {/* Pricing Box */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#38bdf8',
                letterSpacing: '-1px'
              }}>
                {selectedVariant ? formatVND(selectedVariant.price) : 'Liên hệ'}
              </span>

              {selectedVariant?.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                <span style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through'
                }}>
                  {formatVND(selectedVariant.originalPrice)}
                </span>
              )}

              {discount > 0 && (
                <span style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  Tiết kiệm {discount}%
                </span>
              )}
            </div>

            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} />
              <span>Giá đã bao gồm VAT và ưu đãi thanh toán trực tiếp khi nhận máy (COD)</span>
            </div>
          </div>

          {/* Select Storage (ROM) */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-secondary)' }}>
              1. Chọn Dung lượng bộ nhớ:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {uniqueStorages.map(storage => {
                const isSelected = selectedVariant?.storage === storage;
                return (
                  <button
                    key={storage}
                    onClick={() => handleStorageSelect(storage)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-card)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {storage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Color */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-secondary)' }}>
              2. Chọn Màu sắc: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedVariant?.color}</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {uniqueColors.map(color => {
                const isSelected = selectedVariant?.color === color;
                const variantForColor = product.variants.find(v => v.color === color);
                const colorCode = variantForColor?.colorCode || '#64748b';

                return (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #818cf8' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(129, 140, 248, 0.15)' : 'var(--bg-card)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: colorCode,
                      display: 'inline-block',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}></span>
                    <span>{color}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Availability Info */}
          <div style={{ marginBottom: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Tình trạng: {' '}
            <strong style={{ color: selectedVariant && selectedVariant.stockQuantity > 0 ? '#10b981' : '#f87171' }}>
              {selectedVariant && selectedVariant.stockQuantity > 0 
                ? `Còn hàng (${selectedVariant.stockQuantity} máy sẵn tại kho)`
                : 'Tạm hết hàng phiên bản này'}
            </strong>
          </div>

          {/* Quantity & Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
            {/* Quantity Controller */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '36px',
                  height: '44px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ width: '40px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '36px',
                  height: '44px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '14px 24px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: !selectedVariant || selectedVariant.stockQuantity <= 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
                opacity: !selectedVariant || selectedVariant.stockQuantity <= 0 ? 0.6 : 1
              }}
            >
              <ShoppingCart size={20} />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Technical Specifications & Description */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '40px',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '48px'
      }}>
        {/* Left: Detailed Description */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>Đặc Điểm Nổi Bật</h2>
          <div style={{
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-card)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)'
          }}>
            <p>{product.description}</p>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Check size={16} style={{ color: '#10b981' }} />
                <span>Hiệu năng xử lý tối tân với vi xử lý <strong>{product.chipset}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Check size={16} style={{ color: '#10b981' }} />
                <span>Màn hình hiển thị sắc nét: <strong>{product.screen}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Check size={16} style={{ color: '#10b981' }} />
                <span>Thời lượng sử dụng thoải mái suốt ngày dài: <strong>{product.battery}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Check size={16} style={{ color: '#10b981' }} />
                <span>Cụm camera chuyên nghiệp: <strong>{product.camera}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Technical Specifications Table */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>Thông Số Kỹ Thuật</h2>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}>
            {[
              { icon: <Tv size={18} style={{ color: '#38bdf8' }} />, label: 'Màn hình', value: product.screen },
              { icon: <Cpu size={18} style={{ color: '#818cf8' }} />, label: 'Vi xử lý (Chipset)', value: product.chipset },
              { icon: <Battery size={18} style={{ color: '#34d399' }} />, label: 'Dung lượng pin & sạc', value: product.battery },
              { icon: <Camera size={18} style={{ color: '#f59e0b' }} />, label: 'Hệ thống Camera', value: product.camera },
              { icon: <Layers size={18} style={{ color: '#c084fc' }} />, label: 'Hệ điều hành', value: product.os },
              { icon: <Sparkles size={18} style={{ color: '#fb7185' }} />, label: 'Hãng sản xuất', value: product.brand.name },
            ].map((spec, i) => (
              <div 
                key={spec.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 20px',
                  backgroundColor: i % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                  borderBottom: i < 5 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  fontSize: '0.88rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '180px', color: 'var(--text-muted)' }}>
                  {spec.icon}
                  <span>{spec.label}:</span>
                </div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, flex: 1 }}>
                  {spec.value || 'Đang cập nhật'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Reviews & Ratings Section */}
      <div style={{
        marginTop: '60px',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '48px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={24} style={{ color: '#38bdf8' }} />
              Đánh Giá & Nhận Xét Từ Khách Hàng
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
              Trải nghiệm thực tế từ những người đã sở hữu và sử dụng sản phẩm
            </p>
          </div>

          {/* Average Rating Score Badge */}
          {reviewsSummary && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '12px 24px',
              borderRadius: '16px'
            }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>
                {reviewsSummary.averageRating.toFixed(1)}
              </div>
              <div>
                <div style={{ display: 'flex', gap: '3px', color: '#fbbf24', marginBottom: '4px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      size={18} 
                      fill={s <= Math.round(reviewsSummary.averageRating) ? '#fbbf24' : 'none'} 
                      color="#fbbf24" 
                    />
                  ))}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Dựa trên {reviewsSummary.totalReviews} lượt đánh giá
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Review Form Box */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '40px'
        }}>
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
                Gửi đánh giá của bạn
              </h3>

              {reviewMessage && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  backgroundColor: reviewMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${reviewMessage.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  color: reviewMessage.type === 'success' ? '#34d399' : '#f87171'
                }}>
                  {reviewMessage.text}
                </div>
              )}

              {/* Star Selection */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Đánh giá độ hài lòng:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                    >
                      <Star
                        size={28}
                        fill={(hoverRating || ratingInput) >= star ? '#fbbf24' : 'none'}
                        color={(hoverRating || ratingInput) >= star ? '#fbbf24' : '#64748b'}
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24', marginLeft: '8px' }}>
                    {ratingInput === 5 ? 'Tuyệt vời, vượt mong đợi' :
                     ratingInput === 4 ? 'Rất tốt, hài lòng' :
                     ratingInput === 3 ? 'Bình thường' :
                     ratingInput === 2 ? 'Kém' : 'Rất thất vọng'}
                  </span>
                </div>
              </div>

              {/* Comment Textarea */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Nhận xét chi tiết:
                </label>
                <textarea
                  rows={3}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Chia sẻ cảm nhận về thiết kế, thời lượng pin, camera, hiệu năng máy..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    color: '#ffffff',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: submittingReview ? 'not-allowed' : 'pointer',
                  opacity: submittingReview ? 0.7 : 1,
                  transition: 'var(--transition)'
                }}
              >
                <Send size={16} />
                {submittingReview ? 'Đang gửi đánh giá...' : 'Đăng Nhận Xét'}
              </button>
            </form>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc', marginBottom: '4px' }}>
                  Bạn đã mua hoặc trải nghiệm chiếc điện thoại này?
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Vui lòng đăng nhập để viết nhận xét và giúp đỡ cộng đồng người dùng mua sắm tốt hơn.
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(79, 70, 229, 0.18)',
                  border: '1px solid rgba(79, 70, 229, 0.45)',
                  color: '#a5b4fc',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.18)';
                  e.currentTarget.style.color = '#a5b4fc';
                }}
              >
                Đăng nhập ngay
              </button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loadingReviews ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Đang tải danh sách đánh giá...
            </div>
          ) : reviewsSummary && reviewsSummary.reviews.length > 0 ? (
            reviewsSummary.reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  padding: '20px',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.95rem'
                    }}>
                      {rev.userFullName ? rev.userFullName.charAt(0).toUpperCase() : rev.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.92rem' }}>
                        {rev.userFullName || rev.userName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(rev.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={15}
                          fill={s <= rev.rating ? '#fbbf24' : 'none'}
                          color="#fbbf24"
                        />
                      ))}
                    </div>

                    {(isAdmin || (user && user.id === rev.userId)) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(rev.id)}
                        title="Xóa đánh giá"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          opacity: 0.7,
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {rev.comment}
                </p>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '14px',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-muted)'
            }}>
              Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên chia sẻ cảm nhận!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
