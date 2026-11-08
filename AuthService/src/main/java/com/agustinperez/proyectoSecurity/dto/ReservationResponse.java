package com.agustinperez.proyectoSecurity.dto;

import java.time.LocalDate;

public class ReservationResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String userEmail;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    public ReservationResponse(
            Long id,
            Long productId,
            String productName,
            String userEmail,
            LocalDate startDate,
            LocalDate endDate,
            String status
    ) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.userEmail = userEmail;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getStatus() {
        return status;
    }
}