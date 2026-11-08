package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.dto.FavoriteProductDTO;
import com.agustinperez.proyectoSecurity.dto.FavoriteResponseDTO;
import com.agustinperez.proyectoSecurity.model.Favorite;
import com.agustinperez.proyectoSecurity.model.Product;
import com.agustinperez.proyectoSecurity.model.User;
import com.agustinperez.proyectoSecurity.repository.FavoriteRepository;
import com.agustinperez.proyectoSecurity.repository.ProductRepository;
import com.agustinperez.proyectoSecurity.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public FavoriteService(
            FavoriteRepository favoriteRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName() == null) {

            throw new IllegalStateException(
                    "Usuario no autenticado"
            );
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Usuario autenticado no encontrado"
                        )
                );
    }

    private FavoriteResponseDTO convertToDTO(Favorite favorite) {

        Product product = favorite.getProduct();

        FavoriteProductDTO productDTO = new FavoriteProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getImages()
        );

        return new FavoriteResponseDTO(
                favorite.getId(),
                productDTO,
                favorite.getCreatedAt()
        );
    }
    @Transactional(readOnly = true)
    public List<FavoriteResponseDTO> getFavorites() {

        User user = getAuthenticatedUser();

        return favoriteRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::convertToDTO)
                .toList();
    }
    @Transactional
    public FavoriteResponseDTO addFavorite(Long productId) {

        User user = getAuthenticatedUser();

        if (favoriteRepository.existsByUserIdAndProductId(
                user.getId(),
                productId
        )) {
            throw new IllegalArgumentException(
                    "Este producto ya está en tus favoritos"
            );
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Producto no encontrado"
                        )
                );

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setProduct(product);

        Favorite savedFavorite = favoriteRepository.save(favorite);

        return convertToDTO(savedFavorite);
    }

    @Transactional
    public void removeFavorite(Long productId) {

        User user = getAuthenticatedUser();

        Favorite favorite = favoriteRepository
                .findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "El producto no se encuentra en tus favoritos"
                        )
                );

        favoriteRepository.delete(favorite);
    }
    @Transactional(readOnly = true)
    public boolean isFavorite(Long productId) {

        User user = getAuthenticatedUser();

        return favoriteRepository.existsByUserIdAndProductId(
                user.getId(),
                productId
        );
    }
}
