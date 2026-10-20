package com.phonestore.review;

import com.phonestore.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "Review API", description = "Đánh giá, xếp hạng sao và bình luận sản phẩm")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/products/{productId}/reviews")
    @Operation(summary = "Lấy danh sách đánh giá và điểm sao trung bình của sản phẩm")
    public ResponseEntity<ApiResponse<ProductReviewSummaryDto>> getProductReviews(@PathVariable Long productId) {
        ProductReviewSummaryDto summary = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách đánh giá thành công", summary));
    }

    @PostMapping("/products/{productId}/reviews")
    @Operation(summary = "Gửi đánh giá và nhận xét sản phẩm (Yêu cầu đăng nhập)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody CreateReviewRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        ReviewDto created = reviewService.createReview(productId, username, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Gửi đánh giá sản phẩm thành công!", created));
    }

    @DeleteMapping("/reviews/{id}")
    @Operation(summary = "Xóa đánh giá (Dành cho chủ sở hữu hoặc Quản trị viên)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        reviewService.deleteReview(id, username, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa đánh giá thành công", null));
    }
}
