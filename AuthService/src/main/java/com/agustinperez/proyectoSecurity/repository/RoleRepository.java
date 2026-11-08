package com.agustinperez.proyectoSecurity.repository;

import com.agustinperez.proyectoSecurity.model.ERole;
import com.agustinperez.proyectoSecurity.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByNameRole(ERole nameRole);
}
