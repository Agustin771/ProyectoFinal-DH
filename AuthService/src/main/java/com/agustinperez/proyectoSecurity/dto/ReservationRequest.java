package com.agustinperez.proyectoSecurity.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ReservationRequest {

    @NotNull(message = "El producto es obligatorio")
    private Long productId;

    @NotNull(message = "La fecha de entrada es obligatoria")
    private LocalDate startDate;

    @NotNull(message = "La fecha de salida es obligatoria")
    private LocalDate endDate;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}