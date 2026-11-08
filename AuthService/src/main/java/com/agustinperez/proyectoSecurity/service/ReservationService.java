package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.dto.ReservationRequest;
import com.agustinperez.proyectoSecurity.dto.ReservationResponse;
import com.agustinperez.proyectoSecurity.exception.BusinessException;
import com.agustinperez.proyectoSecurity.exception.ResourceNotFoundException;
import com.agustinperez.proyectoSecurity.model.Product;
import com.agustinperez.proyectoSecurity.model.Reservation;
import com.agustinperez.proyectoSecurity.model.User;
import com.agustinperez.proyectoSecurity.repository.ProductRepository;
import com.agustinperez.proyectoSecurity.repository.ReservationRepository;
import com.agustinperez.proyectoSecurity.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {

    private static final Logger log =
            LoggerFactory.getLogger(ReservationService.class);

    private final ReservationRepository reservationRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ReservationService(
            ReservationRepository reservationRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            EmailService emailService
    ) {
        this.reservationRepository = reservationRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public ReservationResponse createReservation(
            Long userId,
            ReservationRequest request
    ) {

        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();

        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException(
                    "Debés ingresar las fechas de entrada y salida."
            );
        }

        if (startDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "No podés reservar fechas anteriores a hoy."
            );
        }

        if (!endDate.isAfter(startDate)) {
            throw new IllegalArgumentException(
                    "La fecha de salida debe ser posterior a la entrada."
            );
        }

        Product product = productRepository.findById(
                request.getProductId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "El producto solicitado no existe."
                )
        );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "El usuario no existe."
                        )
                );

        List<Reservation> overlapping =
                reservationRepository.findOverlappingReservations(
                        product.getId(),
                        startDate,
                        endDate
                );

        if (!overlapping.isEmpty()) {
            throw new BusinessException(
                    "El alojamiento ya está reservado para esas fechas."
            );
        }

        Reservation reservation = new Reservation();

        reservation.setProduct(product);
        reservation.setUser(user);
        reservation.setStartDate(startDate);
        reservation.setEndDate(endDate);
        reservation.setStatus("CONFIRMED");

        Reservation saved =
                reservationRepository.save(reservation);

        try {
            String customerName = (
                    (user.getName() != null ? user.getName() : "") +
                            " " +
                            (user.getLastName() != null ? user.getLastName() : "")
            ).trim();

            if (customerName.isBlank()) {
                customerName = "cliente";
            }

            emailService.sendReservationConfirmationEmail(
                    user.getEmail(),
                    customerName,
                    saved.getId(),
                    product.getName(),
                    startDate,
                    endDate
            );

            log.info(
                    "Reservation confirmation email sent | reservationId={}",
                    saved.getId()
            );

        } catch (MailException exception) {
            log.error(
                    "Could not send reservation confirmation email | reservationId={} | email={}",
                    saved.getId(),
                    user.getEmail(),
                    exception
            );
        }

        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getUserReservations(
            Long userId
    ) {

        return reservationRepository
                .findByUserIdOrderByStartDateDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private ReservationResponse convertToResponse(
            Reservation reservation
    ) {

        return new ReservationResponse(
                reservation.getId(),
                reservation.getProduct().getId(),
                reservation.getProduct().getName(),
                reservation.getUser().getEmail(),
                reservation.getStartDate(),
                reservation.getEndDate(),
                reservation.getStatus()
        );
    }
}