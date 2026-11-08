package com.agustinperez.proyectoSecurity.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class ProductReviewRequest {

    @Min(value = 1, message = "La puntuación mínima es 1 estrella.")
    @Max(value = 5, message = "La puntuación máxima es 5 estrellas.")
    private Integer rating;

    @Size(
            max = 1000,
            message = "El comentario no puede superar los 1000 caracteres."
    )
    private String comment;

    public ProductReviewRequest() {
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
