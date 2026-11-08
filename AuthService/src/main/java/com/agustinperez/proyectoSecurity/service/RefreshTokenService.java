package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.exception.InvalidTokenException;
import com.agustinperez.proyectoSecurity.model.RefreshToken;
import com.agustinperez.proyectoSecurity.model.User;
import com.agustinperez.proyectoSecurity.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final long refreshExpirationMs;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    @Transactional
    public String createRefreshToken(User user){

        String rawToken = generateRandomToken();

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setTokenHash(hashToken(rawToken));

        refreshToken.setUser(user);

        refreshToken.setTokenExpiration(LocalDateTime.now().plus(Duration.ofMillis(refreshExpirationMs)));

        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }

    @Transactional
    public RefreshTokenRotation rotateRefreshToken(String rawToken) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        String tokenHash = hashToken(rawToken);

        RefreshToken refreshToken = refreshTokenRepository
                .findByTokenHashForUpdate(tokenHash)
                .orElseThrow(() -> new InvalidTokenException(
                        "Invalid or expired refresh token"
                ));

        if (refreshToken.isRevoked()) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        if (!refreshToken.getTokenExpiration().isAfter(LocalDateTime.now())) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        User user = refreshToken.getUser();

        refreshToken.setRevoked(true);

        String newRawToken = createRefreshToken(user);

        return new RefreshTokenRotation(newRawToken, user);
    }

    @Transactional
    public void logout(String rawToken) {

        if (rawToken == null || rawToken.isBlank()) {
            return;
        }

        String tokenHash = hashToken(rawToken);

        refreshTokenRepository.findByTokenHashForUpdate(tokenHash)
                .ifPresent(refreshToken -> {
                    if (!refreshToken.isRevoked()) {
                        refreshToken.setRevoked(true);
                    }
                });
    }

    private String generateRandomToken() {

        byte[] randomBytes = new byte[32];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

    private String hashToken(String token) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getEncoder()
                    .encodeToString(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Error hashing refresh token", e);
        }
    }
}
