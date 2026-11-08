package com.agustinperez.proyectoSecurity.security.services;

import com.agustinperez.proyectoSecurity.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Getter
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String name;
    private String lastName;
    private String email;
    @JsonIgnore
    private String password;
    private boolean enabled;
    private Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(User user){
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getNameRole().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                    user.getId(), user.getName(),
                    user.getLastName(), user.getEmail(),
                    user.getPassword(),
                    user.isEnabled(),
                    authorities);
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
