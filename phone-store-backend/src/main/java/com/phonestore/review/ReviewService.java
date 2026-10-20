package com.phonestore.review;

import com.phonestore.common.exception.BadRequestException;
import com.phonestore.common.exception.ResourceNotFoundException;
import com.phonestore.product.Product;
import com.phonestore.product.ProductRepository;
import com.phonestore.user.User;
import com.phonestore.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public ProductReviewSummaryDto getProductReviews(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Sản phẩm", "id", productId);
        }

        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        Long totalReviews = reviewRepository.countByProductId(productId);

        double roundedAvg = (avgRating != null) ? Math.round(avgRating * 10.0) / 10.0 : 0.0;

        List<ReviewDto> dtos = reviews.stream()
                .map(ReviewDto::fromEntity)
                .collect(Collectors.toList());

        return new ProductReviewSummaryDto(roundedAvg, totalReviews, dtos);
    }

    @Transactional
    public ReviewDto createReview(Long productId, String username, CreateReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", productId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", username));

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);
        return ReviewDto.fromEntity(savedReview);
    }

    @Transactional
    public void deleteReview(Long reviewId, String currentUsername, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Đánh giá", "id", reviewId));

        if (!isAdmin && !review.getUser().getUsername().equals(currentUsername)) {
            throw new BadRequestException("Bạn không có quyền xóa đánh giá của người dùng khác");
        }

        reviewRepository.delete(review);
    }
}
