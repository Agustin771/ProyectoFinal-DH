package com.agustinperez.proyectoSecurity.dto;

import java.time.LocalDateTime;

public record FavoriteResponseDTO(
        Long id,
        FavoriteProductDTO product,
        LocalDateTime createdAt
) {
}
