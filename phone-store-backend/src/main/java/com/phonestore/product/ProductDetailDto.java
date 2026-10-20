package com.phonestore.product;

import com.phonestore.brand.BrandDto;
import com.phonestore.category.CategoryDto;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ProductDetailDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BrandDto brand;
    private CategoryDto category;
    private String thumbnailUrl;
    private String screen;
    private String chipset;
    private String battery;
    private String camera;
    private String os;
    private boolean isFeatured;
    private boolean isActive;
    private List<ProductVariantDto> variants;
    private List<ProductImageDto> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductDetailDto() {
    }

    public ProductDetailDto(Long id, String name, String slug, String description, BrandDto brand, CategoryDto category,
                            String thumbnailUrl, String screen, String chipset, String battery, String camera, String os,
                            boolean isFeatured, boolean isActive, List<ProductVariantDto> variants, List<ProductImageDto> images,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.brand = brand;
        this.category = category;
        this.thumbnailUrl = thumbnailUrl;
        this.screen = screen;
        this.chipset = chipset;
        this.battery = battery;
        this.camera = camera;
        this.os = os;
        this.isFeatured = isFeatured;
        this.isActive = isActive;
        this.variants = variants != null ? variants : Collections.emptyList();
        this.images = images != null ? images : Collections.emptyList();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BrandDto getBrand() { return brand; }
    public void setBrand(BrandDto brand) { this.brand = brand; }

    public CategoryDto getCategory() { return category; }
    public void setCategory(CategoryDto category) { this.category = category; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getScreen() { return screen; }
    public void setScreen(String screen) { this.screen = screen; }

    public String getChipset() { return chipset; }
    public void setChipset(String chipset) { this.chipset = chipset; }

    public String getBattery() { return battery; }
    public void setBattery(String battery) { this.battery = battery; }

    public String getCamera() { return camera; }
    public void setCamera(String camera) { this.camera = camera; }

    public String getOs() { return os; }
    public void setOs(String os) { this.os = os; }

    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean featured) { isFeatured = featured; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public List<ProductVariantDto> getVariants() { return variants; }
    public void setVariants(List<ProductVariantDto> variants) { this.variants = variants; }

    public List<ProductImageDto> getImages() { return images; }
    public void setImages(List<ProductImageDto> images) { this.images = images; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ProductDetailDto fromEntity(Product product) {
        if (product == null) return null;

        List<ProductVariantDto> variantDtos = product.getVariants() != null
                ? product.getVariants().stream().map(ProductVariantDto::fromEntity).toList()
                : Collections.emptyList();

        List<ProductImageDto> imageDtos = product.getImages() != null
                ? product.getImages().stream()
                    .sorted(Comparator.comparingInt(ProductImage::getDisplayOrder))
                    .map(ProductImageDto::fromEntity)
                    .toList()
                : Collections.emptyList();

        return new ProductDetailDto(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                BrandDto.fromEntity(product.getBrand()),
                CategoryDto.fromEntity(product.getCategory()),
                product.getThumbnailUrl(),
                product.getScreen(),
                product.getChipset(),
                product.getBattery(),
                product.getCamera(),
                product.getOs(),
                product.isFeatured(),
                product.isActive(),
                variantDtos,
                imageDtos,
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String slug;
        private String description;
        private BrandDto brand;
        private CategoryDto category;
        private String thumbnailUrl;
        private String screen;
        private String chipset;
        private String battery;
        private String camera;
        private String os;
        private boolean isFeatured;
        private boolean isActive;
        private List<ProductVariantDto> variants;
        private List<ProductImageDto> images;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder slug(String slug) { this.slug = slug; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder brand(BrandDto brand) { this.brand = brand; return this; }
        public Builder category(CategoryDto category) { this.category = category; return this; }
        public Builder thumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; return this; }
        public Builder screen(String screen) { this.screen = screen; return this; }
        public Builder chipset(String chipset) { this.chipset = chipset; return this; }
        public Builder battery(String battery) { this.battery = battery; return this; }
        public Builder camera(String camera) { this.camera = camera; return this; }
        public Builder os(String os) { this.os = os; return this; }
        public Builder isFeatured(boolean isFeatured) { this.isFeatured = isFeatured; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public Builder variants(List<ProductVariantDto> variants) { this.variants = variants; return this; }
        public Builder images(List<ProductImageDto> images) { this.images = images; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ProductDetailDto build() {
            return new ProductDetailDto(id, name, slug, description, brand, category, thumbnailUrl,
                    screen, chipset, battery, camera, os, isFeatured, isActive, variants, images, createdAt, updatedAt);
        }
    }
}
