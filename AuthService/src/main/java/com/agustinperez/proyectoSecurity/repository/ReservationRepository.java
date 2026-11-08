package com.agustinperez.proyectoSecurity.repository;

import com.agustinperez.proyectoSecurity.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.product.id = :productId
        AND r.status = 'CONFIRMED'
        AND r.startDate < :endDate
        AND r.endDate > :startDate
    """)
    List<Reservation> findOverlappingReservations(
            @Param("productId") Long productId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
        SELECT COUNT(r) > 0
        FROM Reservation r
        WHERE r.product.id = :productId
        AND r.user.id = :userId
        AND r.status = 'CONFIRMED'
        AND r.endDate <= :today
    """)
    boolean hasCompletedReservation(
            @Param("productId") Long productId,
            @Param("userId") Long userId,
            @Param("today") LocalDate today
    );

    List<Reservation> findByUserIdOrderByStartDateDesc(Long userId);
}
