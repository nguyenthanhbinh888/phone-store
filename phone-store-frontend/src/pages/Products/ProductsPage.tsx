import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import type { ProductSummary, Brand, Category, PageResponse } from '../../types';
import { productService, brandService, categoryService } from '../../services/api';
import { ProductCard } from '../../components/ProductCard';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States initialized from URL params
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedBrandSlug, setSelectedBrandSlug] = useState(searchParams.get('brandSlug') || '');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(searchParams.get('categorySlug') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'all');
  const [selectedRam, setSelectedRam] = useState(searchParams.get('ram') || '');
  const [selectedStorage, setSelectedStorage] = useState(searchParams.get('storage') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 0);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'id');
  const [sortDir, setSortDir] = useState(searchParams.get('sortDir') || 'desc');

  // Data States
  const [productPage, setProductPage] = useState<PageResponse<ProductSummary> | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load Brand and Category options once
  useEffect(() => {
    Promise.all([
      brandService.getAllBrands(),
      categoryService.getAllCategories()
    ])
      .then(([bList, cList]) => {
        setBrands(bList);
        setCategories(cList);
      })
      .catch(console.error);
  }, []);

  // Sync state when URL params change (e.g. from navbar clicks)
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setSelectedBrandSlug(searchParams.get('brandSlug') || '');
    setSelectedCategorySlug(searchParams.get('categorySlug') || '');
    setPriceRange(searchParams.get('priceRange') || 'all');
    setSelectedRam(searchParams.get('ram') || '');
    setSelectedStorage(searchParams.get('storage') || '');
    setCurrentPage(Number(searchParams.get('page')) || 0);
    setSortBy(searchParams.get('sortBy') || 'id');
    setSortDir(searchParams.get('sortDir') || 'desc');
  }, [searchParams]);

  // Fetch Products based on current filters
  useEffect(() => {
    setLoading(true);
    setError(null);

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (priceRange === 'under-10m') {
      maxPrice = 10000000;
    } else if (priceRange === '10m-20m') {
      minPrice = 10000000;
      maxPrice = 20000000;
    } else if (priceRange === '20m-30m') {
      minPrice = 20000000;
      maxPrice = 30000000;
    } else if (priceRange === 'above-30m') {
      minPrice = 30000000;
    }

    productService.getProducts({
      keyword: keyword.trim() || undefined,
      brandSlug: selectedBrandSlug || undefined,
      categorySlug: selectedCategorySlug || undefined,
      minPrice,
      maxPrice,
      ram: selectedRam || undefined,
      storage: selectedStorage || undefined,
      page: currentPage,
      size: 9,
      sortBy,
      sortDir
    })
      .then((data) => {
        setProductPage(data);
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách sản phẩm:', err);
        setError('Không thể tải sản phẩm từ backend.');
      })
      .finally(() => setLoading(false));

    document.title = 'Danh Sách Điện Thoại — Phone Store';
  }, [keyword, selectedBrandSlug, selectedCategorySlug, priceRange, selectedRam, selectedStorage, currentPage, sortBy, sortDir]);

  // Update URL search parameters
  const updateUrlParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '0'); // reset to first page on filter change
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setKeyword('');
    setSelectedBrandSlug('');
    setSelectedCategorySlug('');
    setPriceRange('all');
    setSelectedRam('');
    setSelectedStorage('');
    setCurrentPage(0);
  };

  return (
    <div style={{
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '30px 20px 80px'
    }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Tất Cả Điện Thoại</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Tìm kiếm & lọc thông minh theo hãng, mức giá và cấu hình mong muốn
          </p>
        </div>

        {/* Toolbar & Sort dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setMobileFilterOpen(true)}
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
            className="mobile-filter-btn"
          >
            <SlidersHorizontal size={16} />
            <span>Bộ lọc</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Sắp xếp:</span>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('-');
                const newParams = new URLSearchParams(searchParams);
                newParams.set('sortBy', sb);
                newParams.set('sortDir', sd);
                setSearchParams(newParams);
              }}
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                outline: 'none',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="id-desc">Mới nhất</option>
              <option value="name-asc">Tên (A đến Z)</option>
              <option value="name-desc">Tên (Z đến A)</option>
              <option value="createdAt-desc">Thời gian ra mắt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Left Filter Sidebar (Desktop) */}
        <aside style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
              <Filter size={18} style={{ color: 'var(--accent)' }} />
              <span>Bộ Lọc Sản Phẩm</span>
            </div>
            <button
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem'
              }}
            >
              <RotateCcw size={13} />
              <span>Đặt lại</span>
            </button>
          </div>

          {/* Search Box */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Từ khóa tìm kiếm
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Nhập tên máy..."
                value={keyword}
                onChange={(e) => updateUrlParam('keyword', e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Brands Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)' }}>
              Hãng sản xuất
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={() => updateUrlParam('brandSlug', '')}
                style={{
                  textAlign: 'left',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: selectedBrandSlug === '' ? 'rgba(79, 70, 229, 0.2)' : 'transparent',
                  color: selectedBrandSlug === '' ? '#818cf8' : 'var(--text-secondary)',
                  fontWeight: selectedBrandSlug === '' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                Tất cả các hãng
              </button>
              {brands.map(b => (
                <button
                  key={b.id}
                  onClick={() => updateUrlParam('brandSlug', b.slug)}
                  style={{
                    textAlign: 'left',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: selectedBrandSlug === b.slug ? 'rgba(79, 70, 229, 0.2)' : 'transparent',
                    color: selectedBrandSlug === b.slug ? '#818cf8' : 'var(--text-secondary)',
                    fontWeight: selectedBrandSlug === b.slug ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)' }}>
              Phân khúc danh mục
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={() => updateUrlParam('categorySlug', '')}
                style={{
                  textAlign: 'left',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: selectedCategorySlug === '' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  color: selectedCategorySlug === '' ? '#38bdf8' : 'var(--text-secondary)',
                  fontWeight: selectedCategorySlug === '' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Tất cả phân khúc
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => updateUrlParam('categorySlug', c.slug)}
                  style={{
                    textAlign: 'left',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: selectedCategorySlug === c.slug ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                    color: selectedCategorySlug === c.slug ? '#38bdf8' : 'var(--text-secondary)',
                    fontWeight: selectedCategorySlug === c.slug ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)' }}>
              Khoảng giá
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { id: 'all', label: 'Tất cả mức giá' },
                { id: 'under-10m', label: 'Dưới 10 triệu' },
                { id: '10m-20m', label: '10 - 20 triệu' },
                { id: '20m-30m', label: '20 - 30 triệu' },
                { id: 'above-30m', label: 'Trên 30 triệu (Flagship)' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => updateUrlParam('priceRange', p.id === 'all' ? '' : p.id)}
                  style={{
                    textAlign: 'left',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: priceRange === p.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    color: priceRange === p.id ? '#34d399' : 'var(--text-secondary)',
                    fontWeight: priceRange === p.id ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Storage (ROM) Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)' }}>
              Dung lượng bộ nhớ
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['', '128GB', '256GB', '512GB', '1TB'].map(s => (
                <button
                  key={s || 'all'}
                  onClick={() => updateUrlParam('storage', s)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: selectedStorage === s ? 'rgba(79, 70, 229, 0.3)' : 'transparent',
                    color: selectedStorage === s ? '#c7d2fe' : 'var(--text-secondary)',
                    fontWeight: selectedStorage === s ? 700 : 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {s || 'Tất cả'}
                </button>
              ))}
            </div>
          </div>

          {/* RAM Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)' }}>
              Bộ nhớ RAM
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['', '8GB', '12GB', '16GB'].map(r => (
                <button
                  key={r || 'all'}
                  onClick={() => updateUrlParam('ram', r)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: selectedRam === r ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                    color: selectedRam === r ? '#38bdf8' : 'var(--text-secondary)',
                    fontWeight: selectedRam === r ? 700 : 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {r || 'Tất cả'}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Product Grid & Pagination */}
        <main>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              Đang truy vấn dữ liệu từ Spring Boot backend...
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
          ) : !productPage || productPage.items.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                Không tìm thấy điện thoại nào phù hợp
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Thử thay đổi bộ lọc tìm kiếm hoặc xóa các điều kiện lọc hiện tại.
              </p>
              <button
                onClick={handleResetFilters}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
              }}>
                {productPage.items.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {productPage.totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <button
                    disabled={productPage.first}
                    onClick={() => updateUrlParam('page', (currentPage - 1).toString())}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: productPage.first ? 'var(--text-muted)' : 'var(--text-primary)',
                      cursor: productPage.first ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Trước</span>
                  </button>

                  {Array.from({ length: productPage.totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => updateUrlParam('page', index.toString())}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: currentPage === index ? 'var(--primary)' : 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: '#ffffff',
                        fontWeight: currentPage === index ? 700 : 500,
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={productPage.last}
                    onClick={() => updateUrlParam('page', (currentPage + 1).toString())}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: productPage.last ? 'var(--text-muted)' : 'var(--text-primary)',
                      cursor: productPage.last ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>Sau</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            width: '85%',
            maxWidth: '360px',
            backgroundColor: '#0f172a',
            height: '100%',
            overflowY: 'auto',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Bộ Lọc Điện Thoại</div>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>
            <button
              onClick={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
              style={{
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Đặt lại tất cả bộ lọc
            </button>
            <button
              onClick={() => setMobileFilterOpen(false)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 'auto'
              }}
            >
              Xem {productPage?.totalElements || 0} sản phẩm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
