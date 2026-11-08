package com.agustinperez.proyectoSecurity.controller;

import com.agustinperez.proyectoSecurity.dto.FavoriteResponseDTO;
import com.agustinperez.proyectoSecurity.service.FavoriteService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponseDTO>> getFavorites() {

        return ResponseEntity.ok(
                favoriteService.getFavorites()
        );
    }

    @PostMapping("/{productId}")
    public ResponseEntity<FavoriteResponseDTO> addFavorite(
            @PathVariable Long productId
    ) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(favoriteService.addFavorite(productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long productId
    ) {

        favoriteService.removeFavorite(productId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{productId}/exists")
    public ResponseEntity<Map<String, Boolean>> isFavorite(
            @PathVariable Long productId
    ) {

        return ResponseEntity.ok(
                Map.of(
                        "isFavorite",
                        favoriteService.isFavorite(productId)
                )
        );
    }
}
