package com.agustinperez.proyectoSecurity.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Verificá tu cuenta de ReservaYa");
        message.setText(
                "¡Hola!\n\n" +
                        "Tu código de verificación es: " + code + "\n\n" +
                        "Este código vence en 15 minutos.\n\n" +
                        "¡Gracias por registrarte en ReservaYa!"
        );
        mailSender.send(message);
    }

    public void sendResetPasswordEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Recuperación de contraseña - ReservaYa");
        message.setText(
                "¡Hola!\n\n" +
                        "Recibimos una solicitud para restablecer tu contraseña.\n\n" +
                        "Tu código de recuperación es: " + token + "\n\n" +
                        "Este código vence en 15 minutos.\n\n" +
                        "Si no solicitaste este cambio, podés ignorar este correo."
        );
        mailSender.send(message);
    }

    public void sendReservationConfirmationEmail(
            String to,
            String customerName,
            Long reservationId,
            String productName,
            LocalDate startDate,
            LocalDate endDate
    ) {
        SimpleMailMessage message = new SimpleMailMessage();

        String formattedStartDate = startDate.format(DATE_FORMATTER);
        String formattedEndDate = endDate.format(DATE_FORMATTER);

        message.setTo(to);
        message.setSubject("¡Tu reserva está confirmada! - ReservaYa");

        message.setText(
                "¡Hola " + customerName + "!\n\n" +
                        "¡Tenemos buenas noticias! Tu reserva fue confirmada correctamente.\n\n" +
                        "DETALLES DE TU RESERVA\n" +
                        "----------------------------------------\n" +
                        "Número de reserva: #" + reservationId + "\n" +
                        "Alojamiento: " + productName + "\n" +
                        "Fecha de entrada: " + formattedStartDate + "\n" +
                        "Fecha de salida: " + formattedEndDate + "\n" +
                        "Estado: CONFIRMADA\n" +
                        "----------------------------------------\n\n" +
                        "¡Gracias por elegir ReservaYa!\n" +
                        "Esperamos que disfrutes tu estadía.\n\n" +
                        "El equipo de ReservaYa"
        );

        mailSender.send(message);
    }
}