package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.model.User;

public record RefreshTokenRotation(
        String rawToken,
        User user
) {}
