package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.dto.AuthTokens;
import com.agustinperez.proyectoSecurity.dto.JwtResponse;
import com.agustinperez.proyectoSecurity.dto.LoginRequest;
import com.agustinperez.proyectoSecurity.dto.RegisterRequest;
import com.agustinperez.proyectoSecurity.exception.BusinessException;
import com.agustinperez.proyectoSecurity.exception.InvalidTokenException;
import com.agustinperez.proyectoSecurity.model.Role;
import com.agustinperez.proyectoSecurity.model.User;
import com.agustinperez.proyectoSecurity.repository.RoleRepository;
import com.agustinperez.proyectoSecurity.repository.UserRepository;

import com.agustinperez.proyectoSecurity.security.jwt.JwtUtils;
import com.agustinperez.proyectoSecurity.model.ERole;

import com.agustinperez.proyectoSecurity.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Set;

@Service
public class AuthService {

    private static final Logger log =
            LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils,
            PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            RoleRepository roleRepository,
            EmailService emailService,
            RefreshTokenService refreshTokenService) {

        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
        this.refreshTokenService = refreshTokenService;

        log.info("AuthService initialized");
    }

    public AuthTokens login(LoginRequest request) {

        log.info("LOGIN: iniciando autenticación");

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException(
                        "Email o contraseña incorrectos"
                ));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new BadCredentialsException(
                    "Email o contraseña incorrectos"
            );
        }

        if (!user.isEnabled()) {
            throw new BusinessException(
                            "Por favor, verifica tu correo electrónico antes de iniciar sesión."
            );
        }

        log.info("LOGIN: usuario verificado, continuando autenticación");

        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(userDetails);

        String refreshToken = refreshTokenService.createRefreshToken(user);

        log.info("Token y refreshToken generados perfectamente!");

        return new AuthTokens(jwt, refreshToken);
    }


    @Transactional
    public User register(RegisterRequest request) {

        log.debug("Pedido de registro");

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("User registration rejected | reason=email already registered");

            throw new IllegalArgumentException(
                    "Ya existe una cuenta registrada con ese email"
            );
        }

        Role userRole = roleRepository.findByNameRole(ERole.ROLE_USER)
                .orElseThrow(() -> {
                    log.error("User registration failed | reason=ROLE_USER not found");

                    return new IllegalStateException(
                            "No se encontró el rol ROLE_USER"
                    );
                });

        String verificationCode = generateRandomCode();
        LocalDateTime expirationCode = LocalDateTime.now().plusMinutes(15);

        User user = new User();
        user.setName(request.getName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of(userRole));
        user.setVerificationCode(passwordEncoder.encode(verificationCode));
        user.setVerificationCodeExpiresAt(expirationCode);
        user.setEnabled(false);

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), verificationCode);

        return user;
    }

    @Transactional
    public void logout(String rawToken) {
        refreshTokenService.logout(rawToken);
    }

    @Transactional
    public AuthTokens refreshToken(String rawRefreshToken) {

        RefreshTokenRotation rotation =
                refreshTokenService.rotateRefreshToken(rawRefreshToken);

        User user = rotation.user();

        if (!user.isEnabled()) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);

        String newJwt = jwtUtils.generateJwtToken(userDetails);

        return new AuthTokens(newJwt, rotation.rawToken());
    }

    public boolean verifyAccount(String email, String code) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        if (user.isEnabled()) {
            throw new BusinessException("La cuenta ya está verificada");
        }

        if (user.getVerificationCode() == null ||
                user.getVerificationCodeExpiresAt() == null) {
            throw new BusinessException("No hay ninguna verificación pendiente.");
        }

        if (!user.getVerificationCodeExpiresAt().isAfter(LocalDateTime.now())) {
            throw new InvalidTokenException("El código de verificación ha caducado");
        }

        if (passwordEncoder.matches(code, user.getVerificationCode())) {
            user.setEnabled(true);
            user.setVerificationCode(null);
            user.setVerificationCodeExpiresAt(null);
            userRepository.save(user);
            return true;
        }

        throw new InvalidTokenException("Código de verificación no válido");
    }

    @Transactional
    public void resendVerificationCode(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(
                        "No se pudo procesar la solicitud"
                ));

        if (user.isEnabled()) {
            throw new BusinessException(
                    "La cuenta ya se encuentra verificada"
            );
        }

        String verificationCode = generateRandomCode();

        user.setVerificationCode(
                passwordEncoder.encode(verificationCode)
        );

        user.setVerificationCodeExpiresAt(
                LocalDateTime.now().plusMinutes(15)
        );

        userRepository.save(user);

        emailService.sendVerificationEmail(
                user.getEmail(),
                verificationCode
        );
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));
    }

    public void forgotPassword(String email) {

        var optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()){
            return;
        }

        User user = optionalUser.get();

        if (!user.isEnabled()){
            return;
        }

        String resetToken = generateRandomCode();

        user.setResetPasswordToken(passwordEncoder.encode(resetToken));
        user.setResetPasswordTokenExpiresAt(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        emailService.sendResetPasswordEmail(user.getEmail(), resetToken);
    }

    public void resetPassword(String email, String token, String newPassword) {

        String errorMessage = "\n" +
                "La solicitud de recuperación no es válida o ha caducado.";

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->  new InvalidTokenException(errorMessage));

        if (user.getResetPasswordToken() == null ||
                user.getResetPasswordTokenExpiresAt() == null) {
            throw new InvalidTokenException(errorMessage);
        }

        if (!user.getResetPasswordTokenExpiresAt().isAfter(LocalDateTime.now())) {
            throw new InvalidTokenException(errorMessage);
        }

        if (!passwordEncoder.matches(token, user.getResetPasswordToken())) {
            throw new InvalidTokenException(errorMessage);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiresAt(null);

        userRepository.save(user);
    }

    private String generateRandomCode() {
        int code = 100000 + SECURE_RANDOM.nextInt(900000);
        return String.valueOf(code);
    }
}