package com.agustinperez.proyectoSecurity.security.jwt;

import com.agustinperez.proyectoSecurity.security.services.UserDetailsServiceimpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(AuthTokenFilter.class);


    private final JwtUtils jwtUtils;
    private final UserDetailsServiceimpl userDetailsService;


    public AuthTokenFilter(JwtUtils jwtUtils, UserDetailsServiceimpl userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String method = request.getMethod();
        String uri = request.getRequestURI();

        log.debug(
                "Iniciando AuthTokenFilter | method={} | uri={}",
                method,
                uri
        );

        try {
            String jwt = parseJwt(request);

            if (jwt == null) {
                log.debug(
                        "No se encontró un token Bearer | method={} | uri={}",
                        method,
                        uri
                );
            } else {
                log.debug(
                        "Token JWT extraído correctamente | uri={}",
                        uri
                );

                boolean validToken = jwtUtils.validateJwtToken(jwt);

                log.debug(
                        "Resultado de validación JWT | valid={} | uri={}",
                        validToken,
                        uri
                );

                if (validToken) {
                    String username =
                            jwtUtils.getUserNameFromJwtToken(jwt);

                    log.info(
                            "JWT validado correctamente | username={} | uri={}",
                            username,
                            uri
                    );

                    UserDetails userDetails =
                            userDetailsService.loadUserByUsername(username);

                    log.debug(
                            "Usuario cargado | username={} | authorities={}",
                            userDetails.getUsername(),
                            userDetails.getAuthorities()
                    );

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);

                    log.info(
                            "Autenticación establecida en SecurityContext | username={} | authorities={} | uri={}",
                            userDetails.getUsername(),
                            userDetails.getAuthorities(),
                            uri
                    );

                } else {
                    log.warn(
                            "JWT inválido o expirado | method={} | uri={}",
                            method,
                            uri
                    );
                }
            }

        } catch (Exception e) {
            log.error(
                    "Error procesando autenticación JWT | method={} | uri={} | exception={} | message={}",
                    method,
                    uri,
                    e.getClass().getSimpleName(),
                    e.getMessage(),
                    e
            );

            SecurityContextHolder.clearContext();
        }

        log.debug(
                "Continuando FilterChain | method={} | uri={}",
                method,
                uri
        );

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth)
                && headerAuth.startsWith("Bearer ")) {

            String jwt = headerAuth.substring(7);

            log.debug(
                    "Header Authorization con esquema Bearer detectado | uri={}",
                    request.getRequestURI()
            );

            return jwt;
        }

        log.debug(
                "Header Authorization ausente o sin esquema Bearer | uri={}",
                request.getRequestURI()
        );

        return null;
    }
}