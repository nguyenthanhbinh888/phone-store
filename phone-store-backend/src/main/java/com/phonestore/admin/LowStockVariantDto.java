package com.phonestore.admin;

public class LowStockVariantDto {
    private Long variantId;
    private Long productId;
    private String productName;
    private String color;
    private String storage;
    private Integer stockQuantity;

    public LowStockVariantDto() {
    }

    public LowStockVariantDto(Long variantId, Long productId, String productName, String color, String storage, Integer stockQuantity) {
        this.variantId = variantId;
        this.productId = productId;
        this.productName = productName;
        this.color = color;
        this.storage = storage;
        this.stockQuantity = stockQuantity;
    }

    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getStorage() { return storage; }
    public void setStorage(String storage) { this.storage = storage; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
}
