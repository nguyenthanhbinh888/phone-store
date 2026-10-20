package com.phonestore.order;

import java.math.BigDecimal;

public class OrderItemDto {
    private Long id;
    private Long variantId;
    private String productName;
    private String variantDetails;
    private String productThumbnail;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;

    public OrderItemDto() {
    }

    public OrderItemDto(Long id, Long variantId, String productName, String variantDetails,
                        String productThumbnail, BigDecimal unitPrice, Integer quantity, BigDecimal subtotal) {
        this.id = id;
        this.variantId = variantId;
        this.productName = productName;
        this.variantDetails = variantDetails;
        this.productThumbnail = productThumbnail;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    public static OrderItemDto fromEntity(OrderItem item) {
        if (item == null) return null;
        return new OrderItemDto(
                item.getId(),
                item.getVariant() != null ? item.getVariant().getId() : null,
                item.getProductName(),
                item.getVariantDetails(),
                item.getProductThumbnail(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getSubtotal()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getVariantDetails() { return variantDetails; }
    public void setVariantDetails(String variantDetails) { this.variantDetails = variantDetails; }

    public String getProductThumbnail() { return productThumbnail; }
    public void setProductThumbnail(String productThumbnail) { this.productThumbnail = productThumbnail; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
