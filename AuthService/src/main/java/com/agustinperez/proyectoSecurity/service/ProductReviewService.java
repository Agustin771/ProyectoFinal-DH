package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.dto.ProductRatingSummary;
import com.agustinperez.proyectoSecurity.dto.ProductReviewRequest;
import com.agustinperez.proyectoSecurity.dto.ProductReviewResponse;

import com.agustinperez.proyectoSecurity.model.Product;
import com.agustinperez.proyectoSecurity.model.ProductReview;
import com.agustinperez.proyectoSecurity.model.User;

import com.agustinperez.proyectoSecurity.repository.ProductRepository;
import com.agustinperez.proyectoSecurity.repository.ProductReviewRepository;
import com.agustinperez.proyectoSecurity.repository.ReservationRepository;
import com.agustinperez.proyectoSecurity.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;

    public ProductReviewService(
            ProductReviewRepository reviewRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            ReservationRepository reservationRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.reservationRepository = reservationRepository;
    }

    @Transactional
    public ProductReviewResponse createReview(
            Long productId,
            Long userId,
            ProductReviewRequest request
    ) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "El producto solicitado no existe."
                        )
                );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "El usuario solicitado no existe."
                        )
                );

        if (request.getRating() == null ||
                request.getRating() < 1 ||
                request.getRating() > 5) {

            throw new IllegalArgumentException(
                    "La puntuación debe estar entre 1 y 5 estrellas."
            );
        }

        if (reviewRepository.existsByProductIdAndUserId(
                productId,
                userId
        )) {

            throw new IllegalArgumentException(
                    "Ya realizaste una valoración para este producto."
            );
        }

        boolean hasCompletedReservation =
                reservationRepository.hasCompletedReservation(
                        productId,
                        userId,
                        LocalDate.now()
                );

        if (!hasCompletedReservation) {
            throw new IllegalArgumentException(
                    "Solo podés valorar productos que hayas reservado y cuya reserva haya finalizado."
            );
        }

        ProductReview review = new ProductReview();

        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.getRating());

        String comment = request.getComment();

        review.setComment(
                comment == null || comment.isBlank()
                        ? null
                        : comment.trim()
        );

        ProductReview savedReview =
                reviewRepository.save(review);

        return convertToResponse(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ProductReviewResponse> getProductReviews(
            Long productId
    ) {

        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException(
                    "El producto solicitado no existe."
            );
        }

        return reviewRepository
                .findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double getAverageRating(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException(
                    "El producto solicitado no existe."
            );
        }

        Double average =
                reviewRepository.calculateAverageRating(productId);

        return average != null ? average : 0.0;
    }

    @Transactional(readOnly = true)
    public Long getReviewCount(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException(
                    "El producto solicitado no existe."
            );
        }

        return reviewRepository.countReviewsByProductId(productId);
    }


    @Transactional(readOnly = true)
    public ProductRatingSummary getRatingSummary(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException(
                    "El producto solicitado no existe."
            );
        }

        Double average =
                reviewRepository.calculateAverageRating(productId);

        Long count =
                reviewRepository.countReviewsByProductId(productId);

        return new ProductRatingSummary(
                average != null ? average : 0.0,
                count != null ? count : 0L
        );
    }

    private ProductReviewResponse convertToResponse(
            ProductReview review
    ) {

        User user = review.getUser();

        String fullName =
                user.getName() + " " + user.getLastName();

        return new ProductReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                fullName.trim(),
                review.getCreatedAt()
        );
    }
}
