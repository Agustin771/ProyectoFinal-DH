
package com.agustinperez.proyectoSecurity.dto;

public class ProductRatingSummary {

    private Double averageRating;
    private Long totalReviews;

    public ProductRatingSummary() {
    }

    public ProductRatingSummary(
            Double averageRating,
            Long totalReviews
    ) {
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
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
}
