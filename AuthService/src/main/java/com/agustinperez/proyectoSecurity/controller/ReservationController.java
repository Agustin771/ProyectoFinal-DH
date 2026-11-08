package com.agustinperez.proyectoSecurity.controller;

import com.agustinperez.proyectoSecurity.dto.ReservationRequest;
import com.agustinperez.proyectoSecurity.dto.ReservationResponse;
import com.agustinperez.proyectoSecurity.security.services.UserDetailsImpl;
import com.agustinperez.proyectoSecurity.service.ReservationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(
            ReservationService reservationService
    ) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationRequest request,
            Authentication authentication
    ) {

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        ReservationResponse response =
                reservationService.createReservation(
                        userDetails.getId(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            Authentication authentication
    ) {

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(
                reservationService.getUserReservations(
                        userDetails.getId()
                )
        );
    }
}