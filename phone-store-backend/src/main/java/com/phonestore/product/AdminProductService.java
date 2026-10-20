package com.phonestore.product;

import com.phonestore.brand.Brand;
import com.phonestore.brand.BrandRepository;
import com.phonestore.category.Category;
import com.phonestore.category.CategoryRepository;
import com.phonestore.common.exception.BadRequestException;
import com.phonestore.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.regex.Pattern;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    public AdminProductService(ProductRepository productRepository,
                               ProductVariantRepository variantRepository,
                               BrandRepository brandRepository,
                               CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public ProductDetailDto createProduct(CreateProductRequest request) {
        if (request.getVariants() == null || request.getVariants().isEmpty()) {
            throw new BadRequestException("Sản phẩm mới phải có ít nhất 1 phiên bản màu sắc/dung lượng");
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", request.getCategoryId()));

        String baseSlug = toSlug(request.getName());
        String slug = baseSlug;
        if (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + System.currentTimeMillis() % 10000;
        }

        Product product = Product.builder()
                .name(request.getName().trim())
                .slug(slug)
                .description(request.getDescription())
                .brand(brand)
                .category(category)
                .thumbnailUrl(request.getThumbnailUrl().trim())
                .screen(request.getScreen())
                .chipset(request.getChipset())
                .battery(request.getBattery())
                .camera(request.getCamera())
                .os(request.getOs())
                .isFeatured(request.isFeatured())
                .isActive(true)
                .build();

        if (request.getVariants() != null) {
            for (CreateVariantRequest vReq : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .color(vReq.getColor().trim())
                        .colorCode(vReq.getColorCode())
                        .ram(vReq.getRam())
                        .storage(vReq.getStorage().trim())
                        .price(vReq.getPrice())
                        .originalPrice(vReq.getOriginalPrice())
                        .stockQuantity(vReq.getStockQuantity())
                        .sku(vReq.getSku() != null ? vReq.getSku().trim() : (slug + "-" + vReq.getColor() + "-" + vReq.getStorage()))
                        .imageUrl(vReq.getImageUrl())
                        .build();

                product.addVariant(variant);
            }
        }

        Product savedProduct = productRepository.save(product);
        return ProductDetailDto.fromEntity(savedProduct);
    }

    @Transactional
    public ProductDetailDto updateProduct(Long id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", request.getBrandId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", request.getCategoryId()));

        product.setName(request.getName().trim());
        product.setBrand(brand);
        product.setCategory(category);
        product.setDescription(request.getDescription());
        product.setThumbnailUrl(request.getThumbnailUrl().trim());
        product.setScreen(request.getScreen());
        product.setChipset(request.getChipset());
        product.setBattery(request.getBattery());
        product.setCamera(request.getCamera());
        product.setOs(request.getOs());
        product.setFeatured(request.isFeatured());

        Product savedProduct = productRepository.save(product);
        return ProductDetailDto.fromEntity(savedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));
        // Soft delete
        product.setActive(false);
        productRepository.save(product);
    }

    @Transactional
    public ProductVariantDto updateVariantStock(Long variantId, UpdateStockRequest request) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Phiên bản sản phẩm", "id", variantId));

        variant.setStockQuantity(request.getStockQuantity());
        if (request.getPrice() != null) {
            variant.setPrice(request.getPrice());
        }

        ProductVariant savedVariant = variantRepository.save(variant);
        return ProductVariantDto.fromEntity(savedVariant);
    }

    private String toSlug(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String noAccent = pattern.matcher(normalized).replaceAll("")
                .replace("đ", "d").replace("Đ", "d");
        return noAccent.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-");
    }
}
