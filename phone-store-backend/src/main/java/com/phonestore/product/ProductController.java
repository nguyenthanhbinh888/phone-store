package com.phonestore.product;

import com.phonestore.common.response.ApiResponse;
import com.phonestore.common.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product API", description = "Các endpoint tra cứu, tìm kiếm, lọc và xem chi tiết sản phẩm")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách sản phẩm có phân trang và bộ lọc đa tiêu chí")
    public ResponseEntity<ApiResponse<PageResponse<ProductSummaryDto>>> getProducts(
            @Parameter(description = "Từ khóa tìm kiếm theo tên hoặc mô tả")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "ID thương hiệu")
            @RequestParam(required = false) Long brandId,
            @Parameter(description = "Slug thương hiệu (ví dụ: apple, samsung)")
            @RequestParam(required = false) String brandSlug,
            @Parameter(description = "ID danh mục")
            @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Slug danh mục (ví dụ: flagship, tam-trung)")
            @RequestParam(required = false) String categorySlug,
            @Parameter(description = "Mức giá tối thiểu (VNĐ)")
            @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Mức giá tối đa (VNĐ)")
            @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Dung lượng RAM (ví dụ: 8GB, 12GB)")
            @RequestParam(required = false) String ram,
            @Parameter(description = "Bộ nhớ trong (ví dụ: 128GB, 256GB, 512GB, 1TB)")
            @RequestParam(required = false) String storage,
            @Parameter(description = "Số trang (bắt đầu từ 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số phần tử mỗi trang")
            @RequestParam(defaultValue = "12") int size,
            @Parameter(description = "Sắp xếp theo trường (id, name, createdAt)")
            @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "Hướng sắp xếp (asc hoặc desc)")
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PageResponse<ProductSummaryDto> response = productService.getProducts(
                keyword,
                brandId,
                brandSlug,
                categoryId,
                categorySlug,
                minPrice,
                maxPrice,
                ram,
                storage,
                page,
                size,
                sortBy,
                sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/featured")
    @Operation(summary = "Lấy danh sách sản phẩm nổi bật hiển thị ở trang chủ")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getFeaturedProducts()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết sản phẩm theo ID")
    public ResponseEntity<ApiResponse<ProductDetailDto>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductById(id)));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Lấy thông tin chi tiết sản phẩm theo Slug thân thiện SEO")
    public ResponseEntity<ApiResponse<ProductDetailDto>> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductBySlug(slug)));
    }
}
