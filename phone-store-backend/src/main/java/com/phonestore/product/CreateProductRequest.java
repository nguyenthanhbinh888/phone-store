package com.phonestore.product;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CreateProductRequest {

    @NotBlank(message = "Tên điện thoại không được để trống")
    private String name;

    @NotNull(message = "Thương hiệu không được để trống")
    private Long brandId;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    private String description;

    @NotBlank(message = "Ảnh đại diện sản phẩm không được để trống")
    private String thumbnailUrl;

    private String screen;
    private String chipset;
    private String battery;
    private String camera;
    private String os;
    private boolean featured = false;

    @Valid
    private List<CreateVariantRequest> variants;

    public CreateProductRequest() {
    }

    public CreateProductRequest(String name, Long brandId, Long categoryId, String description,
                                String thumbnailUrl, String screen, String chipset, String battery,
                                String camera, String os, boolean featured, List<CreateVariantRequest> variants) {
        this.name = name;
        this.brandId = brandId;
        this.categoryId = categoryId;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.screen = screen;
        this.chipset = chipset;
        this.battery = battery;
        this.camera = camera;
        this.os = os;
        this.featured = featured;
        this.variants = variants;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

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

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public List<CreateVariantRequest> getVariants() { return variants; }
    public void setVariants(List<CreateVariantRequest> variants) { this.variants = variants; }
}
