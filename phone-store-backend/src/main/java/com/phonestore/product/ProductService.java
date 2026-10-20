package com.phonestore.product;

import com.phonestore.common.exception.ResourceNotFoundException;
import com.phonestore.common.response.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductSummaryDto> getProducts(
            String keyword,
            Long brandId,
            String brandSlug,
            Long categoryId,
            String categorySlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String ram,
            String storage,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        if (sortBy != null && !sortBy.isBlank()) {
            Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
            if ("newest".equalsIgnoreCase(sortBy) || "createdAt".equalsIgnoreCase(sortBy)) {
                sort = Sort.by(direction, "createdAt");
            } else if ("name".equalsIgnoreCase(sortBy)) {
                sort = Sort.by(direction, "name");
            } else {
                sort = Sort.by(direction, sortBy);
            }
        }

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Specification<Product> spec = ProductSpecification.filter(
                keyword,
                brandId,
                brandSlug,
                categoryId,
                categorySlug,
                minPrice,
                maxPrice,
                ram,
                storage
        );

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        Page<ProductSummaryDto> dtoPage = productPage.map(ProductSummaryDto::fromEntity);

        return PageResponse.from(dtoPage);
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getFeaturedProducts() {
        return productRepository.findTop8ByIsFeaturedTrueAndIsActiveTrueOrderByIdDesc()
                .stream()
                .map(ProductSummaryDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDetailDto getProductById(Long id) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));
        return ProductDetailDto.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public ProductDetailDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "slug", slug));
        return ProductDetailDto.fromEntity(product);
    }
}
