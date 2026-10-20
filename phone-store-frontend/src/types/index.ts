export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductVariant {
  id: number;
  color: string;
  colorCode?: string;
  ram?: string;
  storage: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  sku?: string;
  imageUrl?: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  brand: Brand;
  category: Category;
  thumbnailUrl: string;
  minPrice: number;
  maxPrice: number;
  originalPrice?: number;
  ramOptions: string[];
  storageOptions: string[];
  colorOptions: string[];
  featured: boolean;
  hasStock: boolean;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  brand: Brand;
  category: Category;
  thumbnailUrl: string;
  screen: string;
  chipset: string;
  battery: string;
  camera: string;
  os: string;
  featured: boolean;
  active: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ProductFilterParams {
  keyword?: string;
  brandId?: number;
  brandSlug?: string;
  categoryId?: number;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  ram?: string;
  storage?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  role: Role;
  active: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'VNPAY';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface OrderItemDto {
  id: number;
  variantId?: number;
  productName: string;
  variantDetails?: string;
  productThumbnail?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderDto {
  id: number;
  orderCode: string;
  userId?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  note?: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  status: OrderStatus;
  statusDescription?: string;
  paymentMethod: PaymentMethod;
  paymentMethodDescription?: string;
  paymentStatus: PaymentStatus;
  paymentStatusDescription?: string;
  items: OrderItemDto[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderItemRequest {
  variantId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  note?: string;
  paymentMethod?: PaymentMethod;
  items: CreateOrderItemRequest[];
}

export interface LowStockVariantDto {
  variantId: number;
  productId?: number;
  productName: string;
  color: string;
  storage: string;
  stockQuantity: number;
}

export interface DashboardDto {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  lowStockCount: number;
  recentOrders: OrderDto[];
  lowStockVariants: LowStockVariantDto[];
}

export interface VietQrResponse {
  orderCode: string;
  amount: number;
  qrImageUrl: string;
  bankName: string;
  bankId: string;
  accountNumber: string;
  accountName: string;
  transferContent: string;
  paymentStatus: string;
}

export interface CreateVariantRequest {
  color: string;
  colorCode?: string;
  ram?: string;
  storage: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  sku?: string;
  imageUrl?: string;
}

export interface CreateProductRequest {
  name: string;
  brandId: number;
  categoryId: number;
  description?: string;
  thumbnailUrl: string;
  screen?: string;
  chipset?: string;
  battery?: string;
  camera?: string;
  os?: string;
  featured?: boolean;
  variants: CreateVariantRequest[];
}

export interface UpdateStockRequest {
  stockQuantity: number;
  price?: number;
}

export interface ReviewDto {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userFullName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductReviewSummaryDto {
  averageRating: number;
  totalReviews: number;
  reviews: ReviewDto[];
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}
