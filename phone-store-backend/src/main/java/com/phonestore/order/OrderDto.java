package com.phonestore.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDto {
    private Long id;
    private String orderCode;
    private Long userId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String shippingAddress;
    private String note;
    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private OrderStatus status;
    private String statusDescription;
    private PaymentMethod paymentMethod;
    private String paymentMethodDescription;
    private PaymentStatus paymentStatus;
    private String paymentStatusDescription;
    private List<OrderItemDto> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderDto() {
    }

    public OrderDto(Long id, String orderCode, Long userId, String customerName, String customerPhone, String customerEmail,
                    String shippingAddress, String note, BigDecimal totalAmount, BigDecimal shippingFee,
                    BigDecimal discountAmount, BigDecimal finalAmount, OrderStatus status, String statusDescription,
                    PaymentMethod paymentMethod, String paymentMethodDescription, PaymentStatus paymentStatus,
                    String paymentStatusDescription, List<OrderItemDto> items, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.orderCode = orderCode;
        this.userId = userId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
        this.shippingAddress = shippingAddress;
        this.note = note;
        this.totalAmount = totalAmount;
        this.shippingFee = shippingFee;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
        this.status = status;
        this.statusDescription = statusDescription;
        this.paymentMethod = paymentMethod;
        this.paymentMethodDescription = paymentMethodDescription;
        this.paymentStatus = paymentStatus;
        this.paymentStatusDescription = paymentStatusDescription;
        if (items != null) {
            this.items = items;
        }
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static OrderDto fromEntity(Order order) {
        if (order == null) return null;
        List<OrderItemDto> itemDtos = order.getOrderItems() != null
                ? order.getOrderItems().stream().map(OrderItemDto::fromEntity).collect(Collectors.toList())
                : new ArrayList<>();

        return new OrderDto(
                order.getId(),
                order.getOrderCode(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getCustomerEmail(),
                order.getShippingAddress(),
                order.getNote(),
                order.getTotalAmount(),
                order.getShippingFee(),
                order.getDiscountAmount(),
                order.getFinalAmount(),
                order.getStatus(),
                order.getStatus() != null ? order.getStatus().getDescription() : null,
                order.getPaymentMethod(),
                order.getPaymentMethod() != null ? order.getPaymentMethod().getDescription() : null,
                order.getPaymentStatus(),
                order.getPaymentStatus() != null ? order.getPaymentStatus().getDescription() : null,
                itemDtos,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getStatusDescription() { return statusDescription; }
    public void setStatusDescription(String statusDescription) { this.statusDescription = statusDescription; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentMethodDescription() { return paymentMethodDescription; }
    public void setPaymentMethodDescription(String paymentMethodDescription) { this.paymentMethodDescription = paymentMethodDescription; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentStatusDescription() { return paymentStatusDescription; }
    public void setPaymentStatusDescription(String paymentStatusDescription) { this.paymentStatusDescription = paymentStatusDescription; }

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
