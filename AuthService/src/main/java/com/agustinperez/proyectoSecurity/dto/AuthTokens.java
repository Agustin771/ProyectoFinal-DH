package com.agustinperez.proyectoSecurity.dto;

public record AuthTokens(
        String accessToken,
        String refreshToken
) {}
