package com.phonestore.review;

import java.util.List;

public class ProductReviewSummaryDto {

    private Double averageRating;
    private Long totalReviews;
    private List<ReviewDto> reviews;

    public ProductReviewSummaryDto() {
    }

    public ProductReviewSummaryDto(Double averageRating, Long totalReviews, List<ReviewDto> reviews) {
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.reviews = reviews;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public List<ReviewDto> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewDto> reviews) {
        this.reviews = reviews;
    }
}
