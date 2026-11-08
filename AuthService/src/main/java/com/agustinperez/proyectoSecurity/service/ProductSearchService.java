package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.model.Product;
import com.agustinperez.proyectoSecurity.model.Reservation;
import com.agustinperez.proyectoSecurity.repository.ProductRepository;
import com.agustinperez.proyectoSecurity.repository.ReservationRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProductSearchService {

    private final ProductRepository productRepository;
    private final ReservationRepository reservationRepository;

    public ProductSearchService(
            ProductRepository productRepository,
            ReservationRepository reservationRepository) {
        this.productRepository = productRepository;
        this.reservationRepository = reservationRepository;
    }

    public List<Product> searchProducts(
            String keyword,
            LocalDate startDate,
            LocalDate endDate) {

        validateDates(startDate, endDate);

        String searchTerm = (keyword == null || keyword.isBlank())
                ? null
                : keyword.trim();

        return productRepository.searchAvailableProducts(
                searchTerm,
                startDate,
                endDate
        );
    }

    public List<Reservation> getAvailability(
            Long productId,
            LocalDate startDate,
            LocalDate endDate) {validateDates(startDate, endDate);

        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException(
                    "El producto solicitado no existe."
            );
        }

        return reservationRepository.findOverlappingReservations(
                productId,
                startDate,
                endDate
        );
    }

    private void validateDates(
            LocalDate startDate,
            LocalDate endDate) {

        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException(
                    "Debés ingresar ambas fechas."
            );
        }

        if (!endDate.isAfter(startDate)) {
            throw new IllegalArgumentException(
                    "La fecha de salida debe ser posterior a la de entrada."
            );
        }
    }
}