package com.phonestore.product;

public class ProductImageDto {
    private Long id;
    private String imageUrl;
    private boolean isPrimary;
    private Integer displayOrder;

    public ProductImageDto() {
    }

    public ProductImageDto(Long id, String imageUrl, boolean isPrimary, Integer displayOrder) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.isPrimary = isPrimary;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean primary) { isPrimary = primary; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public static ProductImageDto fromEntity(ProductImage image) {
        if (image == null) return null;
        return new ProductImageDto(
                image.getId(),
                image.getImageUrl(),
                image.isPrimary(),
                image.getDisplayOrder()
        );
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String imageUrl;
        private boolean isPrimary;
        private Integer displayOrder;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder isPrimary(boolean isPrimary) { this.isPrimary = isPrimary; return this; }
        public Builder displayOrder(Integer displayOrder) { this.displayOrder = displayOrder; return this; }

        public ProductImageDto build() {
            return new ProductImageDto(id, imageUrl, isPrimary, displayOrder);
        }
    }
}
