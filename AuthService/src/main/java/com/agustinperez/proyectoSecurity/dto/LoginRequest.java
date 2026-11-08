package com.agustinperez.proyectoSecurity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato válido")
    private String email;
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 72,
            message = "La contraseña debe tener entre 8 y 72 caracteres")
    private String password;
}
