package com.agustinperez.proyectoSecurity.dto;

import java.time.LocalDateTime;

public class ProductReviewResponse {

    private Long id;
    private Integer rating;
    private String comment;
    private String userName;
    private LocalDateTime createdAt;

    public ProductReviewResponse(
            Long id,
            Integer rating,
            String comment,
            String userName,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.userName = userName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public String getUserName() {
        return userName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
