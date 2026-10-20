package com.phonestore.product;

import com.phonestore.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@Tag(name = "Admin Product API", description = "Các API thêm mới, sửa đổi thông tin, cập nhật kho và xóa sản phẩm dành cho Quản trị viên")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @PostMapping
    @Operation(summary = "Tạo mới sản phẩm điện thoại kèm theo các phiên bản màu sắc/dung lượng")
    public ResponseEntity<ApiResponse<ProductDetailDto>> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductDetailDto product = adminProductService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Thêm mới điện thoại thành công", product));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin chi tiết điện thoại")
    public ResponseEntity<ApiResponse<ProductDetailDto>> updateProduct(@PathVariable Long id,
                                                                      @Valid @RequestBody CreateProductRequest request) {
        ProductDetailDto updated = adminProductService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin điện thoại thành công", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Ẩn sản phẩm khỏi cửa hàng (Soft Delete)")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã ẩn sản phẩm thành công", null));
    }

    @PutMapping("/variants/{variantId}/stock")
    @Operation(summary = "Cập nhật nhanh số lượng tồn kho và giá bán của một phiên bản")
    public ResponseEntity<ApiResponse<ProductVariantDto>> updateVariantStock(@PathVariable Long variantId,
                                                                            @Valid @RequestBody UpdateStockRequest request) {
        ProductVariantDto variant = adminProductService.updateVariantStock(variantId, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật tồn kho thành công", variant));
    }
}
