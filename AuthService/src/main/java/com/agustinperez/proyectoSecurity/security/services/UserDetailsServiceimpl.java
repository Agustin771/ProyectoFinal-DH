package com.agustinperez.proyectoSecurity.security.services;

import com.agustinperez.proyectoSecurity.model.User;
import com.agustinperez.proyectoSecurity.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceimpl implements UserDetailsService {

    private static final Logger log =
            LoggerFactory.getLogger(UserDetailsServiceimpl.class);

    private final UserRepository userRepository;

    public UserDetailsServiceimpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        log.debug("Loading user details for authentication | email={}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Authentication failed | reason=user not found");
                    return new UsernameNotFoundException("Email no encontrado: " + email);
                });

        log.debug("User details loaded successfully | email={}", email);

        return UserDetailsImpl.build(user);
    }
}