import type { 
  ApiResponse, 
  PageResponse, 
  ProductSummary, 
  ProductDetail, 
  ProductVariant,
  Brand, 
  Category, 
  ProductFilterParams,
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  OrderDto,
  OrderStatus,
  PaymentStatus,
  CreateOrderRequest,
  DashboardDto,
  VietQrResponse,
  CreateProductRequest,
  UpdateStockRequest,
  ReviewDto,
  ProductReviewSummaryDto,
  CreateReviewRequest
} from '../types';

const BASE_URL = '/api';

export const TOKEN_KEY = 'phone_store_token';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = errorBody?.message || `Lỗi yêu cầu máy chủ: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  const response: ApiResponse<T> = await res.json();
  if (!response.success) {
    throw new Error(response.message || 'Thao tác không thành công');
  }

  return response.data;
}

export const authService = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    return fetchJson<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    return fetchJson<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return fetchJson<User>('/auth/me');
  },
};

export const productService = {
  getProducts: async (params?: ProductFilterParams): Promise<PageResponse<ProductSummary>> => {
    const query = new URLSearchParams();
    if (params) {
      if (params.keyword) query.set('keyword', params.keyword);
      if (params.brandId) query.set('brandId', params.brandId.toString());
      if (params.brandSlug) query.set('brandSlug', params.brandSlug);
      if (params.categoryId) query.set('categoryId', params.categoryId.toString());
      if (params.categorySlug) query.set('categorySlug', params.categorySlug);
      if (params.minPrice) query.set('minPrice', params.minPrice.toString());
      if (params.maxPrice) query.set('maxPrice', params.maxPrice.toString());
      if (params.ram) query.set('ram', params.ram);
      if (params.storage) query.set('storage', params.storage);
      if (params.page !== undefined) query.set('page', params.page.toString());
      if (params.size !== undefined) query.set('size', params.size.toString());
      if (params.sortBy) query.set('sortBy', params.sortBy);
      if (params.sortDir) query.set('sortDir', params.sortDir);
    }
    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return fetchJson<PageResponse<ProductSummary>>(endpoint);
  },

  getFeaturedProducts: async (): Promise<ProductSummary[]> => {
    return fetchJson<ProductSummary[]>('/products/featured');
  },

  getProductBySlug: async (slug: string): Promise<ProductDetail> => {
    return fetchJson<ProductDetail>(`/products/slug/${encodeURIComponent(slug)}`);
  },

  getProductById: async (id: number): Promise<ProductDetail> => {
    return fetchJson<ProductDetail>(`/products/${id}`);
  },
};

export const brandService = {
  getAllBrands: async (): Promise<Brand[]> => {
    return fetchJson<Brand[]>('/brands');
  },
};

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    return fetchJson<Category[]>('/categories');
  },
};

export const healthService = {
  checkHealth: async (): Promise<{ status: string; service: string; database: string }> => {
    return fetchJson<{ status: string; service: string; database: string }>('/health');
  },
};

export const orderService = {
  createOrder: async (request: CreateOrderRequest): Promise<OrderDto> => {
    return fetchJson<OrderDto>('/orders', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  getOrderByCode: async (orderCode: string): Promise<OrderDto> => {
    return fetchJson<OrderDto>(`/orders/code/${encodeURIComponent(orderCode)}`);
  },

  getOrderById: async (id: number): Promise<OrderDto> => {
    return fetchJson<OrderDto>(`/orders/${id}`);
  },

  getMyOrders: async (): Promise<OrderDto[]> => {
    return fetchJson<OrderDto[]>('/orders/my-orders');
  },

  cancelOrder: async (orderId: number): Promise<OrderDto> => {
    return fetchJson<OrderDto>(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    });
  },
};

export const adminService = {
  getDashboardStats: async (): Promise<DashboardDto> => {
    return fetchJson<DashboardDto>('/admin/dashboard');
  },

  getOrders: async (params?: { status?: OrderStatus; page?: number; size?: number }): Promise<PageResponse<OrderDto>> => {
    const query = new URLSearchParams();
    if (params) {
      if (params.status) query.set('status', params.status);
      if (params.page !== undefined) query.set('page', params.page.toString());
      if (params.size !== undefined) query.set('size', params.size.toString());
    }
    const qStr = query.toString();
    return fetchJson<PageResponse<OrderDto>>(qStr ? `/admin/orders?${qStr}` : '/admin/orders');
  },

  updateOrderStatus: async (id: number, status: OrderStatus): Promise<OrderDto> => {
    return fetchJson<OrderDto>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  updatePaymentStatus: async (id: number, paymentStatus: PaymentStatus): Promise<OrderDto> => {
    return fetchJson<OrderDto>(`/admin/orders/${id}/payment-status`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus }),
    });
  },

  createProduct: async (request: CreateProductRequest): Promise<ProductDetail> => {
    return fetchJson<ProductDetail>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  updateProduct: async (id: number, request: CreateProductRequest): Promise<ProductDetail> => {
    return fetchJson<ProductDetail>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },

  deleteProduct: async (id: number): Promise<void> => {
    return fetchJson<void>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  updateVariantStock: async (variantId: number, request: UpdateStockRequest): Promise<ProductVariant> => {
    return fetchJson<ProductVariant>(`/admin/products/variants/${variantId}/stock`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },
};

export const paymentService = {
  getVietQr: async (orderCode: string): Promise<VietQrResponse> => {
    return fetchJson<VietQrResponse>(`/payment/vietqr/${encodeURIComponent(orderCode)}`);
  },

  simulatePay: async (orderCode: string): Promise<OrderDto> => {
    return fetchJson<OrderDto>(`/payment/simulate-pay/${encodeURIComponent(orderCode)}`, {
      method: 'POST',
    });
  },
};

export const reviewService = {
  getProductReviews: async (productId: number): Promise<ProductReviewSummaryDto> => {
    return fetchJson<ProductReviewSummaryDto>(`/products/${productId}/reviews`);
  },

  createReview: async (productId: number, request: CreateReviewRequest): Promise<ReviewDto> => {
    return fetchJson<ReviewDto>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    return fetchJson<void>(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },
};

export const uploadService = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'Lỗi khi tải ảnh lên máy chủ lưu trữ');
    }

    return result.data;
  },
};


