package com.agustinperez.proyectoSecurity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordDTO {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato válido")
    private String email;
    @NotBlank(message = "El token es obligatorio")
    @Size(min = 6, max = 6, message = "El token debe tener 6 dígitos")
    private String token;
    @NotBlank(message = "Debe de ingresar la nueva contraseña")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String newPassword;

    public ResetPasswordDTO() {
    }

    public ResetPasswordDTO(String email, String token, String newPassword) {
        this.email = email;
        this.token = token;
        this.newPassword = newPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
