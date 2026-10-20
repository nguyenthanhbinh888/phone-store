package com.phonestore.product;

import com.phonestore.brand.BrandDto;
import com.phonestore.category.CategoryDto;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class ProductSummaryDto {
    private Long id;
    private String name;
    private String slug;
    private BrandDto brand;
    private CategoryDto category;
    private String thumbnailUrl;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal originalPrice;
    private List<String> ramOptions;
    private List<String> storageOptions;
    private List<String> colorOptions;
    private boolean isFeatured;
    private boolean hasStock;

    public ProductSummaryDto() {
    }

    public ProductSummaryDto(Long id, String name, String slug, BrandDto brand, CategoryDto category,
                             String thumbnailUrl, BigDecimal minPrice, BigDecimal maxPrice, BigDecimal originalPrice,
                             List<String> ramOptions, List<String> storageOptions, List<String> colorOptions,
                             boolean isFeatured, boolean hasStock) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.brand = brand;
        this.category = category;
        this.thumbnailUrl = thumbnailUrl;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.originalPrice = originalPrice;
        this.ramOptions = ramOptions;
        this.storageOptions = storageOptions;
        this.colorOptions = colorOptions;
        this.isFeatured = isFeatured;
        this.hasStock = hasStock;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public BrandDto getBrand() { return brand; }
    public void setBrand(BrandDto brand) { this.brand = brand; }

    public CategoryDto getCategory() { return category; }
    public void setCategory(CategoryDto category) { this.category = category; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public List<String> getRamOptions() { return ramOptions; }
    public void setRamOptions(List<String> ramOptions) { this.ramOptions = ramOptions; }

    public List<String> getStorageOptions() { return storageOptions; }
    public void setStorageOptions(List<String> storageOptions) { this.storageOptions = storageOptions; }

    public List<String> getColorOptions() { return colorOptions; }
    public void setColorOptions(List<String> colorOptions) { this.colorOptions = colorOptions; }

    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean featured) { isFeatured = featured; }

    public boolean isHasStock() { return hasStock; }
    public void setHasStock(boolean hasStock) { this.hasStock = hasStock; }

    public static ProductSummaryDto fromEntity(Product product) {
        if (product == null) return null;

        List<ProductVariant> variants = product.getVariants() != null ? product.getVariants() : Collections.emptyList();

        BigDecimal min = variants.stream()
                .map(ProductVariant::getPrice)
                .filter(Objects::nonNull)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        BigDecimal max = variants.stream()
                .map(ProductVariant::getPrice)
                .filter(Objects::nonNull)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        BigDecimal orig = variants.stream()
                .map(ProductVariant::getOriginalPrice)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(min);

        List<String> rams = variants.stream()
                .map(ProductVariant::getRam)
                .filter(r -> r != null && !r.isBlank())
                .distinct()
                .toList();

        List<String> storages = variants.stream()
                .map(ProductVariant::getStorage)
                .filter(s -> s != null && !s.isBlank())
                .distinct()
                .toList();

        List<String> colors = variants.stream()
                .map(ProductVariant::getColor)
                .filter(c -> c != null && !c.isBlank())
                .distinct()
                .toList();

        boolean inStock = variants.stream()
                .anyMatch(v -> v.getStockQuantity() != null && v.getStockQuantity() > 0);

        return new ProductSummaryDto(
                product.getId(),
                product.getName(),
                product.getSlug(),
                BrandDto.fromEntity(product.getBrand()),
                CategoryDto.fromEntity(product.getCategory()),
                product.getThumbnailUrl(),
                min,
                max,
                orig,
                rams,
                storages,
                colors,
                product.isFeatured(),
                inStock
        );
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String slug;
        private BrandDto brand;
        private CategoryDto category;
        private String thumbnailUrl;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private BigDecimal originalPrice;
        private List<String> ramOptions;
        private List<String> storageOptions;
        private List<String> colorOptions;
        private boolean isFeatured;
        private boolean hasStock;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder slug(String slug) { this.slug = slug; return this; }
        public Builder brand(BrandDto brand) { this.brand = brand; return this; }
        public Builder category(CategoryDto category) { this.category = category; return this; }
        public Builder thumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; return this; }
        public Builder minPrice(BigDecimal minPrice) { this.minPrice = minPrice; return this; }
        public Builder maxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; return this; }
        public Builder originalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; return this; }
        public Builder ramOptions(List<String> ramOptions) { this.ramOptions = ramOptions; return this; }
        public Builder storageOptions(List<String> storageOptions) { this.storageOptions = storageOptions; return this; }
        public Builder colorOptions(List<String> colorOptions) { this.colorOptions = colorOptions; return this; }
        public Builder isFeatured(boolean isFeatured) { this.isFeatured = isFeatured; return this; }
        public Builder hasStock(boolean hasStock) { this.hasStock = hasStock; return this; }

        public ProductSummaryDto build() {
            return new ProductSummaryDto(id, name, slug, brand, category, thumbnailUrl, minPrice, maxPrice, originalPrice, ramOptions, storageOptions, colorOptions, isFeatured, hasStock);
        }
    }
}
