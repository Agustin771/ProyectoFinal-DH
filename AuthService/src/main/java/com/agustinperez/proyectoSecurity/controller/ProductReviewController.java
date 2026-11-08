package com.agustinperez.proyectoSecurity.controller;

import com.agustinperez.proyectoSecurity.dto.ProductReviewRequest;
import com.agustinperez.proyectoSecurity.dto.ProductReviewResponse;
import com.agustinperez.proyectoSecurity.dto.ProductRatingSummary;

import com.agustinperez.proyectoSecurity.security.services.UserDetailsImpl;
import com.agustinperez.proyectoSecurity.service.ProductReviewService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductReviewController {

    private final ProductReviewService reviewService;

    public ProductReviewController(
            ProductReviewService reviewService
    ) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<?> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody ProductReviewRequest request,
            Authentication authentication
    ) {

        try {

            UserDetailsImpl userDetails =
                    (UserDetailsImpl) authentication.getPrincipal();

            ProductReviewResponse response =
                    reviewService.createReview(
                            productId,
                            userDetails.getId(),
                            request
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getProductReviews(
            @PathVariable Long productId
    ) {

        try {

            List<ProductReviewResponse> reviews =
                    reviewService.getProductReviews(productId);

            return ResponseEntity.ok(reviews);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    @GetMapping("/summary")
    public ResponseEntity<?> getRatingSummary(
            @PathVariable Long productId
    ) {

        try {

            ProductRatingSummary summary =
                    reviewService.getRatingSummary(productId);

            return ResponseEntity.ok(summary);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}
