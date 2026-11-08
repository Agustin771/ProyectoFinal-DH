package com.agustinperez.proyectoSecurity.repository;

import com.agustinperez.proyectoSecurity.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByName(String name);

    Optional<Product> findByName(String name);

    @Query(value = "SELECT * FROM products ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Product> findRandomProducts(int limit);

    @Query("""
    SELECT p FROM Product p
    WHERE (
        :keyword IS NULL
        OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
    AND NOT EXISTS (
        SELECT r.id FROM Reservation r
        WHERE r.product = p
        AND r.status = 'CONFIRMED'
        AND r.startDate < :endDate
        AND r.endDate > :startDate
    )
""")
    List<Product> searchAvailableProducts(
            @Param("keyword") String keyword,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    Page<Product> findAll(Pageable pageable);

    boolean existsByNameAndIdNot(String name, Long id);
}
