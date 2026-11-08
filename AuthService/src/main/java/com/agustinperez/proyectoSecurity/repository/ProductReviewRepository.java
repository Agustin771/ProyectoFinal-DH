package com.agustinperez.proyectoSecurity.repository;

import com.agustinperez.proyectoSecurity.model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductReviewRepository
        extends JpaRepository<ProductReview, Long> {

    List<ProductReview> findByProductIdOrderByCreatedAtDesc(Long productId);

    Optional<ProductReview> findByProductIdAndUserId(
            Long productId,
            Long userId
    );

    boolean existsByProductIdAndUserId(
            Long productId,
            Long userId
    );

    @Query("""
        SELECT COALESCE(AVG(r.rating), 0)
        FROM ProductReview r
        WHERE r.product.id = :productId
    """)
    Double calculateAverageRating(
            @Param("productId") Long productId
    );

    @Query("""
        SELECT COUNT(r)
        FROM ProductReview r
        WHERE r.product.id = :productId
    """)
    Long countReviewsByProductId(
            @Param("productId") Long productId
    );
}
