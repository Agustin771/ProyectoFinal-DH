package com.agustinperez.proyectoSecurity.controller;

import com.agustinperez.proyectoSecurity.dto.*;
import com.agustinperez.proyectoSecurity.model.User;
import com.agustinperez.proyectoSecurity.service.AuthService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final long refreshExpirationMs;
    private final boolean secureCookie;

    private static final Logger log =
            LoggerFactory.getLogger(AuthController.class);

    public AuthController(
            AuthService authService,
            @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs,
            @Value("${app.cookie.secure:false}") boolean secureCookie) {

        this.refreshExpirationMs = refreshExpirationMs;
        this.secureCookie = secureCookie;
        this.authService = authService;
    }

    private ResponseCookie createRefreshCookie(String token) {

        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(secureCookie)
                .path("/auth")
                .maxAge(Duration.ofMillis(refreshExpirationMs))
                .sameSite("Lax")
                .build();
    }

    private ResponseCookie clearRefreshCookie() {

        return ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(secureCookie)
                .path("/auth")
                .maxAge(Duration.ZERO)
                .sameSite("Lax")
                .build();
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(
            @Valid @RequestBody LoginRequest request) {

        AuthTokens tokens = authService.login(request);

        ResponseCookie cookie =
                createRefreshCookie(tokens.refreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new JwtResponse(tokens.accessToken()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(request);

        log.info("Usuario registrado correctamente");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Usuario registrado correctamente.");
    }

    @PostMapping("/verify")
    public ResponseEntity<MessageResponse> verifyAccount(
            @Valid @RequestBody VerificationRequest request) {

        authService.verifyAccount(
                request.getEmail(),
                request.getCode()
        );

        return ResponseEntity.ok(
                new MessageResponse(
                        "¡Tu cuenta fue verificada correctamente!"
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @CookieValue(value = "refreshToken", required = false)
            String refreshToken) {

        authService.logout(refreshToken);

        ResponseCookie cookie = clearRefreshCookie();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(
                        new MessageResponse(
                                "Sesión cerrada correctamente."
                        )
                );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {

        User user = authService.findByEmail(authentication.getName());

        return ResponseEntity.ok(Map.of(
                "name", user.getName(),
                "lastName", user.getLastName(),
                "email", user.getEmail()
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest passwordRequest) {

        authService.forgotPassword(passwordRequest.getEmail());

        return ResponseEntity.ok(
                new MessageResponse(
                        "Si la cuenta existe, recibirás un código de recuperación."
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordDTO resetPasswordDTO) {

        authService.resetPassword(
                resetPasswordDTO.getEmail(),
                resetPasswordDTO.getToken(),
                resetPasswordDTO.getNewPassword()
        );

        return ResponseEntity.ok(
                new MessageResponse(
                        "¡Tu contraseña se actualizó correctamente!"
                )
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshToken(
            @CookieValue(value = "refreshToken", required = false)
            String refreshToken) {

        AuthTokens tokens = authService.refreshToken(refreshToken);

        ResponseCookie cookie =
                createRefreshCookie(tokens.refreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new JwtResponse(tokens.accessToken()));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<MessageResponse> resendVerification(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.resendVerificationCode(request.getEmail());

        return ResponseEntity.ok(
                new MessageResponse(
                        "Si la cuenta está pendiente de verificación, recibirás un nuevo código."
                )
        );
    }
}