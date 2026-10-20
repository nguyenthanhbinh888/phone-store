package com.phonestore.admin;

import com.phonestore.order.OrderDto;
import com.phonestore.order.OrderRepository;
import com.phonestore.order.OrderStatus;
import com.phonestore.product.ProductRepository;
import com.phonestore.product.ProductVariant;
import com.phonestore.product.ProductVariantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    public AdminDashboardService(OrderRepository orderRepository,
                                 ProductRepository productRepository,
                                 ProductVariantRepository variantRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }

    @Transactional(readOnly = true)
    public DashboardDto getDashboardStats() {
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long shippingOrders = orderRepository.countByStatus(OrderStatus.SHIPPING);
        long completedOrders = orderRepository.countByStatus(OrderStatus.COMPLETED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);
        long totalProducts = productRepository.count();

        List<ProductVariant> lowStockList = variantRepository.findByStockQuantityLessThanEqual(5);
        int lowStockCount = lowStockList.size();

        List<LowStockVariantDto> lowStockVariants = lowStockList.stream().map(v -> new LowStockVariantDto(
                v.getId(),
                v.getProduct() != null ? v.getProduct().getId() : null,
                v.getProduct() != null ? v.getProduct().getName() : "Sản phẩm",
                v.getColor(),
                v.getStorage(),
                v.getStockQuantity()
        )).collect(Collectors.toList());

        List<OrderDto> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc()
                .stream().map(OrderDto::fromEntity).collect(Collectors.toList());

        return new DashboardDto(
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                totalOrders,
                pendingOrders,
                confirmedOrders,
                shippingOrders,
                completedOrders,
                cancelledOrders,
                totalProducts,
                lowStockCount,
                recentOrders,
                lowStockVariants
        );
    }
}
