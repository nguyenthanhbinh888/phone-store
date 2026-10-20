package com.phonestore.product;

import java.math.BigDecimal;

public class ProductVariantDto {
    private Long id;
    private String color;
    private String colorCode;
    private String ram;
    private String storage;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String sku;
    private String imageUrl;

    public ProductVariantDto() {
    }

    public ProductVariantDto(Long id, String color, String colorCode, String ram, String storage,
                             BigDecimal price, BigDecimal originalPrice, Integer stockQuantity, String sku, String imageUrl) {
        this.id = id;
        this.color = color;
        this.colorCode = colorCode;
        this.ram = ram;
        this.storage = storage;
        this.price = price;
        this.originalPrice = originalPrice;
        this.stockQuantity = stockQuantity;
        this.sku = sku;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }

    public String getRam() { return ram; }
    public void setRam(String ram) { this.ram = ram; }

    public String getStorage() { return storage; }
    public void setStorage(String storage) { this.storage = storage; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public static ProductVariantDto fromEntity(ProductVariant variant) {
        if (variant == null) return null;
        return new ProductVariantDto(
                variant.getId(),
                variant.getColor(),
                variant.getColorCode(),
                variant.getRam(),
                variant.getStorage(),
                variant.getPrice(),
                variant.getOriginalPrice(),
                variant.getStockQuantity(),
                variant.getSku(),
                variant.getImageUrl()
        );
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String color;
        private String colorCode;
        private String ram;
        private String storage;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer stockQuantity;
        private String sku;
        private String imageUrl;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder color(String color) { this.color = color; return this; }
        public Builder colorCode(String colorCode) { this.colorCode = colorCode; return this; }
        public Builder ram(String ram) { this.ram = ram; return this; }
        public Builder storage(String storage) { this.storage = storage; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder originalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; return this; }
        public Builder stockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; return this; }
        public Builder sku(String sku) { this.sku = sku; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }

        public ProductVariantDto build() {
            return new ProductVariantDto(id, color, colorCode, ram, storage, price, originalPrice, stockQuantity, sku, imageUrl);
        }
    }
}
