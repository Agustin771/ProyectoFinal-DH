
package com.agustinperez.proyectoSecurity.dto;

import java.util.List;

public record FavoriteProductDTO(
        Long id,
        String name,
        String description,
        List<String> images
) {
}
