package com.phonestore.order;

import com.phonestore.common.exception.ResourceNotFoundException;
import com.phonestore.product.ProductVariant;
import com.phonestore.product.ProductVariantRepository;
import com.phonestore.user.User;
import com.phonestore.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductVariantRepository variantRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.variantRepository = variantRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request, String currentUsername) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng phải có ít nhất một sản phẩm.");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // Generate unique order code: ORD-YYYYMMDD-XXXX
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        String orderCode = "ORD-" + datePrefix + "-" + randomSuffix;

        Order order = Order.builder()
                .orderCode(orderCode)
                .customerName(request.getCustomerName().trim())
                .customerPhone(request.getCustomerPhone().trim())
                .customerEmail(request.getCustomerEmail() != null ? request.getCustomerEmail().trim() : null)
                .shippingAddress(request.getShippingAddress().trim())
                .note(request.getNote() != null ? request.getNote().trim() : null)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.COD)
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.UNPAID)
                .shippingFee(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .build();

        // Attach user if authenticated
        if (currentUsername != null && !currentUsername.isBlank()) {
            userRepository.findByUsername(currentUsername).ifPresent(order::setUser);
        }

        // Process line items & stock check
        for (CreateOrderItemRequest itemReq : request.getItems()) {
            ProductVariant variant = variantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Phiên bản sản phẩm", "id", itemReq.getVariantId()));

            int requestedQty = itemReq.getQuantity();
            if (variant.getStockQuantity() < requestedQty) {
                String productName = variant.getProduct() != null ? variant.getProduct().getName() : "Sản phẩm";
                throw new IllegalArgumentException(
                        "Sản phẩm '" + productName + " (" + variant.getColor() + ", " + variant.getStorage() + ")' "
                        + "chỉ còn " + variant.getStockQuantity() + " máy trong kho, không đủ số lượng " + requestedQty + " yêu cầu."
                );
            }

            // Deduct stock quantity
            variant.setStockQuantity(variant.getStockQuantity() - requestedQty);
            variantRepository.save(variant);

            BigDecimal unitPrice = variant.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(requestedQty));
            totalAmount = totalAmount.add(subtotal);

            String variantDetails = "Màu: " + variant.getColor() + ", Bộ nhớ: " + variant.getStorage()
                    + (variant.getRam() != null ? ", RAM: " + variant.getRam() : "");

            String thumbnail = variant.getImageUrl() != null && !variant.getImageUrl().isBlank()
                    ? variant.getImageUrl()
                    : (variant.getProduct() != null ? variant.getProduct().getThumbnailUrl() : null);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .variant(variant)
                    .productName(variant.getProduct() != null ? variant.getProduct().getName() : "Điện thoại")
                    .variantDetails(variantDetails)
                    .productThumbnail(thumbnail)
                    .unitPrice(unitPrice)
                    .quantity(requestedQty)
                    .subtotal(subtotal)
                    .build();

            order.addOrderItem(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setFinalAmount(totalAmount.add(order.getShippingFee()).subtract(order.getDiscountAmount()));

        Order savedOrder = orderRepository.save(order);
        return OrderDto.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByCode(String orderCode) {
        Order order = orderRepository.findByOrderCodeWithItems(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "mã đơn hàng", orderCode));
        return OrderDto.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "id", id));
        return OrderDto.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getMyOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", username));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto cancelOrder(Long orderId, String username, boolean isAdmin) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "id", orderId));

        if (!isAdmin) {
            if (order.getUser() == null || !order.getUser().getUsername().equals(username)) {
                throw new IllegalArgumentException("Bạn không có quyền thực hiện thao tác trên đơn hàng này.");
            }
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalArgumentException("Chỉ có thể hủy đơn hàng khi đơn đang ở trạng thái 'Chờ xử lý'.");
        }

        // Restock inventory
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getVariant() != null) {
                    ProductVariant variant = item.getVariant();
                    variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                    variantRepository.save(variant);
                }
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        return OrderDto.fromEntity(updatedOrder);
    }

    @Transactional(readOnly = true)
    public com.phonestore.common.response.PageResponse<OrderDto> getAllOrdersPaged(
            OrderStatus status, 
            org.springframework.data.domain.Pageable pageable
    ) {
        org.springframework.data.domain.Page<Order> orderPage = (status != null)
                ? orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                : orderRepository.findAllByOrderByCreatedAtDesc(pageable);

        org.springframework.data.domain.Page<OrderDto> dtoPage = orderPage.map(OrderDto::fromEntity);
        return com.phonestore.common.response.PageResponse.from(dtoPage);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "id", orderId));

        OrderStatus currentStatus = order.getStatus();
        if (currentStatus == newStatus) {
            return OrderDto.fromEntity(order);
        }

        // Nếu chuyển sang Đã hủy -> khôi phục tồn kho
        if (newStatus == OrderStatus.CANCELLED && currentStatus != OrderStatus.CANCELLED) {
            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    if (item.getVariant() != null) {
                        ProductVariant variant = item.getVariant();
                        variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                        variantRepository.save(variant);
                    }
                }
            }
        }

        // Nếu chuyển từ Đã hủy sang trạng thái khác -> trừ lại kho
        if (currentStatus == OrderStatus.CANCELLED && newStatus != OrderStatus.CANCELLED) {
            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    if (item.getVariant() != null) {
                        ProductVariant variant = item.getVariant();
                        if (variant.getStockQuantity() < item.getQuantity()) {
                            throw new IllegalArgumentException("Không thể khôi phục đơn hàng vì sản phẩm '" 
                                    + variant.getProduct().getName() + "' không đủ tồn kho hiện tại.");
                        }
                        variant.setStockQuantity(variant.getStockQuantity() - item.getQuantity());
                        variantRepository.save(variant);
                    }
                }
            }
        }

        // Tự động chuyển trạng thái thanh toán thành PAID nếu giao thành công đối với COD
        if (newStatus == OrderStatus.COMPLETED && order.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);
        return OrderDto.fromEntity(savedOrder);
    }

    @Transactional
    public OrderDto updatePaymentStatus(Long orderId, PaymentStatus newPaymentStatus) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "id", orderId));

        order.setPaymentStatus(newPaymentStatus);
        Order savedOrder = orderRepository.save(order);
        return OrderDto.fromEntity(savedOrder);
    }
}
